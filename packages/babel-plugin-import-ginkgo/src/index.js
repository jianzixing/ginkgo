const babel = require("@babel/core");
const types = require("@babel/types");
const jsx = require("@babel/plugin-syntax-jsx");
const esutils = require("esutils");
const generate = require("babel-generator").default;
const template = require("babel-template");

const type = types;

/**
 * 解决由于插件 plugin-transform-typescript 导致的，在typescript下清空未使用的import
 * 程序报错 Ginkgo is not defined。
 *
 * 报错原因是这个插件的 jsxPragma = "React" 固定死了。
 *
 * 解决方式是如果一开始就import 了 Ginkgo 则在babel结束后再添加上
 *
 * @param api
 * @param options
 * @returns {{post(*), visitor: {Program: {exit(*, *): void, enter(*, *): void}, VariableDeclaration(*=): void}}}
 */

module.exports = function (api, options) {
    api.assertVersion(7);

    let hasGinkgoImport = false;

    return {
        visitor: {
            VariableDeclaration(path) {
            },
            Program: {
                enter(path, state) {
                    hasGinkgoImport = hasJSXImport(path);
                },
                exit(path, state) {
                    if (hasGinkgoImport && !hasJSXImport(path)) {
                        let ginkgo = types.importDeclaration([type.importDefaultSpecifier(type.identifier("Ginkgo"))], type.stringLiteral("ginkgoes"));
                        // path.insertBefore(type.expressionStatement(ginkgo));
                        path.unshiftContainer('body', ginkgo);
                    }
                }

            }
        },
        post(state) {
            // 结束后的清理工作
        }
    };
};

function hasJSXImport(path) {
    let body = path.get('body');
    for (let stmt of body) {
        if (babel.types.isImportDeclaration(stmt)) {
            if (stmt.node.specifiers.length === 0) {
                continue;
            }

            for (const specifier of stmt.node.specifiers) {
                const binding = stmt.scope.getBinding(specifier.local.name);

                if (binding && binding.identifier.name === "Ginkgo") {
                    return true;
                }
            }
        }
    }
    return false;
}
