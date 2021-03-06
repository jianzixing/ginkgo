import Ginkgo, {GinkgoElement, GinkgoNode, GinkgoContainer, GinkgoTools, RefObject, refObjectCall} from "./Ginkgo";
import {ContextLink} from "./GinkgoContainer";
import {QuerySelector} from "./QuerySelector";

export type ContextUpdate<P, S> = {
    oldProps: P,
    state?: S
};

export type ContextReceive<P, S> = {
    oldProps: P,
    type: "new" | "mounted",
    state?: S
}

type QTks = {
    promise: Promise<any>,
    c: GinkgoComponent,
    queue: Array<{ data: Object, callback: (data?: Object) => void }>,
    trigger: boolean
};
let queueTasks: Array<QTks> = [];
let willUpdateCall = function (c: GinkgoComponent) {
    try {
        if (c.componentWillUpdate) {
            c.componentWillUpdate(c.props, {oldProps: c.props, state: c.state})
        }
    } catch (e) {
        console.error(e);
    }
}
let didUpdateCall = function (c: GinkgoComponent) {
    try {
        if (c.componentDidUpdate) {
            c.componentDidUpdate(c.props, {oldProps: c.props, state: c.state})
        }
        if (c.componentRenderUpdate) {
            c.componentRenderUpdate(c.props, {oldProps: c.props, state: c.state})
        }
    } catch (e) {
        console.error(e);
    }
}

export class GinkgoComponent<P = any | { key?: string | number, ref?: refObjectCall | RefObject<GinkgoComponent>, part?: string }, S = {}> {

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

    componentWillReceiveProps?(props: P, context?: ContextReceive<P, S>): S | void;

    componentReceiveProps?(props: P, context?: ContextReceive<P, S>): void;

    componentWillCompareProps?(props: P, context?: ContextUpdate<P, S>): S | void;

    componentCompareProps?(props: P, context?: ContextUpdate<P, S>): void;

    /**
     * 当前组件更新之前调用
     *
     * @param nextProps
     * @param nextState
     */
    componentWillUpdate?(nextProps?: P, context?: ContextUpdate<P, S>): void;

    /**
     * 当前组件更新之后调用
     *
     * @param props
     * @param state
     */
    componentDidUpdate?(props?: P, context?: ContextUpdate<P, S>): void;

    /**
     * 和 componentDidUpdate 相同
     * 区别在于第一次渲染后也会调用这个方法
     * 类似componentReceiveProps和componentUpdateProps的区别
     *
     * @param props
     * @param state
     */
    componentRenderUpdate?(props?: P, context?: ContextUpdate<P, S>): void;

    shouldComponentUpdate?(nextProps?: P, context?: ContextUpdate<P, S>): boolean;

    set(props: P | string, propsValue?: any | boolean, dontForceRender?: boolean) {
        let link = GinkgoContainer.getLinkByComponent(this);
        let selfProps = link.props;
        if (typeof props === "object" && typeof selfProps === "object") {
            props = {...selfProps, ...props};
            GinkgoContainer.updateComponentProps(link, props, propsValue === true);
        } else if (typeof props === "string" && typeof selfProps === "object") {
            let newProps: { [key: string]: any } = {...selfProps};
            newProps[props] = propsValue;
            GinkgoContainer.updateComponentProps(link, newProps, dontForceRender === true);
        }
    }

    /**
     * 添加元素到子元素
     * @param props
     */
    append(props: GinkgoElement | GinkgoElement[] | string): void {
        try {
            let link: ContextLink = GinkgoContainer.getLinkByComponent(this);
            if (link && link.props) {
                willUpdateCall(this);
                let newPropsChildren = GinkgoTools.componentAppendProps(link.props as GinkgoElement, props);
                if (newPropsChildren) {
                    GinkgoContainer.mountComponentByComponent(link, newPropsChildren);
                }
                didUpdateCall(this);
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 替换全部子元素
     * @param props
     */
    overlap<E extends GinkgoElement>(props?: E | E[] | string | null | undefined): void {
        try {
            let link: ContextLink = GinkgoContainer.getLinkByComponent(this);
            if (link && link.props) {
                willUpdateCall(this);
                let newPropsChildren = GinkgoTools.componentOverlayProps(props);
                if (newPropsChildren) {
                    GinkgoContainer.mountComponentByComponent(link, newPropsChildren);
                } else {
                    GinkgoContainer.unmountComponentByLinkChildren(link);
                }
                didUpdateCall(this);
            }
        } catch (e) {
            console.error(e);
        }
    }

    remove(props: GinkgoElement | GinkgoElement[]): void {
        if (props) {
            let link: ContextLink = GinkgoContainer.getLinkByComponent(this);
            if (link) {
                willUpdateCall(this);
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
                didUpdateCall(this);
            }
        }
    }

    forceRender(isCallUpdate?: boolean) {
        if (this['_disableSetStateCall'] === true) {
            return;
        }
        GinkgoContainer.rerenderComponentByComponent(this, isCallUpdate);
    }

    setState(state?: { [key: string]: any },
             fn?: ((state?: { [key: string]: any }) => void) | boolean,
             isCallUpdate?: boolean): Promise<any> | any {
        if (this['_disableSetStateCall'] === true) {
            return;
        }
        if (this['_disableSetStateCallAndDo'] === true) {
            for (let stateKey in state) {
                this.state[stateKey] = state[stateKey];
            }
            return;
        }
        if (fn == false && isCallUpdate == null) isCallUpdate = false;
        if (state == null) state = {};
        let task: QTks;
        for (let queue of queueTasks) {
            if (queue.c == this) {
                task = queue;
                break;
            }
        }
        if (task == null) {
            task = {
                promise: Promise.resolve(),
                c: this,
                queue: [{data: state, callback: typeof fn == "function" ? fn : undefined}],
                trigger: false
            };
            queueTasks.push(task);
        } else {
            task.queue.push({data: state, callback: typeof fn == "function" ? fn : undefined});
        }

        if (!task.trigger) {
            task.trigger = true;
            task.promise.then(() => {
                let queue = task.queue;
                if (queue && queue.length > 0) {
                    let replaceData = {};
                    queue.forEach(v => {
                        if (v && v.data) {
                            for (let stateKey in v.data) {
                                replaceData[stateKey] = v.data[stateKey];
                            }
                        }
                    });

                    for (let stateKey in replaceData) {
                        this.state[stateKey] = replaceData[stateKey];
                    }
                    this.forceRender(isCallUpdate);

                    queue.forEach(v => {
                        if (v && v.callback) {
                            v.callback(v);
                        }
                    });
                }

                task.trigger = false;
                queueTasks.splice(queueTasks.indexOf(task), 1);
            });
        }

        return task.promise;
    }

    queryAll<C extends GinkgoComponent>(...selector: any): Array<C> {
        let qs = new QuerySelector(this, selector);
        return qs.selector();
    }

    query<C extends GinkgoComponent>(...selector: any): C {
        let qs = new QuerySelector(this, selector);
        let arr = qs.selector(true);
        if (arr && arr.length > 0) {
            return arr[0] as C;
        }
        return null;
    }
}
