import {GinkgoContainer, ContextLink} from "./GinkgoContainer";
import {FragmentComponent, GinkgoComponent, GinkgoElement, HTMLComponent} from "./Ginkgo";
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
    rerender(isCallUpdate?: boolean): Array<ContextLink> {
        let time = new Date().getTime();
        this.compare(this.parent, this.elements, this.parent, isCallUpdate);
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

    private compare(parentLink: ContextLink, elements: GinkgoElement[], forceUpdate?: ContextLink, isCallUpdate = true) {
        let isContent = this.isComponentContent(parentLink);
        let component = parentLink.component;
        let shouldComponentUpdate = true;
        if (parentLink.status == "mount"
            && component
            && component.shouldComponentUpdate
            && parentLink !== forceUpdate) {
            shouldComponentUpdate = component.shouldComponentUpdate(parentLink.props as any, component.state);
        }

        if (shouldComponentUpdate) {
            if (isCallUpdate != false && parentLink.status != "new") {
                component.componentWillUpdate && component.componentWillUpdate(parentLink.props as any, component.state);
            }

            if (isContent && component != null) {
                let el = component.render ? component.render() : undefined;
                if (component instanceof BindComponent && parentLink.props && (parentLink.props as any).render) {
                    el = callBindRender(parentLink.props as BindComponentElement);
                }
                if (el && typeof el != "string") {
                    elements = [el];
                }
            }


            let children = isContent ? (parentLink.content ? [parentLink.content] : []) : parentLink.children;
            children = children || [];
            this.compareSibling(parentLink, children, elements);

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
                parentLink.content = children[0];
            } else {
                parentLink.children = children;
            }

            if (isCallUpdate != false && parentLink.status != "new") {
                component.componentDidUpdate && component.componentDidUpdate(parentLink.props as any, component.state);
                component.componentRenderUpdate && component.componentRenderUpdate(parentLink.props as any, component.state);
            }
        }

        let oldProps = {};
        if (parentLink.status === "compare") {
            oldProps = parentLink.oldProps;
            parentLink.oldProps = undefined;
        }
        component.componentReceiveProps && component.componentReceiveProps(parentLink.props as any, {
            oldProps: oldProps,
            type: parentLink.status == "new" ? "new" : "mounted"
        });
        if (parentLink.status === "compare") {
            component.componentCompareProps && component.componentCompareProps(parentLink.props as any, {
                oldProps: oldProps
            });
        }
        if (parentLink.status === "new") {
            component.componentDidMount && component.componentDidMount();
            component.componentRenderUpdate && component.componentRenderUpdate(parentLink.props as any, parentLink.component.state);
        }
        parentLink.status = "mount";
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
                    if (this.skips == null || this.skips.indexOf(treeNode) == -1) {
                        this.compareComponent(parent, treeNodes, treeNode, newNode, index);
                    }
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
        let previousSibling = this.getComponentRealDomWhenFind(treeNodes, lastIndex - 1);
        this.movingElement(parent, obj, previousSibling);
    }

    private insertTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, lastIndex, element: GinkgoElement) {
        let newNode;
        let previousSibling = this.getComponentRealDomWhenFind(treeNodes, lastIndex);
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
        let previousSibling = this.getComponentRealDomWhenFind(treeNodes, index - 1);
        let eq = this.compareComponentByLink(parent, treeNode, newNode, previousSibling);
        if (eq == false) {
            this.removeTreeNodes(parent, treeNodes, treeNode);
            this.insertTreeNodes(parent, treeNodes, index - 1, newNode);
        }
    }

    /************* 算法结束 ******************/

    private createElement(parent: ContextLink, element: GinkgoElement, previousSibling): ContextLink {
        if (element == null || element == undefined) return null; // 判断props不能为空否则遍历会取到body容器

        let link: ContextLink = this.mountCreateFragmentLink(parent, element),
            component = link.component;

        // 生命周期第一个
        component.componentWillMount && component.componentWillMount();
        this.relevanceElementShould(link);
        if (link && link.holder && link.holder.dom && parent.shouldEl) {
            if (previousSibling) {
                (previousSibling.parentElement as any).insertBefore(link.holder.dom, previousSibling.nextSibling);
            } else {
                let pps = parent.previousSibling;
                if (pps) {
                    (pps.parentElement as any).insertBefore(link.holder.dom, pps.nextSibling);
                    parent.previousSibling = undefined;
                } else {
                    parent.shouldEl.append(link.holder.dom);
                }
            }
        } else {
            link.shouldEl = parent.shouldEl;
            link.previousSibling = previousSibling || parent.previousSibling;
        }

        this.buildChildrenRef(link);
        this.makeWillPropsLife(component, link.props, {}, "new", true);

        return link;
    }

    private movingElement(parent: ContextLink, current: ContextLink, previousSibling) {
        let doms = this.getComponentRealDom(current, 2);
        if (doms && doms.length > 0) {
            for (let dom of doms) {
                (previousSibling.parentElement as any).insertBefore(dom, previousSibling.nextSibling);
                previousSibling = dom;
            }
        }
    }

    private compareComponentByLink(parent: ContextLink, compareLink: ContextLink, props: GinkgoElement, previousSibling): boolean {
        let compareProps = compareLink.props;
        let component = compareLink.component;
        let oldProps = compareProps;

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
                    compareLink.status = "compare";
                    compareLink.oldProps = oldProps;
                }
            } else {
                return false;
            }
        } else if (compareProps
            && typeof compareProps == "object"
            && component
            && props.module == compareProps.module) {
            compareLink.props = props;
            (component as any).props = props;

            this.clearPropsEmptyChildren(props);

            /**
             * 处理之前先将默认值重新赋值
             */
            GinkgoContainer.setDefaultProps(component, component.props);

            let isChildrenChanged = false;
            let newChild = props.children;
            let oldChild = (oldProps as GinkgoElement).children;
            if (component.componentChildChange && !(component instanceof BindComponent)) {
                let changed = false;
                if ((newChild != null || oldChild != null)
                    && ((newChild == null && oldChild != null)
                        || (oldChild == null && newChild != null)
                        || newChild.length != oldChild.length)) {
                    changed = true;
                } else if (newChild && oldChild && newChild.length == oldChild.length) {
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
            this.makeWillPropsLife(component, props, oldProps, "mounted", true);
            this.makeWillPropsLife(component, props, oldProps, "mounted", false);

            if (isChildrenChanged) {
                component.componentChildChange(newChild, oldChild);
            }

            compareLink.status = "compare";
            compareLink.oldProps = oldProps;
        } else {
            return false;
        }
        return true;
    }

    private unbindComponent(parent: ContextLink, current: ContextLink) {
        GinkgoContainer.unmountComponentByLink(current);
    }

    private relevanceElementShould(link: ContextLink) {
        let component = link.component;
        let props = link.props;
        if (component instanceof HTMLComponent && typeof props === "object") {
            link.shouldEl = link.holder.dom as any;
        }
    }


    private mountCreateFragmentLink(parent: ContextLink, props: GinkgoElement | string): ContextLink {
        let component,
            link: ContextLink,
            parentComponent = parent ? parent.component : undefined;

        this.clearPropsEmptyChildren(props);
        component = GinkgoContainer.parseComponentByElement(props);
        component.parent = parentComponent;

        let holder;
        if (component instanceof HTMLComponent || component instanceof TextComponent) holder = {dom: component.dom};
        link = {
            component: component,
            holder: holder,
            props: props,
            parent: parent,
            status: "new"
        };

        if (component && !(component instanceof TextComponent)) {
            this.context.push(link);
        }

        return link;
    }

    private setLinkParent(parent: ContextLink, link: ContextLink) {
        if (parent && link) {
            link.parent = parent;
            link.component.parent = parent.component;
        }
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

    /**
     * 给ref赋值
     *
     * @param link
     */
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

    private getComponentRealDomWhenFind(links: Array<ContextLink>, index: number) {
        for (let i = index; i >= 0; i--) {
            let link = links[i];
            let dom = this.getComponentRealDom(link, 1);
            if (dom) return dom;
        }
    }

    /**
     * 获取自定义组件的第一个或者最后一个真实dom
     * @param child
     * @param type 0获取第一个  1获取最后一个 2获取第一层列表
     */
    private getComponentRealDom(link: ContextLink, type: number) {
        if (link) {
            if (link.component instanceof HTMLComponent || link.component instanceof TextComponent) {
                return type == 2 ? [link.holder.dom] : link.holder.dom;
            } else {
                if (link.content) {
                    return this.getComponentRealDom(link.content, type);
                } else if (link.children) {
                    let children = link.children;
                    if (type == 0) {
                        for (let item of children) {
                            let dom = this.getComponentRealDom(item, type);
                            if (dom) return dom;
                        }
                    }
                    if (type == 1) {
                        for (let i = children.length - 1; i >= 0; i--) {
                            let item = children[i];
                            let dom = this.getComponentRealDom(item, type);
                            if (dom) return dom;
                        }
                    }
                    if (type == 2) {
                        let arr = [];
                        for (let item of children) {
                            let dom = this.getComponentRealDom(item, type);
                            if (dom) arr.push(dom);
                        }
                        return arr;
                    }
                }
            }
        }
        return null;
    }

    private makeWillPropsLife(component: GinkgoComponent,
                              props,
                              oldProps,
                              type: "new" | "mounted",
                              isReceive: boolean) {
        let state;
        component['_disableSetStateCall'] = true;
        if (isReceive) {
            state = component.componentWillReceiveProps && component.componentWillReceiveProps(props, {
                oldProps: oldProps, type: type
            });
        } else {
            state = component.componentWillCompareProps && component.componentWillCompareProps(props, {
                oldProps
            })
        }
        component['_disableSetStateCall'] = false;
        if (state) {
            let oldState = component.state;
            if (oldState == null) oldState = {};
            for (let key in state) {
                oldState[key] = state[key];
            }
            component.state = oldState;
        }
    }
}
