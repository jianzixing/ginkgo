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
     * 自定义组件中content元素及其子元素所在的当前组件
     */
    root?: ContextLink;

    /**
     * 组建组件的属性值，如果是string类型表示当前组件属于text类型(TextComponent)
     */
    props?: GinkgoElement | string;

    /**
     * 当前组件的状态
     * new      新建组件只创建了实例，如果自定义组件的子元素没有被content引用则永远是new状态
     * mount    已经被挂载到dom中，再成为mount时会开始组件的生命周期
     * remount  已经被挂载到dom中，重新渲染后标记为当前状态并移动子元素真实dom
     *
     */
    status?: "new" | "mount" | "remount";

    parent?: ContextLink;
    /**
     * 如果当前元素是组件的子元素且被content元素引用成为content元素的子元素
     * 则在content中的父元素就是virtualParent
     */
    virtualParent?: ContextLink;
    content?: ContextLink;
    children?: Array<ContextLink>;
}

export interface ComponentWrapper {
    component: GinkgoComponent;
    holder?: { dom: Element };
}

const ComponentNameMapping = {
    input: InputComponent,
    bind: BindComponent
};

export class GinkgoContainer {
    private static readonly context: Array<ContextLink> = [];

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
            let wrapper = this.parseComponentByElement(props);
            let link: ContextLink = {
                component: wrapper.component,
                shouldEl: renderTo,
                holder: {dom: renderTo},
                /**
                 * 默认是已经挂载状态，挂载状态和dom是否在上下文不一定是一致的
                 */
                status: "mount"
            };
            if (wrapper.component instanceof HTMLComponent) {
                wrapper.holder.dom = renderTo;
            }
            this.context.push(link);
            return link;
        }
    }

    /**
     * 通过主键获取主键的包装数据link
     * @param component
     */
    public static getLinkByComponent(component: GinkgoComponent): ContextLink {
        let items = this.context.filter(value => value.component === component);
        if (items && items.length > 0) {
            return items[0];
        }
        return null;
    }

    public static getLinkByElement(element: Node) {
        let items = this.context.filter(value => value.holder && value.holder.dom && value.holder.dom === element);
        if (items && items.length > 0) {
            return items[0];
        }
        return null;
    }

    /**
     * 通过元素配置创建组件
     * @param element
     */
    public static parseComponentByElement<E extends GinkgoElement>(element: E | string): ComponentWrapper {
        let component: GinkgoComponent,
            module: any = typeof element === "object" ? element.module : undefined,
            holder;

        if (GinkgoContainer.isBaseType(element)) {
            if (!module && GinkgoContainer.isBaseType(element)) {
                component = new TextComponent(undefined, GinkgoContainer.getBaseTypeText(element));
            }
        } else {
            if (typeof module == "string") {
                holder = {};
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
                    throw new Error("can't create component by " + JSON.stringify(element) + " module " + module);
                } else {
                    component = new module(element);
                }
            }
        }

        // set default props values
        GinkgoContainer.setDefaultProps(component, element);

        return {component, holder};
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
        if (component && component.defaultProps && typeof element === "object") {
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
        let compare = new GinkgoCompare(this.context, parent, newElements);
        compare.setSkipCompare(children);
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
        let compare = new GinkgoCompare(this.context, parent, elements);
        compare.mount();
    }

    /**
     * 重新渲染一次link的所有子元素
     * @param link
     */
    public static forceComponent(link: ContextLink) {
        let component = link.component;
        if (component instanceof BindComponent) {
            let compare = new GinkgoCompare(this.context, link);
            compare.force();
        }
    }

    /**
     * 主动触发更新组件的props
     * @param component
     * @param props
     */
    public static updateComponentProps<P extends GinkgoElement>(component: GinkgoComponent<P>, props: P) {
        let link = this.getLinkByComponent(component);
        if (link) {
            let oldProps = link.props;
            link.props = props;
            (link.component as any).props = props;
            if (link.status == "mount") {
                link.component.componentReceiveProps(props, {oldProps: oldProps, type: "mounted"});
            }
        }
    }

    /**
     * 通过组件找到link并且将elements添加到link的子元素中
     * @param component
     * @param elements
     */
    public static mountComponentByComponent<E extends GinkgoElement>(component: GinkgoComponent, elements?: E[]) {
        let items = this.context.filter(value => value.component === component);
        if (items && items.length > 0) this.mountComponentArray(items[0], elements);
    }

    /**
     * 重新渲染component的内容
     * @param component
     */
    public static rerenderComponentByComponent<E extends GinkgoElement>(component: GinkgoComponent) {
        let items = this.context.filter(value => value.component === component);
        if (items && items.length > 0) {
            items.filter(value => {
                let compare = new GinkgoCompare(this.context, value);
                compare.rerender();
            })
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
            let items = this.context.filter(value => value.props === props);
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

    /**
     * 获取所有BingComponent组件
     * @param link
     */
    public static getBindLinks(link: ContextLink): Array<ContextLink> {
        if (link.children) {
            let arr = [];
            for (let child of link.children) {
                if (child.component instanceof BindComponent) {
                    arr.push(child);
                }
                let childArr = this.getBindLinks(child);
                if (childArr) {
                    childArr.map(value => arr.push(value));
                }
            }
            return arr;
        }
    }
}
