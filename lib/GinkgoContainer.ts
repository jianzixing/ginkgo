import {GinkgoElement} from "./Ginkgo";
import {GinkgoComponent} from "./GinkgoComponent";
import {HTMLComponent} from "./HTMLComponent";
import {GinkgoCompare} from "./GinkgoCompare";
import {TextComponent} from "./TextComponent";
import {InputComponent} from "./InputComponent";
import {BindComponent} from "./BindComponent";

export interface ContextLink {
    component?: GinkgoComponent;
    /**
     * 假如当前组件时HTML组件则记录当前组件的dom
     */
    holder?: { dom: Element | Text };

    /**
     * 当前组件的子元素应该添加到的父元素
     */
    shouldEl?: Element;

    /**
     * 应该插入到哪个元素之前
     */
    previousSibling?: Element;

    /**
     * 组建组件的属性值，如果是string类型表示当前组件属于text类型(TextComponent)
     */
    props?: GinkgoElement | string;

    /**
     * 当前组件的状态
     * new      新建组件只创建了实例，如果自定义组件的子元素没有被content引用则永远是new状态
     * mount    已经被挂载到dom中，再成为mount时会开始组件的生命周期
     * compare  当前组件需要对比属性
     * retain   已被卸载但是还有可能被重新引用,重新引用需要compare
     *
     */
    status?: "new" | "mount" | "compare" | "retain";

    parent?: ContextLink;

    /**
     * 自定义组件的组成元素
     */
    content?: ContextLink;

    /**
     * 自定义组件的子元素
     */
    children?: Array<ContextLink>;

    /**
     * 排序的序号
     */
    mountIndex?: number;

    /**
     * 用于临时存储使用，使用后立即清除
     */
    oldProps?: any;
    compareProps?: any;
    nextSibling?: ContextLink;
    nextDomSibling?: ContextLink;
}

const ComponentNameMapping = {
    input: InputComponent,
    bind: BindComponent
};

export class GinkgoContainer {
    private static readonly context: Array<ContextLink> = [];

    public static getCountContext(): number {
        let count = 0;

        function foreach(list: Array<ContextLink>) {
            if (list) {
                for (let item of list) {
                    count++;
                    if (item.children) {
                        foreach(item.children);
                    }
                }
            }
        }

        foreach(this.context);
        return count;
    }

    private static getContentLink(links: Array<ContextLink> | ContextLink,
                                  checkObj: any,
                                  type: number,
                                  all?: Array<ContextLink>): ContextLink {
        if (links instanceof Array) {
            for (let item of links) {
                if (type == 0 && item == checkObj) {
                    if (all) all.push(item); else return item;
                }
                if (type == 1 && item.props == checkObj) {
                    if (all) all.push(item); else return item;
                }
                if (type == 2 && item.holder && item.holder.dom == checkObj) {
                    if (all) all.push(item); else return item;
                }
                if (type == 3 && item.component == checkObj) {
                    if (all) all.push(item); else return item;
                }
                if (item.content) {
                    let match = this.getContentLink(item.content, checkObj, type, all);
                    if (match && all == null) return match;
                } else if (item.children) {
                    let match = this.getContentLink(item.children, checkObj, type, all);
                    if (match && all == null) return match;
                }
            }
        } else {
            if (type == 0 && links == checkObj) {
                if (all) all.push(links); else return links;
            }
            if (type == 1 && links.props == checkObj) {
                if (all) all.push(links); else return links;
            }
            if (type == 2 && links.holder && links.holder.dom == checkObj) {
                if (all) all.push(links); else return links;
            }
            if (type == 3 && links.component == checkObj) {
                if (all) all.push(links); else return links;
            }
            if (links.content) {
                let match = this.getContentLink(links.content, checkObj, type, all);
                if (match && all == null) return match;
            } else if (links.children) {
                let match = this.getContentLink(links.children, checkObj, type, all);
                if (match && all == null) return match;
            }
        }
    }

    /**
     * 创建一个元素包装用于作为容器的根
     * @param renderTo
     */
    public static buildRenderLink(renderTo: Element): ContextLink {
        let items = this.context.filter(value => value && value.holder && value.holder.dom && (value.holder.dom == renderTo));
        if (items && items.length > 0) {
            return items[0];
        } else {
            let props = {module: renderTo.tagName};
            let component = this.parseComponentByElement(props, renderTo);
            let link: ContextLink = {
                component: component,
                shouldEl: renderTo,
                holder: {dom: renderTo},
                /**
                 * 默认是已经挂载状态，挂载状态和dom是否在上下文不一定是一致的
                 */
                status: "mount"
            };
            this.context.push(link);
            return link;
        }
    }

    /**
     * 通过主键获取主键的包装数据link
     * @param component
     */
    public static getLinkByComponent(component: GinkgoComponent): ContextLink {
        return this.getContentLink(this.context, component, 3);
    }

    public static getLinkByElement(element: Node): ContextLink {
        return this.getContentLink(this.context, element, 2);
    }

    public static getLinkByProps(props: GinkgoElement): ContextLink {
        return this.getContentLink(this.context, props, 1);
    }

    /**
     * 通过元素配置创建组件
     * @param element
     */
    public static parseComponentByElement<E extends GinkgoElement>(element: E | string, dom?: Element | boolean): GinkgoComponent {
        let component: GinkgoComponent,
            module: any = typeof element === "object" ? element.module : undefined,
            holder;

        if (GinkgoContainer.isBaseType(element)) {
            if (!module && GinkgoContainer.isBaseType(element)) {
                let text = GinkgoContainer.getBaseTypeText(element);
                holder = {};
                if (dom != false) {
                    if (dom) {
                        holder.dom = dom;
                    } else {
                        let dom = document.createTextNode("" + text);
                        holder.dom = dom;
                    }
                }
                component = new TextComponent(text as any, holder);
            }
        } else {
            if (typeof module == "string") {
                holder = {};
                if (dom != false) {
                    if (dom) {
                        holder.dom = dom;
                    } else {
                        let dom = document.createElement(module);
                        holder.dom = dom;
                    }
                }
                if (ComponentNameMapping[module]) {
                    component = new ComponentNameMapping[module](element, holder);
                } else {
                    component = new HTMLComponent(element as E, holder);
                }
            } else /*if (typeof module == "function")*/ {
                if (element instanceof GinkgoComponent) {
                    throw new Error("jsx must by Element , but current is Ginkgo.Component");
                }
                if (!module) {
                    let copy
                    if (typeof element === "object") {
                        copy = {...element};
                        copy['_owner'] = undefined;
                        delete copy['_owner'];
                    } else {
                        copy = element;
                    }
                    throw new Error("can't create component by " + JSON.stringify(copy) + " module " + module);
                } else {
                    component = new module(element);
                }
            }
        }

        // set default props values
        GinkgoContainer.setDefaultProps(component, element);

        return component;
    }

    public static isBaseType(props: any) {
        if (typeof props == "string"
            || typeof props == "number"
            || typeof props == "boolean") {
            return true;
        }
        return false;
    }

    public static getBaseTypeText(props: any): string {
        if (this.isBaseType(props)) {
            return "" + props;
        }
        return undefined;
    }

    public static setDefaultProps(component: GinkgoComponent, element: GinkgoElement | string) {
        if (component && component.defaultProps && element && typeof element === "object") {
            for (let key in component.defaultProps) {
                if (element[key] == null || element[key] == undefined) {
                    element[key] = component.defaultProps[key];
                }
            }
        }
    }

    /**
     * 挂载element到parent并且跳过对比parent的子类
     * 挂载时保存parent的子元素
     *
     * @param parent
     * @param element
     */
    public static mountPersistExistComponent<E extends GinkgoElement>(parent: ContextLink, element: E) {
        let children = parent ? parent.children : undefined,
            newElements = [];

        if (children) {
            for (let c of children) {
                newElements.push(c.props);
            }
        }

        newElements.push(element);
        let compare = new GinkgoCompare(parent, newElements);
        if (children && children.length > 0) compare.setSkipCompare([...children]);
        compare.mount();
    }

    /**
     * 挂载元素到组件
     * @param parent
     * @param element
     */
    public static mountComponent<E extends GinkgoElement>(parent: ContextLink, element: E) {
        this.mountComponentArray(parent, [element]);
    }

    /**
     * 挂载元素到组件
     * @param parent
     * @param elements
     */
    public static mountComponentArray<E extends GinkgoElement>(parent: ContextLink, elements?: E[]) {
        let compare = new GinkgoCompare(parent, elements);
        compare.mount();
    }

    /**
     * 重新渲染一次link的所有子元素
     * @param link
     */
    public static forceComponent(link: ContextLink) {
        let component = link.component;
        if (component instanceof BindComponent) {
            let compare = new GinkgoCompare(link);
            compare.force();
        }
    }

    /**
     * 主动触发更新组件的props
     * @param component
     * @param props
     */
    public static updateComponentProps<P extends GinkgoElement>(component: GinkgoComponent<P>, props: P, dontForceRender: boolean = false) {
        let link = this.getLinkByComponent(component);
        if (link) {
            let oldProps = link.props;
            link.props = props;
            (link.component as any).props = props;
            if (link.status == "mount") {
                let component = link.component;
                component['_disableSetStateCall'] = true;
                try {
                    let state1 = link.component.componentWillReceiveProps && link.component.componentWillReceiveProps(props, {
                        oldProps: oldProps as any,
                        type: "mounted"
                    });
                    if (state1) {
                        let oldState = component.state;
                        if (oldState == null) oldState = {};
                        for (let key in state1) {
                            oldState[key] = state1[key];
                        }
                        component.state = oldState;
                    }
                    let state2 = link.component.componentWillCompareProps && link.component.componentWillCompareProps(props, {
                        oldProps: oldProps as any
                    });
                    if (state2) {
                        let oldState = component.state;
                        if (oldState == null) oldState = {};
                        for (let key in state2) {
                            oldState[key] = state1[key];
                        }
                        component.state = oldState;
                    }
                } catch (e) {
                    console.error(e);
                }
                component['_disableSetStateCall'] = false;

                if (dontForceRender !== true) {
                    component.forceRender(false);
                }

                try {
                    link.component.componentReceiveProps && link.component.componentReceiveProps(props, {
                        oldProps: oldProps as any,
                        type: "mounted"
                    });
                    link.component.componentCompareProps && link.component.componentCompareProps(props, {
                        oldProps: oldProps as any
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    /**
     * 通过组件找到link并且将elements添加到link的子元素中
     * @param component
     * @param elements
     */
    public static mountComponentByComponent<E extends GinkgoElement>(link: ContextLink, elements?: E[]) {
        if (link) this.mountComponentArray(link, elements);
    }

    /**
     * 重新渲染component的内容
     * @param component
     */
    public static rerenderComponentByComponent<E extends GinkgoElement>(component: GinkgoComponent,
                                                                        isCallUpdate?: boolean) {
        let item = this.getLinkByComponent(component);
        if (item) {
            let compare = new GinkgoCompare(item);
            compare.rerender(isCallUpdate);
        }
    }

    /**
     * 卸载link的其子元素(不包括link本身)
     * @param link
     */
    public static unmountComponentByLinkChildren(link: ContextLink) {
        if (link) {
            let children = link.children;
            if (children) {
                // 防止unmountComponentByLink移除时数组遍历跳出
                let copyChild = [...children];
                for (let c of copyChild) {
                    this.unmountComponentByLink(c);
                }
            }
        }
    }

    /**
     * 卸载link及其子元素(包括link本身)
     * @param link
     */
    public static unmountComponentByLink(link: ContextLink) {
        if (link) {
            let component = link.component;
            if (component && component.componentWillUnmount) {
                component.componentWillUnmount();
            }

            let children = link.children;
            if (children && children.length > 0) {
                // 防止unmountComponentByLink移除时数组遍历跳出
                let copyChild = [...children];
                for (let child of copyChild) {
                    this.unmountComponentByLink(child);
                }
            }
            let content = link.content;
            if (content) {
                this.unmountComponentByLink(content);
            }

            if (link.parent && link.parent.children) {
                let parent = link.parent, pindex = parent.children.indexOf(link);
                if (pindex >= 0) {
                    parent.children.splice(pindex, 1);
                }
            }

            let index = this.context.indexOf(link);
            if (index >= 0) {
                this.context.splice(index, 1);
            }

            if (link.holder && link.holder.dom) {
                if (link.holder.dom.parentElement) {
                    link.holder.dom.parentElement.removeChild(link.holder.dom)
                }
            }
            link.status = "retain";
        }
    }

    /**
     * 通过element卸载组件
     * @param props
     * @param renderTo
     */
    public static unmountComponentByElement(props: GinkgoElement, renderTo: Element) {
        if (props && renderTo) {
            let rootLink = this.buildRenderLink(renderTo);
            let items = [];
            this.getContentLink(this.context, props, 1, items);
            if (items && items.length > 0) {
                // 防止unmountComponentByLink移除时数组遍历跳出
                let copyItems = [...items];
                for (let item of copyItems) {
                    if (!item.holder || !item.holder.dom || item.holder.dom != document.body) {
                        this.unmountComponentByLink(item);
                    }
                }

                if (rootLink && (!rootLink.children || rootLink.children.length == 0)) {
                    if (!rootLink.holder || !rootLink.holder.dom || rootLink.holder.dom != document.body) {
                        this.unmountComponentByLink(rootLink);
                    }
                }
            }
        }
    }
}
