import {GinkgoContainer, ContextLink, ComponentWrapper} from "./GinkgoContainer";
import {FragmentComponent, GinkgoElement, HTMLComponent} from "./Ginkgo";
import {GinkgoComponent} from "./GinkgoComponent";
import {TextComponent} from "./TextComponent";
import {BindComponent, BindComponentElement, callBindRender} from "./BindComponent";

export class GinkgoCompare {
    private readonly context: Array<ContextLink>;
    private readonly parent: ContextLink;
    private elements?: GinkgoElement[];
    private skips?: ContextLink[];

    constructor(context: Array<ContextLink>,
                parent: ContextLink,
                elements?: GinkgoElement[] | undefined) {
        this.context = context;
        this.parent = parent;
        this.elements = elements;
    }

    /**
     * important!
     *
     * 将一组元素实例并挂载到parent中去
     */
    mount(): Array<ContextLink> {
        if (this.elements) {
            this.elements = this.elements.filter(value => value != null && value != undefined);
            let time = new Date().getTime();
            this.compare(this.parent, this.elements);
            console.log((new Date().getTime() - time) + "ms");
        } else {
            GinkgoContainer.unmountComponentByLinkChildren(this.parent);
        }

        return this.context;
    }

    /**
     * important!
     *
     * 重新渲染一个组件的content内容
     */
    rerender(): Array<ContextLink> {
        let time = new Date().getTime();
        this.compare(this.parent, this.elements);
        console.log((new Date().getTime() - time) + "ms");

        return this.context;
    }

    /**
     * important!
     *
     * 触发重新渲染BindComponent的子元素
     */
    force(): Array<ContextLink> {
        if (this.parent && this.parent.component instanceof BindComponent) {
            let time = new Date().getTime();
            this.compare(this.parent, this.elements);
            console.log((new Date().getTime() - time) + "ms");
        }

        return this.context;
    }

    setSkipCompare(elements: ContextLink[]) {
        this.skips = elements;
    }

    /************* 算法开始 ******************/

    private compare(parent: ContextLink, elements: GinkgoElement[]) {
        let isContent = this.isComponentContent(parent);
        let component = parent.component;
        if (isContent && component != null) {
            let el = component.render ? component.render() : undefined;
            if (component instanceof BindComponent && parent.props && (parent.props as any).render) {
                el = callBindRender(parent.props as BindComponentElement);
            }
            if (el && typeof el != "string") {
                elements = [el];
            }
        }


        let children = isContent ? (parent.content ? [parent.content] : []) : parent.children;
        children = children || [];
        this.compareSibling(parent, children, elements);

        if (children && children.length > 0) {
            let index = 1;
            for (let ch of children) {
                // ch.props 是上一次对比后的新的props
                // 所以也包含需要对比的新的子元素列表
                ch.mountIndex = index;
                let props = ch.props;
                if (typeof props !== "string") {
                    this.compare(ch, props.children);
                } else {
                    ch.status = "mount";
                }

                index++;
            }
        }
        if (isContent) {
            parent.content = children[0];
        } else {
            parent.children = children;
        }

        component.componentReceiveProps && component.componentReceiveProps(parent.props, {
            oldProps: {},
            type: parent.status == "new" ? "new" : "mounted"
        });
        component.componentDidMount && component.componentDidMount();
        parent.status = "mount";
    }

    private isComponentContent(link: ContextLink) {
        let component = link.component;
        if (!(component instanceof HTMLComponent)
            && !(component instanceof TextComponent)
            && !GinkgoContainer.isBaseType(link.props)
            && !(component instanceof FragmentComponent)) {
            return true;
        }
        if (component instanceof BindComponent) {
            return true;
        }
        return false;
    }

    private compareSibling(parent: ContextLink,
                           treeNodes: Array<ContextLink>,
                           newNodes: Array<GinkgoElement>) {
        if (newNodes == null || newNodes.length == 0) {
            if (treeNodes != null) {
                for (let treeNode of treeNodes) {
                    this.removeTreeNodes(parent, treeNodes, treeNode);
                }
            }
        } else {
            let lastIndex = 0, i = 1;
            for (let newNode of newNodes) {
                let index = this.elementIndexTreeNodes(treeNodes, newNode, i);
                if (index >= 0) {
                    let treeNode = treeNodes[index];
                    // 需要排除新建的组件
                    this.compareComponent(parent, treeNodes, treeNode, newNode, index);
                    if (index < lastIndex) {
                        // 将treeNode移动到treeNodes的lastIndex位置，lastIndex之前的元素前移
                        this.moveTreeNodes(parent, treeNodes, index, lastIndex);
                    }
                    lastIndex = index > lastIndex ? index : lastIndex;
                } else {
                    // 在 treeNodes 中，创建 newNode 并将 newNode 插入到 lastIndex 位置后，相应元素后移一位
                    this.insertTreeNodes(parent, treeNodes, lastIndex, newNode);
                    lastIndex = lastIndex + 1;
                }
                i++;
            }

            let copyTreeNodes = [...treeNodes];
            for (let treeNode of copyTreeNodes) {
                let index = this.checkTreeNodeRemove(newNodes, treeNode);
                if (index == -1) {
                    // 在 treeNodes 中，删除 treeNode
                    this.removeTreeNodes(parent, treeNodes, treeNode);
                }
            }
        }
    }

    private elementIndexTreeNodes(treeNodes: Array<ContextLink>, element: GinkgoElement, index) {
        for (let i = 0; i < treeNodes.length; i++) {
            let props = treeNodes[i].props as GinkgoElement;
            if (element.key == null && props.key == null) {
                if (index === treeNodes[i].mountIndex) {
                    return i;
                }
            }
            if (element.key != null && props.key != null) {
                if (element.key === props.key) {
                    return i;
                }
            }
        }
        return -1
    }

    private checkTreeNodeRemove(newNodes: Array<GinkgoElement>, link: ContextLink) {
        if (link.status == "new") {
            return 0;
        }
        let props = link.props as GinkgoElement;
        for (let i = 0; i < newNodes.length; i++) {
            let newNode = newNodes[i];
            if (newNode.key == null && props.key == null) {
                if ((i + 1) === link.mountIndex) {
                    return i;
                }
            }
            if (newNode.key != null && props.key != null) {
                if (newNode.key === props.key) {
                    return i;
                }
            }
        }
        return -1;
    }


    private moveTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, index, lastIndex) {
        let obj = treeNodes[index];
        for (let i = index; i < lastIndex; i++) {
            treeNodes[i] = treeNodes[i + 1];
        }
        treeNodes[lastIndex] = obj;
        let previousSibling = lastIndex > 0 ? treeNodes[lastIndex - 1] : undefined;
        this.movingElement(parent, obj, previousSibling);
    }

    private insertTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, lastIndex, element: GinkgoElement) {
        let newNode;
        let previousSibling = treeNodes && treeNodes.length > 0 ? treeNodes[treeNodes.length - 1] : undefined;
        newNode = this.createElement(parent, element, previousSibling);
        treeNodes.splice(lastIndex + 1, 0, newNode);
    }

    private removeTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, treeNode: ContextLink) {
        treeNodes.splice(treeNodes.indexOf(treeNode), 1);
        this.unbindComponent(parent, treeNode);
    }

    protected compareComponent(parent: ContextLink,
                               treeNodes: Array<ContextLink>,
                               treeNode: ContextLink,
                               newNode: GinkgoElement,
                               index) {
        let previousSibling = index >= 1 ? treeNodes[index - 1] : undefined;
        let eq = this.compareComponentByLink(parent, treeNode, newNode, previousSibling);
        if (eq == false) {
            this.removeTreeNodes(parent, treeNodes, treeNode);
            this.insertTreeNodes(parent, treeNodes, index - 1, newNode);
        }
    }

    /************* 算法结束 ******************/

    private createElement(parent: ContextLink, element: GinkgoElement, previousSibling: ContextLink): ContextLink {
        if (element == null || element == undefined) return null; // 判断props不能为空否则遍历会取到body容器

        let link: ContextLink = this.mountCreateFragmentLink(parent, element),
            component = link.component;

        // 生命周期第一个
        component.componentWillMount && component.componentWillMount();
        this.buildRealDom(link);
        if (link && link.holder && link.holder.dom && parent.shouldEl) {
            parent.shouldEl.append(link.holder.dom);
        } else {
            link.shouldEl = parent.shouldEl;
        }

        this.buildChildrenRef(link)

        return link;
    }

    private movingElement(parent: ContextLink, current: ContextLink, previousSibling: ContextLink) {

    }

    private compareComponentByLink(parent: ContextLink, compareLink: ContextLink, props: GinkgoElement, previousSibling: ContextLink): boolean {
        let compareProps = compareLink.props;
        let component = compareLink.component;

        if (compareProps && component && component instanceof TextComponent) {
            /**
             * 如果一个文本节点变成了dom元素，则需要重新设置结构。
             * 比如，<span>abc</span> 变成了 <span><span>abc</span></span>
             * 这个时候需要卸载原有节点并重新创建一个新的节点
             */
            if (GinkgoContainer.isBaseType(props)) {
                if (compareProps != props && compareLink.status != "new") {
                    let newText = "" + props;
                    compareLink.props = newText;
                    if (compareLink.holder && compareLink.holder.dom) {
                        (compareLink.holder.dom as Text).textContent = newText;
                    }
                }
            } else {
                return false;
            }
        } else if (compareProps
            && typeof compareProps == "object"
            && component
            && props.module == compareProps.module) {

            let oldProps = compareProps;
            compareLink.props = props;
            (component as any).props = props;

            this.clearPropsEmptyChildren(props);

            /**
             * 处理之前先将默认值重新赋值
             */
            GinkgoContainer.setDefaultProps(component, component.props);

            let isChildrenChanged = false;
            let newChild = props.children;
            let oldChild = oldProps.children;
            if (component.componentChildChange && !(component instanceof BindComponent)) {
                let changed = false;
                if ((newChild != null || oldChild != null)
                    && ((newChild == null && oldChild != null)
                        || (oldChild == null && newChild != null)
                        || newChild.length != oldChild.length)) {
                    changed = true;
                }

                if (newChild && oldChild && newChild.length == oldChild.length) {
                    let i = 0;
                    for (let c of newChild) {
                        if (c.module != oldChild[i].module) {
                            changed = true;
                            break;
                        }
                        i++;
                    }
                }

                if (changed) {
                    isChildrenChanged = true;
                }
            }

            let contextWrap: any = {
                oldProps
            }
            if (isChildrenChanged) {
                contextWrap.childChange = true;
                contextWrap.children = newChild;
                contextWrap.oldChildren = oldChild;
            }
            component.componentReceiveProps && component.componentReceiveProps(props, {
                ...contextWrap,
                type: "mounted"
            });
            component.componentUpdateProps && component.componentUpdateProps(props, contextWrap);

            if (isChildrenChanged) {
                component.componentChildChange(newChild, oldChild);
            }

            // 如果是Bind组件则调用组件更新获取最新的绑定元素
            // Bind组件的获取的元素作为content内容
            // Bind组件的更新分为跟随父元素更新和使用绑定数据更新
            // if (component instanceof BindComponent) {
            //     component.forceRender();
            // }
        } else {
            return false;
        }
        return true;
    }

    private unbindComponent(parent: ContextLink, current: ContextLink) {
        GinkgoContainer.unmountComponentByLink(current);
    }

    private buildRealDom(link: ContextLink) {
        let component = link.component;
        let props = link.props;
        if (component instanceof HTMLComponent && typeof props === "object") {
            let type = props.module;
            if (typeof type == "string") {
                let el = document.createElement(type);
                link.holder.dom = el;
                link.shouldEl = el;
            } else {
                throw Error("not support html tag " + type + ".");
            }
        }

        if (component instanceof TextComponent && GinkgoContainer.isBaseType(props)) {
            let text = document.createTextNode("" + component.text);
            if (link && link.holder) {
                link.holder.dom = text;
            } else if (link) {
                link.holder = {dom: text};
            }
        }
    }


    private mountCreateFragmentLink(parent: ContextLink, props: GinkgoElement | string): ContextLink {
        let component,
            link: ContextLink,
            parentComponent = parent ? parent.component : undefined,
            wrapper: ComponentWrapper;

        this.clearPropsEmptyChildren(props);
        wrapper = GinkgoContainer.parseComponentByElement(props);
        component = wrapper.component;
        component.parent = parentComponent;

        link = {
            component: component,
            holder: wrapper.holder,
            props: props,
            parent: parent,
            status: "new"
        };

        if (component && !(component instanceof TextComponent)) {
            this.context.push(link);
        }

        return link;
    }

    private clearPropsEmptyChildren(props: GinkgoElement | string) {
        if (!GinkgoContainer.isBaseType(props)) {
            let children = (props as GinkgoElement).children,
                newChildren;
            if (children) {
                for (let c of children) {
                    if (c == undefined) {
                        newChildren = [];
                        break;
                    }
                }
                if (newChildren) {
                    for (let c of children) {
                        if (c) newChildren.push(c);
                    }
                }
            }

            if (newChildren) {
                (props as GinkgoElement).children = newChildren;
            }
        }
    }

    private buildChildrenRef(link: ContextLink) {
        let props = link.props;
        let childComponent = link.component;

        if (props
            && typeof props == "object"
            && props.ref && childComponent) {
            if (typeof props.ref === "function") {
                props.ref(childComponent);
            }
            if (typeof props.ref === "object") {
                props.ref.instance = childComponent;
            }
        }
    }
}
