import {GinkgoElement, GinkgoNode, GinkgoContainer, GinkgoTools} from "./Ginkgo";
import {BindComponentElement} from "./BindComponent";
import {ContextLink} from "./GinkgoContainer";

export class GinkgoComponent<P = {}, S = {}> {

    /**
     * current component parent
     */
    parent?: GinkgoComponent;

    /**
     * current component attributes
     */
    readonly props?: Readonly<P> & { readonly children?: Array<GinkgoElement> };

    /**
     * init props value
     */
    defaultProps?: P | any;

    state?: Readonly<S>;

    /**
     * current component children elements
     */
    children?: Array<GinkgoComponent>;

    /**
     * assemble component elements
     */
    content?: GinkgoComponent;

    constructor(props?: Readonly<P>) {
        this.props = props;
    }

    /**
     * 获取渲染的元素
     */
    render?(): GinkgoNode;

    /**
     * 组件即将挂载，一个生命周期只执行一次
     */
    componentWillMount?(): void;

    /**
     * 组件即将销毁，一个生命周期只执行一次
     */
    componentWillUnmount?(): void;

    /**
     * 组件已经挂载，一个生命周期只执行一次且是第一次挂载时执行
     */
    componentDidMount?(): void;

    /**
     * 组件的子元素是否改变
     * 自定义组件分为内容元素(content elements) 和 子元素(children elements)
     * 内容元素是构成组件需要的元素，子元素是被内容元素所使用，如果内容元素不使用则
     * 子元素属于冗余元素(或者无效元素)，不会被挂载
     *
     * @param children
     * @param old
     */
    componentChildChange?(children: Array<GinkgoElement>, old: Array<GinkgoElement>): void;

    /**
     * 每次执行对比时的新的属性对象
     * 无论属性对象是否一致该方法每次对比时都会执行
     *
     * @param props
     * @param context
     */
    componentReceiveProps?(props: P, context?: { oldProps: P, type: "new" | "mounted" }): void;

    update(props: P | string, propsValue?: any) {
        if (typeof props === "object") {
            props = {...this.props, ...props};
            GinkgoContainer.updateComponentProps(this, props);
        } else if (typeof props === "string") {
            let newProps: { [key: string]: any } = {...this.props};
            newProps[props] = propsValue;
            GinkgoContainer.updateComponentProps(this, newProps);
        }
    }

    /**
     * 添加元素到子元素
     * @param props
     */
    append(props: GinkgoElement | GinkgoElement[] | string): void {
        let link: ContextLink = GinkgoContainer.getLinkByComponent(this);
        let newPropsChildren = GinkgoTools.componentAppendProps(link.props as GinkgoElement, props);
        if (newPropsChildren) {
            GinkgoContainer.mountComponentByComponent(this, newPropsChildren);
        }
    }

    /**
     * 替换全部子元素
     * @param props
     */
    overlap<E extends GinkgoElement>(props?: E | E[] | string | null | undefined): void {
        let newPropsChildren = GinkgoTools.componentOverlayProps(props);
        if (newPropsChildren) {
            GinkgoContainer.mountComponentByComponent(this, newPropsChildren);
        } else {
            GinkgoContainer.unmountComponentByLinkChildren(GinkgoContainer.getLinkByComponent(this));
        }
    }

    remove(props: GinkgoElement | GinkgoElement[]): void {
        if (props) {
            let link: ContextLink = GinkgoContainer.getLinkByComponent(this);
            let children = link.children;
            let rms = [];
            if (children && children.length > 0) {
                for (let c of children) {
                    if (props instanceof Array) {
                        for (let fromP of props) {
                            if (fromP == c.props) {
                                rms.push(c);
                            }
                        }
                    } else {
                        if (c.props == props) {
                            rms.push(c);
                        }
                    }
                }
            }

            for (let c of rms) {
                GinkgoContainer.unmountComponentByLink(c);
            }
        }
    }

    forceRender() {
        GinkgoContainer.rerenderComponentByComponent(this);
    }

    setState(state: { [key: string]: any }): void {
        if (state) {

            for (let stateKey in state) {
                this.state[stateKey] = state[stateKey];
            }

            let link = GinkgoContainer.getLinkByComponent(this);
            let content = link.content;
            if (content) {
                let bindLinks = GinkgoContainer.getBindLinks(content);
                if (bindLinks) {
                    for (let bl of bindLinks) {
                        let newBindLinks = GinkgoContainer.getBindLinks(content);
                        if (newBindLinks.indexOf(bl) >= 0) {
                            let bindProps = bl.props as BindComponentElement;
                            if (bindProps) {
                                let bindKeys = bindProps.bind;
                                if (bindKeys) {
                                    if (bindKeys instanceof Array) {
                                        for (let bk of bindKeys) {
                                            let ks = bk.split("\\.");
                                            let data = state;
                                            for (let k of ks) {
                                                if (data != undefined) data = data[k]; else break;
                                            }
                                            if (data != undefined) {
                                                GinkgoContainer.forceComponent(bl);
                                            }
                                        }
                                    } else {
                                        let ks = bindKeys.split("\\.");
                                        let data = state;
                                        for (let k of ks) {
                                            if (data != undefined) data = data[k]; else break;
                                        }
                                        if (data != undefined) {
                                            GinkgoContainer.forceComponent(bl);
                                        }
                                    }
                                } else {
                                    GinkgoContainer.forceComponent(bl);
                                }
                            }
                        } else {
                            // if after forceComponent , some components fail to skip
                        }
                    }
                }
            }
        }
    }
}
