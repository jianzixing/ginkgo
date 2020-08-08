import {GinkgoContainer, ContextLink, ComponentWrapper} from "./GinkgoContainer";
import {GinkgoElement, HTMLComponent} from "./Ginkgo";
import {GinkgoComponent} from "./GinkgoComponent";
import {TextComponent} from "./TextComponent";
import {BindComponent, BindComponentElement, callBindRender} from "./BindComponent";
import {GinkgoDifferentNodes} from "./GinkgoDifferentNodes";

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
            let diff = new GinkgoDifferentNodes();
            diff.insertWork = this.createElement.bind(this);
            diff.moveWork = this.movingElement.bind(this);
            diff.compareWork = this.compareComponent.bind(this);
            diff.removeWork = this.unbindComponent.bind(this);
            let time = new Date().getTime();
            diff.compare(this.parent, this.elements);
            console.log(new Date().getTime() - time)
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
        let diff = new GinkgoDifferentNodes();
        diff.insertWork = this.createElement.bind(this);
        diff.moveWork = this.movingElement.bind(this);
        diff.compareWork = this.compareComponent.bind(this);
        diff.removeWork = this.unbindComponent.bind(this);
        let time = new Date().getTime();
        debugger
        diff.compare(this.parent, this.elements);
        console.log(new Date().getTime() - time)

        return this.context;
    }

    /**
     * important!
     *
     * 触发重新渲染BindComponent的子元素
     */
    force(): Array<ContextLink> {
        if (this.parent && this.parent.component instanceof BindComponent) {
            let link = this.parent,
                props = link.props as BindComponentElement;

            let children = callBindRender(props);
            this.elements = (children instanceof Array ? children : [children]);
            this.elements = this.elements.filter(value => value != null && value != undefined);

            let content = this.parent.content ? [this.parent.content] : [];
            let diff = new GinkgoDifferentNodes();
            diff.insertWork = this.createElement.bind(this);
            diff.moveWork = this.movingElement.bind(this);
            diff.compareWork = this.compareComponent.bind(this);
            diff.removeWork = this.unbindComponent.bind(this);
            let time = new Date().getTime();
            diff.compare(this.parent, this.elements);
            console.log(new Date().getTime() - time)
        }

        return this.context;
    }

    setSkipCompare(elements: ContextLink[]) {
        this.skips = elements;
    }


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

        this.buildChildrenRef(link);
        return link;
    }

    private movingElement(parent: ContextLink, current: ContextLink, previousSibling: ContextLink) {

    }

    private compareComponent(parent: ContextLink, compareLink: ContextLink, props: GinkgoElement): boolean {
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
                    compareLink.status = "remount";
                    compareLink.props = newText;
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

            // 重新赋值引用获取组件对象
            this.buildChildrenRef(compareLink);
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
            if (component instanceof BindComponent) {
                component.forceRender();
            }
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

        props = this.beforeProcessProps(component, props);

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


    //// 以下废弃

    private mountDiffElements(parent: ContextLink, elements: GinkgoElement[], isContent: boolean) {
        let children = [],
            childComponents: Array<GinkgoComponent> = [];

        let childLinks = isContent ? [parent.content] : parent.children;
        let aligns = this.alignNewOldPropsChildren(childLinks, elements);
        for (let align of aligns.news) {
            let element = align.child;
            let childLink = align.old;

            if (this.skips && this.skips.indexOf(childLink) >= 0) {
                children.push(childLink);
                if (childLink.component) childComponents.push(childLink.component);
            } else {
                let compareLink = this.mountDiffFragment(parent, element, childLink);
                children.push(compareLink);
                if (compareLink.component) childComponents.push(compareLink.component);
            }
        }

        if (aligns.del) {
            for (let del of aligns.del) {
                GinkgoContainer.unmountComponentByLink(del);
            }
        }

        if (isContent) {
            if (children.length > 0) {
                parent.content = children[0];
            }
            if (parent.component && childComponents.length > 0) {
                parent.component.content = childComponents[0];
            }
        } else {
            let oldPropsChildren
            if (parent.props && !GinkgoContainer.isBaseType(parent.props)) {
                oldPropsChildren = (parent.props as GinkgoElement).children;
            }
            parent.children = children;
            if (parent.props && typeof parent.props == "object") {
                parent.props.children = elements;
            }
            if (parent.component) {
                parent.component.children = childComponents;
            }
            if (parent.props && parent.component && parent.component.componentChildChange) {
                if (!GinkgoContainer.isBaseType(parent.props)) {
                    parent.component.componentChildChange(elements, oldPropsChildren);
                }
            }
        }
    }

    /**
     *
     * @param parent
     * @param props         new element
     * @param compareLink   old element
     */
    private mountDiffFragment(parent: ContextLink, props: GinkgoElement, compareLink?: ContextLink): ContextLink {
        if (compareLink) {
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
                        compareLink.status = "remount";
                        compareLink.props = newText;
                    }
                    return compareLink;
                } else {
                    GinkgoContainer.unmountComponentByLink(compareLink);
                    return this.mountCreateFragment(parent, props);
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


                if (!(component instanceof BindComponent)) {
                    let childProps = props.children;
                    if (childProps && childProps.length > 0) {
                        let children = [], childComponents: Array<GinkgoComponent> = [];

                        let compareChildLinks = compareLink.children;
                        let aligns = this.alignNewOldPropsChildren(compareChildLinks, childProps);
                        if (aligns.del) {
                            for (let del of aligns.del) {
                                GinkgoContainer.unmountComponentByLink(del);
                            }
                        }

                        for (let align of aligns.news) {
                            let cp = align.child;
                            let compareChildLink = align.old;
                            let childLink = this.mountDiffFragment(compareLink, cp, compareChildLink);
                            children.push(childLink);
                            if (childLink.component) childComponents.push(childLink.component);
                        }

                        compareLink.children = children;
                        if (compareLink.props) compareLink.props.children = childProps;
                        component.children = childComponents;
                    } else {
                        GinkgoContainer.unmountComponentByLinkChildren(compareLink);
                    }
                }

                // 重新赋值引用获取组件对象
                this.buildChildrenRef(compareLink);
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
                if (component instanceof BindComponent) {
                    component.forceRender();
                }

                return compareLink;
            } else {
                GinkgoContainer.unmountComponentByLink(compareLink);
                return this.mountCreateFragment(parent, props);
            }
        } else {
            return this.mountCreateFragment(parent, props);
        }
    }

    private mountCreateElements(parent: ContextLink, elements: GinkgoElement[], isContent: boolean) {
        let children = [], childComponents: Array<GinkgoComponent> = [];
        for (let element of elements) {
            if (element) { // 判断不能为空的情况
                let link = this.mountCreateFragment(parent, element);
                children.push(link);
                if (link.component) childComponents.push(link.component);
            }
        }
        if (children && children.length > 0) {
            if (isContent) {
                if (children.length > 0) {
                    parent.content = children[0];
                }
                if (parent.component && childComponents.length > 0) {
                    parent.component.content = childComponents[0];
                }
            } else {
                parent.children = children;
                if (parent.props && typeof parent.props == "object") parent.props.children = elements;
                if (parent.component) parent.component.children = childComponents;
            }
        }
    }

    private mountCreateFragment(parent: ContextLink,
                                props: GinkgoElement | string): ContextLink {
        if (props == null || props == undefined) return null; // 判断props不能为空否则遍历会取到body容器

        let link: ContextLink = this.mountCreateFragmentLink(parent, props),
            component = link.component,
            childProps = typeof link.props == "object" ? link.props.children : undefined;

        // 生命周期第一个
        component.componentWillMount && component.componentWillMount();

        if (childProps) {
            let children = [], childComponents: Array<GinkgoComponent> = [];
            for (let cp of childProps) {
                let c = this.mountCreateFragment(link, cp);
                if (c) {
                    children.push(c);
                    if (c.component) childComponents.push(c.component);
                }
            }
            link.children = children;
            if (link.props && typeof link.props == "object") link.props.children = childProps;
            if (link.component) link.component.children = childComponents;
        }

        let contentProps = component && component.render ? component.render() : undefined;
        if (component instanceof BindComponent && link.props && (link.props as any).render) {
            contentProps = callBindRender(link.props as BindComponentElement);
        }
        if (contentProps && link) {
            let contentLink = this.mountCreateFragment(link, contentProps);
            link.root = link;
            this.setContentRoot(link, contentLink);

            link.content = contentLink;
            component.content = contentLink.component;

            this.setContentVirtualParent(link, contentLink);
        }

        this.buildChildrenRef(link);
        return link;
    }

    private setContentRoot(root: ContextLink, content: ContextLink) {
        if (content && root) {
            content.root = root;
            if (content.children) {
                for (let c of content.children) {
                    this.setContentRoot(root, c);
                }
            }
        }
    }

    private setContentVirtualParent(virtualParent: ContextLink, link: ContextLink) {
        link.virtualParent = virtualParent;
        let children = link.children;
        if (children && children.length > 0) {
            for (let c of children) {
                this.setContentVirtualParent(link, c);
            }
        }
    }

    private buildChildrenRef(link: ContextLink) {
        let props = link.props;
        let childComponent = link.component;
        let root = link.root;

        if (props
            && typeof props == "object"
            && props.ref && childComponent) {
            if (typeof props.ref === "function") {
                props.ref(childComponent);
            }
            if (typeof props.ref === "string") {
                if (root) {
                    let c: any = root.component;
                    c[props.ref] = childComponent;
                }
            }
            if (typeof props.ref === "object") {
                props.ref.instance = childComponent;
            }
        }
    }

    private beforeProcessProps(component: GinkgoComponent, props: GinkgoElement | string) {
        if (component instanceof BindComponent && !GinkgoContainer.isBaseType(props)) {
            let p = props as BindComponentElement;
            if (p.render) {
                (props as GinkgoElement).children = [callBindRender(p)];
            }
        }
        return props;
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
     * 假如有一个全局对象 c = <span></span>
     * <div>
     *     <div>
     *         位置A
     *     </div>
     *     <div>
     *         位置B {c}
     *     </div>
     * </div>
     * 第一种情况
     * 如果全局对象c从位置B变到位置A，则先diff位置A这时发现c已经存在
     * 第二种情况
     * 如果全局对象c从位置A变到位置B，则先diff位置A没有问题，在diff位置
     * B这是发现已经存在c组件
     *
     * @param links
     */
    private resetContextLinkStatus(links: Array<ContextLink> | ContextLink) {
        if (links) {
            if (links instanceof Array) {
                for (let link of links) {
                    link.status = "remount";
                    let children = link.children;
                    if (children) {
                        this.resetContextLinkStatus(children);
                    }
                }
            } else {
                links.status = "remount";
                let content = links.content;
                if (content) {
                    this.resetContextLinkStatus(content);
                }
            }
        }
    }

    /**
     * 对比新旧对象将最相近的对象放在一起
     *
     * @param compareChildLinks
     * @param newChildren
     */
    private alignNewOldPropsChildren(compareChildLinks: Array<ContextLink>, newChildren: Array<GinkgoElement>):
        { news: Array<{ child: GinkgoElement, old?: ContextLink }>, del: Array<ContextLink> } {
        let newNews: Array<{ child: GinkgoElement, old?: ContextLink }>;
        let dels;

        // 如果有key这通过key判断，如果没有key则挨个替换
        if (newChildren && newChildren.length > 0) {
            let hasKey = false;
            for (let m = 0; m < newChildren.length; m++) {
                if (newChildren[m]['key'] != null) {
                    hasKey = true;
                    break;
                }
            }

            let i = 0;
            for (; i < newChildren.length;) {
                let child = newChildren[i];
                let old, eqKeyEl;

                if (hasKey && compareChildLinks && child['key'] != null) {
                    for (let cl of compareChildLinks) {
                        if (cl && cl.props && cl.props['key'] && child['key'] === cl.props['key']) {
                            eqKeyEl = cl;
                            break;
                        }
                    }
                }
                if (!hasKey && compareChildLinks.length > i) {
                    old = compareChildLinks[i];
                }
                if (newNews == null) newNews = [];
                newNews.push({child: newChildren[i], old: hasKey ? eqKeyEl : old});
                i++
            }
            if (!hasKey && compareChildLinks.length > i) {
                for (let k = i; k < compareChildLinks.length; k++) {
                    if (dels == null) dels = [];
                    dels.push(compareChildLinks[k]);
                }
            }

            let time = new Date().getTime()
            if (hasKey && newNews && compareChildLinks) {
                let isOldEl = false;
                for (let k = 0; k < compareChildLinks.length; k++) {
                    isOldEl = false;
                    for (let nn of newNews) {
                        if (nn.old === compareChildLinks[k]) {
                            isOldEl = true;
                            break;
                        }
                    }
                    if (isOldEl == false) {
                        if (dels == null) dels = [];
                        dels.push(compareChildLinks[k]);
                    }
                }
            }
        } else {
            for (let i = 0; i < compareChildLinks.length; i++) {
                if (dels == null) dels = [];
                dels.push(compareChildLinks[i]);
            }
        }
        return {news: newNews, del: dels};
    }
}
