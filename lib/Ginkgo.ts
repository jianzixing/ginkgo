import {GinkgoComponent} from "./GinkgoComponent";
import {ContextLink, GinkgoContainer} from "./GinkgoContainer";
import {DataType, GinkgoHttpRequest, HttpConfig} from "./GinkgoHttpRequest";
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
export {GinkgoComponent, ContextReceive} from "./GinkgoComponent";
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

export type refObjectCall<C extends GinkgoComponent = any> = (instance: C) => void;

export type Bind = BindComponent;
export type Request = GinkgoHttpRequest;

export type GinkgoNode = GinkgoElement | string | undefined | null;

export interface GinkgoElement<C extends GinkgoComponent = any> {
    key?: string | number;
    readonly module?: ComponentType<any, any> | ElementType | Function | string;
    children?: Array<GinkgoElement>;
    ref?: refObjectCall | RefObject<C>;
    // 是否根据配置参与渲染
    part?: string;
}

export interface RefObject<C extends GinkgoComponent> {
    instance?: C;
}

export class QueryObject<C extends GinkgoComponent> {
    private selector: Array<any>;
    private component: GinkgoComponent;

    constructor(component: GinkgoComponent, selector: Array<any>) {
        this.component = component;
        this.selector = selector;
    }

    get instance(): C {
        if (this.component && this.selector) {
            return this.component.query(this.selector) as C;
        }
        return null;
    }
}

export default class Ginkgo {
    public static Component = GinkgoComponent;
    public static Fragment = FragmentComponent;
    public static TakeParts: Array<string> = [];
    private static isWarn: boolean = false;

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
                let keys = [];
                for (let item of children) {
                    if (!childElements) childElements = [];
                    if (item) {
                        if (item instanceof Array) {
                            item.map(value => {
                                if (value) {
                                    childElements.push(value);
                                    if (item.key) {
                                        if (keys.indexOf(item.key) >= 0) {
                                            item.key = undefined;
                                            console.error("Warning: element key duplicate");
                                        } else {
                                            keys.push(item.key);
                                        }
                                    }
                                    if (value.key == null && !this.isWarn) {
                                        console.warn("Warning: Each child in an array or iterator should have a unique " +
                                            "\"key\" prop. Check the elements");
                                        this.isWarn = true;
                                    }
                                }
                            });
                        } else {
                            childElements.push(item);
                            if (item.key) {
                                if (keys.indexOf(item.key) >= 0) {
                                    item.key = undefined;
                                    console.error("Warning: element key duplicate");
                                } else {
                                    keys.push(item.key);
                                }
                            }
                        }
                    }
                }
            }

            let props = {
                ...attrs,
                module: tag,
                children: childElements
            };

            if (props && Ginkgo.checkTakeParts(props)) {
                return props;
            }
        }
    }

    private static checkTakeParts(props: GinkgoElement): boolean {
        if (props &&
            props.part
            && props.part != ''
            && Ginkgo.TakeParts
            && Ginkgo.TakeParts instanceof Array
            && Ginkgo.TakeParts.indexOf(props.part) == -1) {
            return false;
        }

        let children = props.children;
        if (children && children.length > 0) {
            let rms;
            for (let c of children) {
                if (c && !Ginkgo.checkTakeParts(c)) {
                    if (!rms) rms = [];
                    rms.push(c);
                }
            }
            if (rms) {
                for (let rm of rms) {
                    children.splice(children.indexOf(rm), 1);
                }
            }
        }

        return true;
    }

    public static createRef<C extends GinkgoComponent>(): RefObject<C> {
        return {};
    }

    public static createQuery<C extends GinkgoComponent>(component: GinkgoComponent,
                                                         ...selector: any): QueryObject<C> {
        return new QueryObject(component, selector);
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

    public static getComponentByProps(props: GinkgoElement): GinkgoComponent {
        let link = GinkgoContainer.getLinkByProps(props);
        if (link) return link.component;
    }

    public static getComponentByDom(dom: Node): GinkgoComponent {
        let link = GinkgoContainer.getLinkByElement(dom);
        if (link) return link.component;
    }

    public static unmount(renderTo: Element): void {
        let link: ContextLink = GinkgoContainer.buildRenderLink(renderTo);
        GinkgoContainer.unmountComponentByLink(link);
    }

    public static unmountByComponent(component: GinkgoComponent) {
        let link = GinkgoContainer.getLinkByComponent(component);
        GinkgoContainer.unmountComponentByLink(link);
    }

    public static unmountByElement(element: GinkgoElement, renderTo: Element): void {
        GinkgoContainer.unmountComponentByElement(element, renderTo);
    }

    public static forEachChildren(fn: (component: GinkgoComponent) => boolean | any,
                                  component: GinkgoComponent,
                                  breakComponent?: any) {
        if (fn && component) {
            let link = GinkgoContainer.getLinkByComponent(component);
            if (link) {
                let children;
                if (link.content) {
                    children = [link.content];
                } else {
                    children = link.children;
                }
                if (link && link.content && typeof link.props == "object") {
                    this.forEachChildrenByLink(fn, children, {component: breakComponent, find: false})
                }
            }
        }
    }

    private static forEachChildrenByLink(fn: (component: GinkgoComponent) => boolean,
                                         children: Array<ContextLink>,
                                         breakComponent?: { component: GinkgoComponent, find: boolean }) {
        if (breakComponent && breakComponent.find == true) return;
        if (children) {
            for (let c of children) {
                if (c) {
                    if (breakComponent
                        && breakComponent.component
                        && c.component instanceof (breakComponent.component as any)) {
                        let bool = fn(c.component);
                        if (bool == false) {
                            breakComponent.find = true;
                            return;
                        }
                    } else {
                        let bool = fn(c.component);
                        if (bool == false) {
                            if (breakComponent) breakComponent.find = true;
                            return;
                        }
                        if (typeof c.props == "object") {
                            if (c.content) {
                                this.forEachChildrenByLink(fn, [c.content], breakComponent);
                            } else {
                                this.forEachChildrenByLink(fn, c.children, breakComponent);
                            }
                        }
                    }
                }
            }
        }
    }

    public static instanceofComponent(props: GinkgoElement, fn) {
        if (props.module === fn) {
            return true;
        }
        let component = GinkgoContainer.parseComponentByElement(props, false);
        if (component instanceof fn) {
            return true;
        }
        return false;
    }

    public static get(url: string, data?: { [key: string]: any } | FormData, config?: HttpConfig): Promise<any> {
        return GinkgoHttpRequest.get(url, data, config);
    }

    public static post(url: string, data?: DataType, config?: HttpConfig): Promise<any> {
        return GinkgoHttpRequest.post(url, data, config);
    }

    public static ajax(config: HttpConfig) {
        return GinkgoHttpRequest.ajax(config);
    }
}

console.log("%c%c北京简子行科技有限公司%c https://www.jianzixing.com.cn", "line-height:20px;",
    "line-height:20px;padding:4px 9px 4px 9px;background:#0B61A4;color:#fff;font-size:13px;margin-right:15px;border-radius:6px",
    "color:#333333;line-height:20px;font-size:13px;");
