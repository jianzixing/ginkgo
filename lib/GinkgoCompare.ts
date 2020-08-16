import {GinkgoContainer, ContextLink} from "./GinkgoContainer";
import {FragmentComponent, GinkgoComponent, GinkgoElement, HTMLComponent} from "./Ginkgo";
import {TextComponent} from "./TextComponent";
import {BindComponent, BindComponentElement, callBindRender} from "./BindComponent";

export class GinkgoCompare {
    private readonly parent: ContextLink;
    private elements?: GinkgoElement[];
    private skips?: ContextLink[];

    constructor(parent: ContextLink,
                elements?: GinkgoElement[] | undefined) {
        this.parent = parent;
        this.elements = elements;
    }

    /**
     * important!
     *
     * 将一组元素实例并挂载到parent中去
     */
    mount(): void {
        if (this.elements) {
            this.elements = this.elements.filter(value => value != null && value != undefined);
            this.compare(this.parent, this.elements);
        } else {
            GinkgoContainer.unmountComponentByLinkChildren(this.parent);
        }
    }

    /**
     * important!
     *
     * 重新渲染一个组件的content内容
     */
    rerender(isCallUpdate?: boolean): void {
        this.compare(this.parent, this.elements, this.parent, isCallUpdate);
    }

    /**
     * important!
     *
     * 触发重新渲染BindComponent的子元素
     */
    force(): void {
        if (this.parent && this.parent.component instanceof BindComponent) {
            this.compare(this.parent, this.elements);
        }
    }

    setSkipCompare(elements: ContextLink[]) {
        this.skips = elements;
    }

    /************* 算法开始 ******************/

    private compare(parentLink: ContextLink,
                    elements: GinkgoElement[],
                    forceUpdate?: ContextLink,
                    isCallUpdate = true) {
        let isContent = this.isComponentContent(parentLink);
        let component = parentLink.component;
        let shouldComponentUpdate = true;
        if ((parentLink.status == "mount" || parentLink.status == "compare")
            && component
            && component.shouldComponentUpdate
            && parentLink !== forceUpdate) {
            try {
                shouldComponentUpdate = component.shouldComponentUpdate(parentLink.props as any, {
                    oldProps: component.props,
                    state: component.state
                });
            } catch (e) {
                if (console && console.error) console.error(e);
            }
        }

        if (isContent
            && typeof parentLink.props === "object"
            && parentLink.props.children
            && parentLink.props.children.length > 0) {
            let directLinkChildren = parentLink.children || [];

            this.compareSibling(null, directLinkChildren, parentLink.props.children, false);
            parentLink.children = directLinkChildren;

            let directChildren;
            for (let child of parentLink.children) {
                if (child) {
                    if (directChildren == null) directChildren = [];
                    directChildren.push(child.component);
                }
            }
            parentLink.component.children = directChildren;
        }

        if (shouldComponentUpdate) {
            if (isCallUpdate != false && parentLink.status != "new") {
                try {
                    component.componentWillUpdate && component.componentWillUpdate(parentLink.props as any, {
                        oldProps: component.props,
                        state: component.state
                    });
                } catch (e) {
                    if (console && console.error) console.error(e);
                }
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
        }

        let children;
        if (shouldComponentUpdate) {
            children = isContent ? (parentLink.content ? [parentLink.content] : []) : parentLink.children;
            children = children || [];
            this.compareSibling(parentLink, children, elements);

            if (children && children.length > 0) {
                if (isContent) {
                    parentLink.content = children[0];
                    if (parentLink.component) parentLink.component.content = children[0].component;
                } else {
                    parentLink.children = children;
                }
            }
        }

        if (!isContent && parentLink && parentLink.children && parentLink.children.length > 0) {
            let directChildren;
            for (let child of parentLink.children) {
                if (directChildren == null) directChildren = [];
                directChildren.push(child.component);
            }
            parentLink.component.children = directChildren;
        }

        if (shouldComponentUpdate) {
            if (children && children.length > 0) {
                for (let index = 0; index < children.length; index++) {
                    let ch = children[index];
                    let nextCh = index < children.length ? children[index + 1] : undefined;
                    // ch.props 是上一次对比后的新的props
                    // 所以也包含需要对比的新的子元素列表
                    let mountIndex = index + 1;
                    let isSkip = false;
                    ch.mountIndex = mountIndex;
                    ch.nextSibling = nextCh;

                    if (this.skips && this.skips.indexOf(ch) >= 0) {
                        isSkip = true;
                    }

                    if ((ch.status == "compare" || ch.status == "retain") && isSkip === false) {
                        this.compareComponentByLink(parentLink, ch, ch.compareProps);
                    }
                    // 渲染到dom上
                    this.mountRealDom2Document(parentLink, ch, nextCh, index);

                    let props = ch.props;
                    if (typeof props !== "string") {
                        if (isSkip) continue;
                        this.compare(ch, props.children);
                    } else {
                        ch.status = "mount";
                    }
                }
            }
        }

        let oldProps = {};
        if (parentLink.status === "compare") {
            oldProps = parentLink.oldProps;
            parentLink.oldProps = undefined;
        }
        try {
            component.componentReceiveProps && component.componentReceiveProps(component.props, {
                oldProps: oldProps,
                type: parentLink.status == "new" ? "new" : "mounted"
            });
        } catch (e) {
            if (console && console.error) console.error(e);
        }
        if (parentLink.status === "compare") {
            try {
                component.componentCompareProps && component.componentCompareProps(component.props, {
                    oldProps: oldProps
                });
            } catch (e) {
                if (console && console.error) console.error(e);
            }
        }

        if (shouldComponentUpdate) {
            if (isCallUpdate != false && parentLink.status != "new") {
                try {
                    component.componentDidUpdate && component.componentDidUpdate(component.props, {
                        oldProps: oldProps,
                        state: component.state
                    });
                } catch (e) {
                    if (console && console.error) console.error(e);
                }
                try {
                    component.componentRenderUpdate && component.componentRenderUpdate(component.props, {
                        oldProps: oldProps,
                        state: component.state
                    });
                } catch (e) {
                    if (console && console.error) console.error(e);
                }
            }
        }

        if (parentLink.status === "new") {
            try {
                component.componentDidMount && component.componentDidMount();
            } catch (e) {
                if (console && console.error) console.error(e);
            }
            try {
                component.componentRenderUpdate && component.componentRenderUpdate(component.props, {
                    oldProps: oldProps,
                    state: parentLink.component.state
                });
            } catch (e) {
                if (console && console.error) console.error(e);
            }
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
                           newNodes: Array<GinkgoElement>,
                           onlyDiff: boolean = true) {
        if (newNodes == null || newNodes.length == 0) {
            if (treeNodes != null) {
                for (let treeNode of treeNodes) {
                    this.diffRemoveTreeNodes(treeNodes, treeNode, onlyDiff);
                }
            }
        } else {
            let lastIndex = 0, i = 1;
            for (let newNode of newNodes) {
                let index = this.elementIndexTreeNodes(treeNodes, newNode, i);
                if (index >= 0) {
                    let treeNode = treeNodes[index];
                    this.diffCompareComponent(parent, treeNodes, treeNode, newNode, index, onlyDiff);
                    if (index < lastIndex) {
                        // 将treeNode移动到treeNodes的lastIndex位置，lastIndex之前的元素前移
                        this.diffMoveTreeNodes(treeNodes, index, lastIndex);
                    }
                    lastIndex = index > lastIndex ? index : lastIndex;
                } else {
                    // 在 treeNodes 中，创建 newNode 并将 newNode 插入到 lastIndex 位置后，相应元素后移一位
                    this.diffInsertTreeNodes(parent, treeNodes, lastIndex, newNode);
                    lastIndex = lastIndex + 1;
                }
                i++;
            }

            let copyTreeNodes = [...treeNodes];
            for (let treeNode of copyTreeNodes) {
                let index = this.checkTreeNodeRemove(newNodes, treeNode);
                if (index == -1) {
                    // 在 treeNodes 中，删除 treeNode
                    if (parent && onlyDiff == true && treeNode.parent && treeNode.parent != parent) {
                        // 此时不允许删除
                        /**
                         * 在使用this.props.children时由于children已经生成
                         * <div><div id='1'>{c[0]}</div><div id='2'>{c[1]}{c[2]}</div></div>
                         * 变为
                         * <div><div id='1'>{c[0]}{c[1]}</div><div id='2'>{c[2]}</div></div>
                         * 这时先对比 div=1 转移dom,再对比 div=2 这时会卸载c[1]
                         * 导致 div=1 中的组件被卸载,所以这时不再卸载组件
                         */
                        this.diffRemoveTreeNodes(treeNodes, treeNode, onlyDiff, false);
                    } else {
                        this.diffRemoveTreeNodes(treeNodes, treeNode, onlyDiff);
                    }
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


    private diffMoveTreeNodes(treeNodes: Array<ContextLink>, index, lastIndex) {
        let obj = treeNodes[index];
        for (let i = index; i < lastIndex; i++) {
            treeNodes[i] = treeNodes[i + 1];
        }
        treeNodes[lastIndex] = obj;
    }

    private diffInsertTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, lastIndex, element: GinkgoElement) {
        let newNode = this.createElement(parent, element);
        treeNodes.splice(lastIndex + 1, 0, newNode);
    }

    private diffRemoveTreeNodes(treeNodes: Array<ContextLink>,
                                treeNode: ContextLink,
                                onlyDiff: boolean = true,
                                unbindComponent: boolean = true) {
        treeNodes.splice(treeNodes.indexOf(treeNode), 1);
        if (onlyDiff) {
            if (unbindComponent) this.unbindComponent(treeNode);
        } else {
            treeNode.status = "retain";
        }
        treeNode.nextDomSibling = undefined;
        treeNode.nextSibling = undefined;
    }

    protected diffCompareComponent(parent: ContextLink,
                                   treeNodes: Array<ContextLink>,
                                   treeNode: ContextLink,
                                   newNode: GinkgoElement,
                                   index,
                                   onlyDiff: boolean = true) {
        let rebuild = this.compareComponentIsRebuild(treeNode, newNode);
        if (rebuild) {
            this.diffRemoveTreeNodes(treeNodes, treeNode);
            this.diffInsertTreeNodes(parent, treeNodes, index - 1, newNode);
        } else {
            /**
             * 如果是HTML的子自定义组件则会走compareSibling方法中的diffCompareComponent
             * 比如
             * <Custom>
             *     <Custom2></Custom2>
             * </Custom>
             * 走的compareSibling中的diffInsertTreeNodes
             * <div>
             *     <Custom2></Custom2>
             * </div>
             * 走的compareSibling中的diffCompareComponent
             * 所以这个时候需要重置一部分属性配置
             */
            if (treeNode.status == "retain") {
                this.relevanceElementShould(parent, treeNode);
                this.buildChildrenRef(treeNode);
            }
            treeNode.status = "compare";
            treeNode.compareProps = newNode;

            if (onlyDiff == false && typeof newNode === "object") {
                /**
                 * 假如如下结构A组件被重新对比,在compare()方法第一次compareSibling时
                 * 旧的props再对比之后变成新的props这时['_owner']属性丢失
                 * <A>
                 *     <B/>
                 *     <C/>
                 * </A>
                 * 所以这时需要将旧的['_owner']属性转移到新的中去,否则自定义组件的children的
                 * 引用无效导致component对象不一致,并且将treeNode.props换成新的newNode之后
                 * 子组件引用newNode时才会有_owner属性
                 **/
                if (treeNode.props && treeNode.props != newNode && treeNode.props['_owner']) {
                    treeNode.oldCompareProps = treeNode.props;
                    newNode['_owner'] = treeNode.props['_owner'];
                    treeNode.props = newNode;
                    treeNode.nextDomSibling = undefined;
                    treeNode.nextSibling = undefined;
                }
            }
        }
    }

    /************* 算法结束 ******************/

    private createElement(parent: ContextLink, element: GinkgoElement): ContextLink {
        if (element == null || element == undefined) return null; // 判断props不能为空否则遍历会取到body容器

        let link: ContextLink;
        if (element['_owner']) {
            link = element['_owner'];
            if (link) {
                this.setLinkParent(parent, link);
                if (link.status == "retain") {
                    link.compareProps = element;
                }
            }
        } else {
            link = this.mountCreateFragmentLink(parent, element);
        }
        let component = link.component;

        // 生命周期第一个
        if (typeof link.props == "object") {
            element['_owner'] = link;
            // retain状态需要判断新旧值所以buildComponentProps由compareComponentByLink
            // 调用
            if (link.status != "retain") {
                (component as any).props = this.buildComponentProps(link.props);
            }
        }

        if (parent) {
            if (link.status === "new") {
                try {
                    component.componentWillMount && component.componentWillMount();
                } catch (e) {
                    if (console && console.error) console.error(e);
                }
            }
            this.relevanceElementShould(parent, link);
            this.buildChildrenRef(link);
            if (link.status === "new") {
                this.makeWillPropsLife(component, component.props, {}, "new", true);
            }
        }

        return link;
    }

    private mountRealDom2Document(parent: ContextLink, link: ContextLink, next: ContextLink, index) {
        let component = link.component;
        let nextDomSibling = parent.nextDomSibling;
        let nextSibling = this.findNextSibling(parent, nextDomSibling);

        if (component instanceof HTMLComponent || component instanceof TextComponent) {
            if (parent && parent.shouldEl) {
                if (nextSibling && nextSibling != link.holder.dom) {
                    try {
                        parent.shouldEl.insertBefore(link.holder.dom, nextSibling);
                    } catch (e) {
                        debugger
                    }
                } else {
                    parent.shouldEl.append(link.holder.dom);
                }
            }
        } else {
            if (next) link.nextDomSibling = next;
        }
    }

    private findNextSibling(parent: ContextLink, nextDomSibling: ContextLink) {
        if (nextDomSibling && (nextDomSibling.holder == null || nextDomSibling.holder.dom != nextDomSibling.shouldEl)) {
            let nextDomSiblingCache = nextDomSibling;
            let nextSibling;
            while (true) {
                if (nextDomSiblingCache
                    && nextDomSiblingCache.status
                    && (nextDomSiblingCache.status == "new" || nextDomSiblingCache.status == "retain")) {
                    nextDomSiblingCache = nextDomSiblingCache.nextSibling;
                    if (nextDomSiblingCache == null) {
                        break;
                    } else {
                        continue;
                    }
                }
                nextSibling = this.getComponentRealDom(nextDomSiblingCache, 0);
                if (nextSibling != null) break;
                nextDomSiblingCache = nextDomSiblingCache.nextSibling;
                if (nextDomSiblingCache == null) break;
            }
            if (nextSibling) {
                return nextSibling;
            } else {
                return this.findNextSibling(parent, nextDomSibling.parent);
            }
        }
    }

    private compareComponentIsRebuild(compareLink: ContextLink, props: GinkgoElement) {
        let compareProps = compareLink.props;
        let component = compareLink.component;

        if (component instanceof TextComponent && !GinkgoContainer.isBaseType(props)) {
            return true;
        }
        if (typeof compareProps == "object" && props.module != compareProps.module) {
            return true;
        }
        if (typeof compareProps == "object" && typeof props == "string") {
            return true;
        }
        return false;
    }

    private compareComponentByLink(parent: ContextLink, compareLink: ContextLink, props: GinkgoElement): boolean {
        let compareProps = compareLink.props;
        let component = compareLink.component;
        let oldProps = component.props;

        if (compareProps === props && compareLink.oldCompareProps) {
            compareProps = compareLink.oldCompareProps;
        }

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
            if (compareProps && compareProps['_owner'] && compareProps['_owner'] != props['_owner']) {
                props['_owner'] = compareLink;
            }
            compareLink.props = props;
            (component as any).props = this.buildComponentProps(props);

            this.clearPropsEmptyChildren(props);
            this.buildChildrenRef(compareLink);

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
            this.makeWillPropsLife(component, component.props, oldProps, "mounted", true);
            this.makeWillPropsLife(component, component.props, oldProps, "mounted", false);

            if (isChildrenChanged) {
                try {
                    component.componentChildChange(newChild, oldChild);
                } catch (e) {
                    if (console && console.error) console.error(e);
                }
            }

            compareLink.status = "compare";
            compareLink.oldProps = oldProps;
        } else {
            return false;
        }
        return true;
    }

    private unbindComponent(current: ContextLink) {
        GinkgoContainer.unmountComponentByLink(current);
    }

    private relevanceElementShould(parent: ContextLink, link: ContextLink) {
        let component = link.component;
        let props = link.props;
        if (component instanceof HTMLComponent && typeof props === "object") {
            link.shouldEl = link.holder.dom as any;
        } else {
            if (parent) link.shouldEl = parent.shouldEl;
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
            // 为了调试是谁修改了props
            // set props(props) {
            //     this._props = props;
            // },
            // get props() {
            //     return this._props;
            // }
        };
        // link.props = props;
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
            try {
                state = component.componentWillReceiveProps && component.componentWillReceiveProps(props, {
                    oldProps: oldProps, type: type
                });
            } catch (e) {
                if (console && console.error) console.error(e);
            }
        } else {
            try {
                state = component.componentWillCompareProps && component.componentWillCompareProps(props, {
                    oldProps: oldProps
                })
            } catch (e) {
                if (console && console.error) console.error(e);
            }
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

    private buildComponentProps(props: GinkgoElement): GinkgoElement {
        let copy = {...props};
        delete copy['_owner'];
        delete copy['module'];
        return copy;
    }
}
