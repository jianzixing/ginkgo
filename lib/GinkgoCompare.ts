import {GinkgoContainer, ContextLink, ComponentWrapper} from "./GinkgoContainer";
import {GinkgoElement} from "./Ginkgo";
import {GinkgoComponent} from "./GinkgoComponent";
import {TextComponent} from "./TextComponent";
import {BindComponent, BindComponentElement, callBindRender} from "./BindComponent";
import {GinkgoMountElement} from "./GinkgoMountElement";

export class GinkgoCompare {
    private readonly mountElement: GinkgoMountElement = new GinkgoMountElement();
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
            // compare diff if parent has children
            if (this.parent.children && this.parent.children.length > 0) {
                this.mountDiffElements(this.parent, this.elements, false);
            } else {
                this.mountCreateElements(this.parent, this.elements, false);
            }

            // 如果this.parent只有已经挂载了才能挂载子元素
            if (this.parent.status == "mount") {
                this.mountElement.syncVirtualDom(this.parent, this.skips);
            }
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
        let component = this.parent.component;
        this.elements = null;
        if (component != null) {
            let el = component.render();
            if (el && typeof el != "string") this.elements = [el];
        }
        if (this.elements) {
            this.elements = this.elements.filter(value => value != null && value != undefined);

            // compare diff if parent has children
            if (this.parent.content) {
                this.mountDiffElements(this.parent, this.elements, true);
            } else {
                this.mountCreateElements(this.parent, this.elements, true);
            }

            // 如果this.parent只有已经挂载了才能挂载子元素
            if (this.parent.status == "mount") {
                this.mountElement.syncVirtualDom(this.parent, this.skips);
            }
        } else {
            GinkgoContainer.unmountComponentByLinkChildren(this.parent);
        }

        return this.context;
    }

    /**
     * important!
     *
     * 触发重新渲染BindComponent的子元素
     */
    force(): Array<ContextLink> {
        if (this.parent && this.parent.component instanceof BindComponent) {
            let component = this.parent.component,
                link = this.parent,
                props = link.props as BindComponentElement;

            let children = callBindRender(props);
            this.elements = (children instanceof Array ? children : [children]);
            this.elements = this.elements.filter(value => value != null && value != undefined);
            this.mountDiffElements(this.parent, this.elements, true);

            (component as any).props = props;

            // 如果this.parent只有已经挂载了才能挂载子元素
            if (this.parent.status == "mount") {
                this.mountElement.syncVirtualDom(this.parent, this.skips);
            }
        }

        return this.context;
    }

    setSkipCompare(elements: ContextLink[]) {
        this.skips = elements;
    }

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

                        // 先删除不需要的组件，如果后删除的话会导致组件新建后又被删除
                        // 比如 A->{B->{C,D}} 变为 A->{E->{C,D}} 会新建E后删除B及其子组件
                        // 导致C和D本不该删除结果被删除
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
                component.componentReceiveProps && component.componentReceiveProps(props, {oldProps, type: "mounted"});
                component.componentUpdateProps && component.componentUpdateProps(props, {oldProps});

                if (component.componentChildChange && !(component instanceof BindComponent)) {
                    let newChild = props.children;
                    let oldChild = oldProps.children;

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
                        component.componentChildChange(newChild, oldChild);
                    }
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

        // todo: 效率太低是否改成只判断content内容元素
        if (props == null || props == undefined) return null; // 判断props不能为空否则遍历会取到body容器
        let exists = this.context.filter(value => {
            return value.props == props && !GinkgoContainer.isBaseType(props)
        });
        if (exists && exists.length > 0) {
            let exist = exists[0];
            if (exist && exist.status == "mount") {
                this.resetContextLinkStatus(exist, "remount");
            }
            return exist;
        }

        let link: ContextLink = this.mountCreateFragmentLink(parent, props),
            component = link.component,
            childProps = typeof link.props == "object" ? link.props.children : undefined;

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

    private mountCreateFragmentLink(parent: ContextLink,
                                    props: GinkgoElement | string): ContextLink {
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

    private resetContextLinkStatus(link: ContextLink, status: "new" | "mount" | "remount") {
        if (link) {
            link.status = status;
            let content = link.content;
            let children = link.children;
            if (content) {
                this.resetContextLinkStatus(content, status);
            }
            if (children) {
                for (let c of children) {
                    this.resetContextLinkStatus(c, status);
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
        let newNews: Array<{ child: GinkgoElement, old?: ContextLink }> = [];

        let cacheOld = null;
        if (newChildren && newChildren.length > 0) {
            if (compareChildLinks && compareChildLinks.length > 0) {
                // let i = 0;
                // for (let child of newChildren) {
                //     newNews.push({child: child, old: compareChildLinks.length > i ? compareChildLinks[i] : undefined})
                //     i++;
                // }

                let index = 0;
                for (let child of newChildren) {
                    let like: ContextLink;
                    if (child.key) {
                        for (let link of compareChildLinks) {
                            let props = link.props;
                            if (typeof link != "string" && !GinkgoContainer.isBaseType(props)) {
                                if (child.module == (props as GinkgoElement).module) {
                                    if (child == props || child.key === (props as GinkgoElement).key) {
                                        like = link;
                                    }
                                }
                            }
                        }
                    } else {
                        let link = compareChildLinks.length > index ? compareChildLinks[index] : undefined;
                        if (link) {
                            let props = link.props;
                            if ((typeof props != "string" && !props.key) || GinkgoContainer.isBaseType(props)) {
                                like = link;
                            }
                        }
                    }

                    let obj = {child};
                    if (like) {
                        obj['old'] = like;
                    }
                    newNews.push(obj);
                    index++;
                }
                cacheOld = [];
                for (let link of compareChildLinks) {
                    let is = false;
                    for (let nn of newNews) {
                        if (link == nn.old) {
                            is = true;
                            break;
                        }
                    }
                    if (!is) {
                        cacheOld.push(link);
                    }
                }
            } else {
                if (newChildren) {
                    for (let c of newChildren) {
                        newNews.push({child: c})
                    }
                }
            }
        } else {
            if (compareChildLinks) {
                cacheOld = compareChildLinks;
            }
        }

        return {news: newNews, del: cacheOld};
    }
}
