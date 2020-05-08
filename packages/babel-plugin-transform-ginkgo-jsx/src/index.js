const babel = require("@babel/core");
const types = require("@babel/types");
const jsx = require("@babel/plugin-syntax-jsx");
const esutils = require("esutils");

const t = types;

module.exports = function (api, options) {
    api.assertVersion(7);

    const THROW_IF_NAMESPACE =
        options.throwIfNamespace === undefined ? true : !!options.throwIfNamespace;

    const PRAGMA_DEFAULT = options.pragma || "Ginkgo.createElement";
    const PRAGMA_FRAG_DEFAULT = options.pragmaFrag || "Ginkgo.Fragment";

    const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
    const JSX_FRAG_ANNOTATION_REGEX = /\*?\s*@jsxFrag\s+([^\s]+)/;

    // returns a closure that returns an identifier or memberExpression node
    // based on the given id
    const createIdentifierParser = (id) => () => {
        return id
            .split(".")
            .map(name => t.identifier(name))
            .reduce((object, property) => t.memberExpression(object, property));
    };

    const visitor = helper({
        pre(state) {
            const tagName = state.tagName;
            const args = state.args;
            if (t.react.isCompatTag(tagName)) {
                args.push(t.stringLiteral(tagName));
            } else {
                args.push(state.tagExpr);
            }
        },

        post(state, pass) {
            state.callee = pass.get("jsxIdentifier")();
        },

        throwIfNamespace: THROW_IF_NAMESPACE,
    });

    visitor.Program = {
        enter(path, state) {
            const {file} = state;

            let pragma = PRAGMA_DEFAULT;
            let pragmaFrag = PRAGMA_FRAG_DEFAULT;
            let pragmaSet = !!options.pragma;
            let pragmaFragSet = !!options.pragmaFrag;

            if (file.ast.comments) {
                for (const comment of (file.ast.comments)) {
                    const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);
                    if (jsxMatches) {
                        pragma = jsxMatches[1];
                        pragmaSet = true;
                    }
                    const jsxFragMatches = JSX_FRAG_ANNOTATION_REGEX.exec(comment.value);
                    if (jsxFragMatches) {
                        pragmaFrag = jsxFragMatches[1];
                        pragmaFragSet = true;
                    }
                }
            }

            state.set("jsxIdentifier", createIdentifierParser(pragma));
            state.set("jsxFragIdentifier", createIdentifierParser(pragmaFrag));
            state.set("usedFragment", false);
            state.set("pragmaSet", pragmaSet);
            state.set("pragmaFragSet", pragmaFragSet);
        },
        exit(path, state) {
            if (
                state.get("pragmaSet") &&
                state.get("usedFragment") &&
                !state.get("pragmaFragSet")
            ) {
                throw new Error(
                    "transform-ginkgo-jsx: pragma has been set but " +
                    "pragmaFrag has not been set",
                );
            }
        },
    };

    visitor.JSXAttribute = function (path) {
        if (t.isJSXElement(path.node.value)) {
            path.node.value = t.jsxExpressionContainer(path.node.value);
        }
    };

    return {
        name: "transform-ginkgo-jsx",
        inherits: jsx.default,
        visitor,
    };
};


// const ElementState = {
//     tagExpr: Object, // tag node
//     tagName: ?string, // raw string tag name
//     args: Array<Object>, // array of call arguments
//     call?: Object, // optional call property that can be set to override the call expression returned
// };

function helper(opts) {
    const visitor = {};

    visitor.JSXNamespacedName = function (path) {
        if (opts.throwIfNamespace) {
            throw path.buildCodeFrameError(
                `Namespace tags are not supported by default. Ginkgo's JSX doesn't support namespace tags. \
You can turn on the 'throwIfNamespace' flag to bypass this warning.`,
            );
        }
    };

    visitor.JSXSpreadChild = function (path) {
        throw path.buildCodeFrameError(
            "Spread children are not supported in Ginkgo.",
        );
    };

    visitor.JSXElement = {
        exit(path, file) {
            const callExpr = buildElementCall(path, file);
            if (callExpr) {
                path.replaceWith(t.inherits(callExpr, path.node));
            }
        },
    };

    visitor.JSXFragment = {
        exit(path, file) {
            if (opts.compat) {
                throw path.buildCodeFrameError(
                    "Fragment tags are not support yet",
                );
            }
            const callExpr = buildFragmentCall(path, file);
            if (callExpr) {
                path.replaceWith(t.inherits(callExpr, path.node));
            }
        },
    };

    return visitor;

    function convertJSXIdentifier(node, parent) {
        if (t.isJSXIdentifier(node)) {
            if (node.name === "this" && t.isReferenced(node, parent)) {
                return t.thisExpression();
            } else if (esutils.keyword.isIdentifierNameES6(node.name)) {
                node.type = "Identifier";
            } else {
                return t.stringLiteral(node.name);
            }
        } else if (t.isJSXMemberExpression(node)) {
            return t.memberExpression(
                convertJSXIdentifier(node.object, node),
                convertJSXIdentifier(node.property, node),
            );
        } else if (t.isJSXNamespacedName(node)) {
            /**
             * If there is flag "throwIfNamespace"
             * print XMLNamespace like string literal
             */
            return t.stringLiteral(`${node.namespace.name}:${node.name.name}`);
        }

        return node;
    }

    function convertAttributeValue(node) {
        if (t.isJSXExpressionContainer(node)) {
            return node.expression;
        } else {
            return node;
        }
    }

    function convertAttribute(node) {
        const value = convertAttributeValue(node.value || t.booleanLiteral(true));

        if (t.isJSXSpreadAttribute(node)) {
            return t.spreadElement(node.argument);
        }

        if (t.isStringLiteral(value) && !t.isJSXExpressionContainer(node.value)) {
            value.value = value.value.replace(/\n\s+/g, " ");

            // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.
            if (value.extra) delete value.extra.raw;
        }

        if (t.isJSXNamespacedName(node.name)) {
            node.name = t.stringLiteral(
                node.name.namespace.name + ":" + node.name.name.name,
            );
        } else if (esutils.keyword.isIdentifierNameES6(node.name.name)) {
            node.name.type = "Identifier";
        } else {
            node.name = t.stringLiteral(node.name.name);
        }

        return t.inherits(t.objectProperty(node.name, value), node);
    }

    function buildElementCall(path, file) {
        if (opts.filter && !opts.filter(path.node, file)) return;

        const openingPath = path.get("openingElement");
        openingPath.parent.children = t.react.buildChildren(openingPath.parent);

        const tagExpr = convertJSXIdentifier(
            openingPath.node.name,
            openingPath.node,
        );
        const args = [];

        let tagName;
        if (t.isIdentifier(tagExpr)) {
            tagName = tagExpr.name;
        } else if (t.isLiteral(tagExpr)) {
            tagName = tagExpr.value;
        }

        const state = {
            tagExpr: tagExpr,
            tagName: tagName,
            args: args,
        };

        if (opts.pre) {
            opts.pre(state, file);
        }

        let attribs = openingPath.node.attributes;
        if (attribs.length) {
            attribs = buildOpeningElementAttributes(attribs, file);
        } else {
            attribs = t.nullLiteral();
        }

        args.push(attribs, ...path.node.children);

        if (opts.post) {
            opts.post(state, file);
        }

        return state.call || t.callExpression(state.callee, args);
    }

    function pushProps(_props, objs) {
        if (!_props.length) return _props;

        objs.push(t.objectExpression(_props));
        return [];
    }

    /**
     * The logic for this is quite terse. It's because we need to
     * support spread elements. We loop over all attributes,
     * breaking on spreads, we then push a new object containing
     * all prior attributes to an array for later processing.
     */

    function buildOpeningElementAttributes(attribs, file) {
        let _props = [];
        const objs = [];

        const {useSpread = false} = file.opts;
        if (typeof useSpread !== "boolean") {
            throw new Error(
                "transform-ginkgo-jsx currently only accepts a boolean option for " +
                "useSpread (defaults to false)",
            );
        }

        const useBuiltIns = file.opts.useBuiltIns || false;
        if (typeof useBuiltIns !== "boolean") {
            throw new Error(
                "transform-ginkgo-jsx currently only accepts a boolean option for " +
                "useBuiltIns (defaults to false)",
            );
        }

        if (useSpread && useBuiltIns) {
            throw new Error(
                "transform-ginkgo-jsx currently only accepts useBuiltIns or useSpread " +
                "but not both",
            );
        }

        if (useSpread) {
            const props = attribs.map(convertAttribute);
            return t.objectExpression(props);
        }

        while (attribs.length) {
            const prop = attribs.shift();
            if (t.isJSXSpreadAttribute(prop)) {
                _props = pushProps(_props, objs);
                objs.push(prop.argument);
            } else {
                _props.push(convertAttribute(prop));
            }
        }

        pushProps(_props, objs);

        if (objs.length === 1) {
            // only one object
            attribs = objs[0];
        } else {
            // looks like we have multiple objects
            if (!t.isObjectExpression(objs[0])) {
                objs.unshift(t.objectExpression([]));
            }

            const helper = useBuiltIns
                ? t.memberExpression(t.identifier("Object"), t.identifier("assign"))
                : file.addHelper("extends");

            // spread it
            attribs = t.callExpression(helper, objs);
        }

        return attribs;
    }

    function buildFragmentCall(path, file) {
        if (opts.filter && !opts.filter(path.node, file)) return;

        const openingPath = path.get("openingElement");
        openingPath.parent.children = t.react.buildChildren(openingPath.parent);

        const args = [];
        const tagName = null;
        const tagExpr = file.get("jsxFragIdentifier")();

        const state = {
            tagExpr: tagExpr,
            tagName: tagName,
            args: args,
        };

        if (opts.pre) {
            opts.pre(state, file);
        }

        // no attributes are allowed with <> syntax
        args.push(t.nullLiteral(), ...path.node.children);

        if (opts.post) {
            opts.post(state, file);
        }

        file.set("usedFragment", true);
        return state.call || t.callExpression(state.callee, args);
    }
}
