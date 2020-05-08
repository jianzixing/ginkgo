import {GinkgoComponent} from "./GinkgoComponent";
import {ContextLink, GinkgoContainer} from "./GinkgoContainer";
import {DataType, GinkgoHttpRequest} from "./GinkgoHttpRequest";
import {BindComponent} from "./BindComponent";
import {FragmentComponent} from "./FragmentComponent";
import {GinkgoAnimation} from "./GinkgoAnimation";

export {GinkgoTools} from "./GinkgoTools";
export {GinkgoContainer} from "./GinkgoContainer";
export {FragmentComponent} from "./FragmentComponent";
export {TextComponent} from "./TextComponent";
export {InputComponent} from "./InputComponent";

export {BindComponent} from "./BindComponent";
export {GinkgoAnimation};
export {CSSProperties} from "./CSSProperties";
export {GinkgoComponent} from "./GinkgoComponent";
export {HTMLComponent, HTMLAttributes} from "./HTMLComponent";
export {
    HTMLAnchorAttributes,
    HTMLAreaAttributes,
    HTMLAudioAttributes,
    HTMLBaseAttributes,
    HTMLBlockquoteAttributes,
    HTMLButtonAttributes,
    HTMLCanvasAttributes,
    HTMLColAttributes,
    HTMLColgroupAttributes,
    HTMLDataAttributes,
    HTMLDelAttributes,
    HTMLDetailsAttributes,
    HTMLDialogAttributes,
    HTMLEmbedAttributes,
    HTMLFieldSetAttributes,
    HTMLFormAttributes,
    HTMLHtmlAttributes,
    HTMLIFrameAttributes,
    HTMLImageAttributes,
    HTMLInsAttributes,
    HTMLKeygenAttributes,
    HTMLLabelAttributes,
    HTMLLIAttributes,
    HTMLLinkAttributes,
    HTMLMapAttributes,
    HTMLMenuAttributes, HTMLMetaAttributes,
    HTMLMeterAttributes,
    HTMLObjectAttributes,
    HTMLOlAttributes,
    HTMLOptgroupAttributes,
    HTMLOptionAttributes,
    HTMLOutputAttributes,
    HTMLParamAttributes,
    HTMLProgressAttributes,
    HTMLQuoteAttributes,
    HTMLScriptAttributes,
    HTMLSelectAttributes,
    HTMLSourceAttributes,
    HTMLStyleAttributes,
    HTMLTableAttributes,
    HTMLTdAttributes,
    HTMLTextareaAttributes,
    HTMLThAttributes,
    HTMLTimeAttributes, HTMLTrackAttributes, HTMLVideoAttributes, HTMLWebViewAttributes
} from "./HTMLDefinedAttribute";

type ElementType = keyof HTMLElementTagNameMap;

type ComponentType<P extends GinkgoElement, T extends GinkgoComponent<P>> = (new (props: P) => T);

type refObjectCall = (instance: GinkgoComponent) => void;

export type Bind = BindComponent;
export type Request = GinkgoHttpRequest;

export type GinkgoNode = GinkgoElement | string | undefined | null;

export interface GinkgoElement<C extends GinkgoComponent = any> {
    key?: string | number;
    readonly module?: ComponentType<any, any> | ElementType | Function | string;
    children?: Array<GinkgoElement>;
    ref?: refObjectCall | string | RefObject<C>;
}

export interface RefObject<C extends GinkgoComponent> {
    instance?: C;
}

export default class Ginkgo {
    public static Component = GinkgoComponent;
    public static Fragment = FragmentComponent;

    public static createElement<P extends GinkgoElement, T extends GinkgoComponent<P>>(
        tag: ComponentType<P, T> | ElementType | Function | string,
        attrs: { [key: string]: any },
        ...children: Array<GinkgoElement>): GinkgoElement {

        if (tag) {
            if (attrs) {
                attrs['children'] = undefined;
            }

            let childElements;
            if (children) {
                children = children.filter(value => value);
                // resolve <div>{this.props.children}<span></span></div>
                // tsx compiled GinkgoElement : [[...],{}]
                for (let el of children) {
                    if (!childElements) childElements = [];
                    if (el) {
                        if (el instanceof Array) {
                            el.map(value => childElements.push(value));
                        } else {
                            childElements.push(el);
                        }
                    }
                }
            }

            let props = {
                ...attrs,
                module: tag,
                children: childElements
            };
            return props;
        }
    }

    public static createRef<C extends GinkgoComponent>(): RefObject<C> {
        return {};
    }

    public static render<C extends GinkgoComponent, P extends GinkgoElement>(element: GinkgoElement, renderTo: Element)
        : { component: C, props: P } {
        let link: ContextLink = GinkgoContainer.buildRenderLink(renderTo);
        GinkgoContainer.mountPersistExistComponent(link, element);
        let children = link.children;
        let component = null, props = null;
        if (children && children.length > 0) {
            for (let c of children) {
                if (c.props === element) {
                    component = c.component;
                    props = c.props;
                    break;
                }
            }
        }
        return {component: component as C, props: props as P};
    }

    public static getComponentStatus(component: GinkgoComponent): string {
        let link = GinkgoContainer.getLinkByComponent(component);
        if (link) {
            return link.status;
        }
    }

    public static unmount(renderTo: Element): void {
        let link: ContextLink = GinkgoContainer.buildRenderLink(renderTo);
        GinkgoContainer.unmountComponentByLink(link);
    }

    public static unmountByElement(element: GinkgoElement, renderTo: Element): void {
        GinkgoContainer.unmountComponentByElement(element, renderTo);
    }

    public static unmountByComponent(component: GinkgoComponent) {
        let link = GinkgoContainer.getLinkByComponent(component);
        GinkgoContainer.unmountComponentByLink(link);
    }

    public static forEachContent(fn: (component: GinkgoComponent) => boolean | any,
                                 component: GinkgoComponent,
                                 breakComponent?: any) {
        if (fn && component) {
            let link = GinkgoContainer.getLinkByComponent(component);
            if (link) {
                this.forEachContentByLink(fn, link, breakComponent);
            }
        }
    }

    public static forEachChildren(fn: (component: GinkgoComponent) => boolean | any,
                                  component: GinkgoComponent,
                                  breakComponent?: any) {
        if (fn && component) {
            let link = GinkgoContainer.getLinkByComponent(component);
            if (link && link.content && typeof link.props == "object") {
                let propsChild = link.props.children;
                this.forEachChildrenByLink(fn, [link.content], propsChild, breakComponent)
            }
        }
    }

    private static forEachContentByLink(fn: (component: GinkgoComponent) => boolean,
                                        link: ContextLink,
                                        breakComponent?: any) {
        let children = link.children,
            content = link.content;

        // 只循环被挂载的组件
        // 所以如果有content表示是自定义组件或者Bind组件
        if (content) {
            if (breakComponent && content.component instanceof breakComponent) {
                let bool = fn(content.component);
                if (bool == false) return;
            } else {
                let bool = fn(content.component);
                if (bool == false) return;
                this.forEachContentByLink(fn, content, breakComponent);
            }
        } else if (children) {
            for (let child of children) {
                if (child) {
                    if (breakComponent && child.component instanceof breakComponent) {
                        let bool = fn(child.component);
                        if (bool == false) return;
                    } else {
                        let bool = fn(child.component);
                        if (bool == false) return;
                        this.forEachContentByLink(fn, child, breakComponent);
                    }
                }
            }
        }
    }

    private static forEachChildrenByLink(fn: (component: GinkgoComponent) => boolean,
                                         children: Array<ContextLink>,
                                         skips: Array<GinkgoElement> = [],
                                         breakComponent?: any) {
        if (children) {
            for (let c of children) {
                if (c) {
                    if (breakComponent && c.component instanceof breakComponent) {
                        let bool = fn(c.component);
                        if (bool == false) return;
                    } else {
                        let bool = fn(c.component);
                        if (bool == false) return;
                        if (typeof c.props == "object") {
                            if (skips.indexOf(c.props) == -1) {
                                this.forEachChildrenByLink(fn, c.children, skips, breakComponent);
                            }
                        }
                    }
                }
            }
        }
    }

    public static get(url: string, data?: { [key: string]: any } | FormData): Promise<any> {
        return GinkgoHttpRequest.get(url, data);
    }

    public static post(url: string, data?: DataType): Promise<any> {
        return GinkgoHttpRequest.post(url, data);
    }
}
