/** BindComponent.d.ts **/
export declare function callBindRender(props: BindComponentElement): any;
export interface BindComponentElement extends GinkgoElement {
    render: Function;
    component?: new () => any;
    shouldUpdate?: boolean;
    params?: Array<any>;
}
export declare class BindComponent<P extends BindComponentElement = any> extends GinkgoComponent<P> {
    constructor(props?: P, holder?: {});
    append(props: GinkgoElement | GinkgoElement[] | string): void;
    overlap<E extends GinkgoElement>(props?: E[] | E | string | null | undefined): void;
    forceRender(): void;
    shouldComponentUpdate(nextProps?: P, nextState?: {}): boolean;
}

/** CSSProperties.d.ts **/
import * as CSS from "csstype";
export interface CSSProperties extends CSS.Properties<string | number> {
}

/** FragmentComponent.d.ts **/
export declare class FragmentComponent extends GinkgoComponent {
}

/** GinkgoAnimation.d.ts **/
export interface EasingSteps {
    numberOfSteps: number;
}
export interface EasingOutElastic {
    type: 'outElastic' | 'inElastic' | 'inOutElastic';
    amplitude: number;
    period: number;
}
export interface EasingSpring {
    mass: number;
    stiffness: number;
    damping: number;
    velocity: number;
}
export interface EasingCubicBezier {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
declare type easingType = (el: Element, i: number, total: number) => any | 'linear' | 'easeInQuad' | 'easeInCubic' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInQuart' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuint' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInSine' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInExpo' | 'easeOutSine' | 'easeInOutSine' | 'easeInCirc' | 'easeOutExpo' | 'easeInOutExpo' | 'easeInBack' | 'easeOutCirc' | 'easeInOutCirc' | string | EasingSteps | EasingOutElastic | EasingSpring | EasingCubicBezier;
/**
 * 'easeInQuad'        'easeOutQuad'    'easeInOutQuad'        由快至慢
 * 'easeInCubic'       'easeOutCubic'   'easeInOutCubic'       由快至慢，效果更强
 * 'easeInQuart'       'easeOutQuart'   'easeInOutQuart'       由快至慢，效果更强
 * 'easeInQuint'       'easeOutQuint'   'easeInOutQuint'       由快至慢，效果更强
 * 'easeInSine'        'easeOutSine'    'easeInOutSine'        由快至慢，比Quad弱
 * 'easeInExpo'        'easeOutExpo'    'easeInOutExpo'        突然减速，效果较强
 * 'easeInCirc'        'easeOutCirc'    'easeInOutCirc'        突然减速，效果较弱
 * 'easeInBack'        'easeOutBack'    'easeInOutBack'        冲出终点后返回
 *
 * (el, index, total) => void : params detail
 * target    The curently animated targeted element
 * index    The index of the animated targeted element
 * targetsLength    The total number of animated targets
 */
interface Params {
    delay?: (el: any, index: any, total: any) => void | number;
    duration?: (el: any, index: any, total: any) => void | number;
    autoplay?: boolean;
    loop?: boolean | number;
    direction?: 'normal' | 'reverse' | 'alternate';
    easing?: easingType;
    elasticity?: number;
    round?: boolean | number;
    begin?: (animation: any) => void;
    update?: (animation: any) => void;
    complete?: (animation: any) => void;
    loopBegin?: (animation: any) => void;
    loopComplete?: (animation: any) => void;
    change?: (animation: any) => void;
    changeBegin?: (animation: any) => void;
    changeComplete?: (animation: any) => void;
}
interface VariantChangeable {
    value?: string;
    duration?: number;
    easing?: easingType;
}
interface VariantCss {
    translateX?: number | VariantChangeable;
    translateY?: number | VariantChangeable;
    translateZ?: number | VariantChangeable;
    rotateX?: number | VariantChangeable;
    rotateY?: number | VariantChangeable;
    rotateZ?: number | VariantChangeable;
    rotate?: number | VariantChangeable;
    scale?: number | VariantChangeable;
    scaleX?: number | VariantChangeable;
    scaleY?: number | VariantChangeable;
    scaleZ?: number | VariantChangeable;
    skew?: number | VariantChangeable;
    skewX?: number | VariantChangeable;
    skewY?: number | VariantChangeable;
    perspective?: number | VariantChangeable;
    value?: string | number | Array<string | number>;
    keyframes?: Array<any>;
}
export declare type AnimationParams = (CSSProperties & VariantCss & Params & {
    [key: string]: VariantChangeable;
} & {
    [key: string]: Array<string | number>;
} & {
    [key: string]: (target: Element, index: number, targetsLength: number) => any;
}) | {
    [key: string]: any;
};
declare function parseEasings(easing: any, duration?: any): any;
declare function convertPxToUnit(el: any, value: any, unit: any): any;
declare function getOriginalTargetValue(target: any, propName: any, unit: any, animatable: any): any;
declare function getPath(path: any, percent: any): (property: any) => {
    property: any;
    el: any;
    svg: {
        el: any;
        viewBox: any;
        x: number;
        y: number;
        w: number;
        h: number;
    };
    totalLength: number;
};
declare function setTargetsValue(targets: any, properties: any): void;
declare function anime(params?: AnimationParams): any;
declare namespace anime {
    var speed: number;
    var running: any[];
    var remove: typeof removeTargets;
    var get: typeof getOriginalTargetValue;
    var set: typeof setTargetsValue;
    var convertPx: typeof convertPxToUnit;
    var path: typeof getPath;
    var setDashoffset: (el: any) => any;
    var stagger: (val: any, params?: any) => (el: any, i: any, t: any) => any;
    var timeline: (params?: AnimationParams) => any;
    var easing: typeof parseEasings;
    var penner: {
        linear: () => (t: any) => any;
    };
    var random: (min: any, max: any) => any;
}
declare function removeTargets(targets: any): void;
export declare const GinkgoAnimation: typeof anime;

/** GinkgoCompare.d.ts **/
export declare class GinkgoCompare {
    private readonly parent;
    private elements?;
    private renderMounts?;
    constructor(parent: ContextLink, elements?: GinkgoElement[] | undefined);
    /**
     * important!
     *
     * 将一组元素实例并挂载到parent中去
     */
    mount(): void;
    /**
     * important!
     *
     * 重新渲染一个组件的content内容
     */
    rerender(isCallUpdate?: boolean): void;
    /**
     * important!
     *
     * 触发重新渲染BindComponent的子元素
     */
    force(): void;
    setRenderCompare(elements: {
        parent: ContextLink;
        put?: GinkgoElement;
        out?: GinkgoElement;
    }): void;
    /************* 算法开始 ******************/
    private compare;
    private isComponentContent;
    private compareSibling;
    private elementIndexTreeNodes;
    private checkTreeNodeRemove;
    private diffMoveTreeNodes;
    private diffInsertTreeNodes;
    private diffRemoveTreeNodes;
    protected diffCompareComponent(parent: ContextLink, treeNodes: Array<ContextLink>, treeNode: ContextLink, newNode: GinkgoElement, index: any, onlyDiff?: boolean): void;
    /************* 算法结束 ******************/
    private createElement;
    private mountRealDom2Document;
    private findNextSibling;
    private findNextSiblingSingle;
    private compareComponentIsRebuild;
    private compareComponentByLink;
    private unbindComponent;
    private relevanceElementShould;
    private mountCreateFragmentLink;
    private setLinkParent;
    private clearPropsEmptyChildren;
    /**
     * 给ref赋值
     *
     * @param link
     */
    private buildChildrenRef;
    /**
     * 获取自定义组件的第一个或者最后一个真实dom
     * @param child
     * @param type 0获取第一个  1获取最后一个 2获取第一层列表 3判断当前是否是dom元素
     */
    private getComponentRealDom;
    private makeWillPropsLife;
    private buildComponentProps;
}



/**QuerySelector.d.ts**/
export class QuerySelector {
    private component;
    private condition;
    private matches;
    constructor(component: GinkgoComponent, condition: Array<any>);
    selector<C extends GinkgoComponent>(): Array<C>;
    private matchForEach;
    private isMatch;
    private parseCondition;
    private parseConditionStr;
}



/**GinkgoComponent.d.ts**/
export declare type ContextUpdate<P, S> = {
    oldProps: P;
    state?: S;
};
export declare type ContextReceive<P, S> = {
    oldProps: P;
    type: "new" | "mounted";
    state?: S;
};
export declare class GinkgoComponent<P = any | {
    key?: string | number;
    ref?: refObjectCall | RefObject<GinkgoComponent>;
    part?: string;
}, S = {}> {
    /**
     * current component parent
     */
    parent?: GinkgoComponent;
    /**
     * current component attributes
     */
    readonly props?: Readonly<P> & {
        readonly children?: Array<GinkgoElement>;
    };
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
    constructor(props?: Readonly<P>);
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
    set(props: P | string, propsValue?: any | boolean, dontForceRender?: boolean): void;
    /**
     * 添加元素到子元素
     * @param props
     */
    append(props: GinkgoElement | GinkgoElement[] | string): void;
    /**
     * 替换全部子元素
     * @param props
     */
    overlap<E extends GinkgoElement>(props?: E | E[] | string | null | undefined): void;
    remove(props: GinkgoElement | GinkgoElement[]): void;
    forceRender(isCallUpdate?: boolean): void;
    setState(state?: {
        [key: string]: any;
    }, fn?: ((state?: {
        [key: string]: any;
    }) => void) | boolean, isCallUpdate?: boolean): Promise<any> | any;
    queryAll<C extends GinkgoComponent>(...selector: any): Array<C>;
    query<C extends GinkgoComponent>(...selector: any): C;
}

/**GinkgoContainer.d.ts**/
export interface ContextLink {
    component?: GinkgoComponent;
    /**
     * 假如当前组件时HTML组件则记录当前组件的dom
     */
    holder?: {
        dom: Element | Text;
    };
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
export declare class GinkgoContainer {
    private static readonly context;
    static getCountContext(): number;
    private static getContentLink;
    /**
     * 创建一个元素包装用于作为容器的根
     * @param renderTo
     */
    static buildRenderLink(renderTo: Element): ContextLink;
    /**
     * 通过主键获取主键的包装数据link
     * @param component
     */
    static getLinkByComponent(component: GinkgoComponent): ContextLink;
    static getLinkByElement(element: Node): ContextLink;
    static getLinkByProps(props: GinkgoElement): ContextLink;
    /**
     * 通过元素配置创建组件
     * @param element
     */
    static parseComponentByElement<E extends GinkgoElement>(element: E | string, dom?: Element | boolean): GinkgoComponent;
    static isBaseType(props: any): boolean;
    static getBaseTypeText(props: any): string;
    static setDefaultProps(component: GinkgoComponent, element: GinkgoElement | string): void;
    /**
     * 挂载element到parent并且跳过对比parent的子类
     * 挂载时保存parent的子元素
     *
     * @param parent
     * @param element
     */
    static mountPersistExistComponent<E extends GinkgoElement>(parent: ContextLink, element: E): void;
    /**
     * 挂载元素到组件
     * @param parent
     * @param element
     */
    static mountComponent<E extends GinkgoElement>(parent: ContextLink, element: E): void;
    /**
     * 挂载元素到组件
     * @param parent
     * @param elements
     */
    static mountComponentArray<E extends GinkgoElement>(parent: ContextLink, elements?: E[]): void;
    /**
     * 重新渲染一次link的所有子元素
     * @param link
     */
    static forceComponent(link: ContextLink): void;
    /**
     * 主动触发更新组件的props
     * @param component
     * @param props
     */
    static updateComponentProps<P extends GinkgoElement>(link: ContextLink, props: P, dontForceRender?: boolean): void;
    /**
     * 通过组件找到link并且将elements添加到link的子元素中
     * @param component
     * @param elements
     */
    static mountComponentByComponent<E extends GinkgoElement>(link: ContextLink, elements?: E[]): void;
    /**
     * 重新渲染component的内容
     * @param component
     */
    static rerenderComponentByComponent<E extends GinkgoElement>(component: GinkgoComponent, isCallUpdate?: boolean): void;
    /**
     * 卸载link的其子元素(不包括link本身)
     * @param link
     */
    static unmountComponentByLinkChildren(link: ContextLink): void;
    /**
     * 卸载link及其子元素(包括link本身)
     * @param link
     */
    static unmountComponentByLink(link: ContextLink): void;
    /**
     * 通过element卸载组件
     * @param props
     * @param renderTo
     */
    static unmountComponentByElement(props: GinkgoElement, renderTo: Element): void;
}


/**GinkgoHttpRequest.d.ts**/
export declare type DataType = {
    [key: string]: any;
} | Blob | FormData | URLSearchParams | ReadableStream<Uint8Array> | string | Document;
export interface HttpConfig {
    url?: string;
    method?: "GET" | "POST";
    data?: DataType;
    postQueryString?: boolean;
    withCredentials?: boolean;
    headers?: {
        [key: string]: string;
    };
    timeout?: number;
    onProgress?: (e: ProgressEvent) => void;
    onFinish?: (e: Event) => void;
    onFail?: (e: Event, http?: XMLHttpRequest) => void;
}
export declare class GinkgoHttpRequest {
    static get(url: string, data?: {
        [key: string]: any;
    } | FormData, config?: HttpConfig): Promise<any>;
    static post(url: string, data?: DataType, config?: HttpConfig): Promise<any>;
    static ajax(config?: HttpConfig): Promise<any>;
    private static appendUrlQueryString;
    static object2QueryString(params: {
        [key: string]: any;
    }): string;
    static queryString2Object(url: string): {};
}

/**GinkgoTools.d.ts**/
export declare class GinkgoTools {
    static getWindowSize(): {
        width: number;
        height: number;
    };
    static componentOverlayProps<E extends GinkgoElement>(props?: E | E[] | string | null | undefined): E[];
    static componentAppendProps<E extends GinkgoElement>(oldProps: E, newProps: GinkgoElement | GinkgoElement[] | string): GinkgoElement<any>[];
    static getBounds(component: HTMLComponent | HTMLElement): {
        x: number;
        y: number;
        w: number;
        h: number;
        cw: number;
        ch: number;
        parents: Element[];
    };
}


/**HTMLComponent.d.ts**/
export declare type EventHandler = (e: Event) => void;
interface DOMAttributes {
    onCopy?: EventHandler;
    onCopyCapture?: EventHandler;
    onCut?: EventHandler;
    onCutCapture?: EventHandler;
    onPaste?: EventHandler;
    onPasteCapture?: EventHandler;
    onCompositionEnd?: EventHandler;
    onCompositionEndCapture?: EventHandler;
    onCompositionStart?: EventHandler;
    onCompositionStartCapture?: EventHandler;
    onCompositionUpdate?: EventHandler;
    onCompositionUpdateCapture?: EventHandler;
    onFocus?: EventHandler;
    onFocusCapture?: EventHandler;
    onBlur?: EventHandler;
    onBlurCapture?: EventHandler;
    onChange?: EventHandler;
    onChangeCapture?: EventHandler;
    onBeforeInput?: EventHandler;
    onBeforeInputCapture?: EventHandler;
    onInput?: EventHandler;
    onInputCapture?: EventHandler;
    onReset?: EventHandler;
    onResetCapture?: EventHandler;
    onSubmit?: EventHandler;
    onSubmitCapture?: EventHandler;
    onInvalid?: EventHandler;
    onInvalidCapture?: EventHandler;
    onLoad?: EventHandler;
    onLoadCapture?: EventHandler;
    onError?: EventHandler;
    onErrorCapture?: EventHandler;
    onKeyDown?: EventHandler;
    onKeyDownCapture?: EventHandler;
    onKeyPress?: EventHandler;
    onKeyPressCapture?: EventHandler;
    onKeyUp?: EventHandler;
    onKeyUpCapture?: EventHandler;
    onAbort?: EventHandler;
    onAbortCapture?: EventHandler;
    onCanPlay?: EventHandler;
    onCanPlayCapture?: EventHandler;
    onCanPlayThrough?: EventHandler;
    onCanPlayThroughCapture?: EventHandler;
    onDurationChange?: EventHandler;
    onDurationChangeCapture?: EventHandler;
    onEmptied?: EventHandler;
    onEmptiedCapture?: EventHandler;
    onEncrypted?: EventHandler;
    onEncryptedCapture?: EventHandler;
    onEnded?: EventHandler;
    onEndedCapture?: EventHandler;
    onLoadedData?: EventHandler;
    onLoadedDataCapture?: EventHandler;
    onLoadedMetadata?: EventHandler;
    onLoadedMetadataCapture?: EventHandler;
    onLoadStart?: EventHandler;
    onLoadStartCapture?: EventHandler;
    onPause?: EventHandler;
    onPauseCapture?: EventHandler;
    onPlay?: EventHandler;
    onPlayCapture?: EventHandler;
    onPlaying?: EventHandler;
    onPlayingCapture?: EventHandler;
    onProgress?: EventHandler;
    onProgressCapture?: EventHandler;
    onRateChange?: EventHandler;
    onRateChangeCapture?: EventHandler;
    onSeeked?: EventHandler;
    onSeekedCapture?: EventHandler;
    onSeeking?: EventHandler;
    onSeekingCapture?: EventHandler;
    onStalled?: EventHandler;
    onStalledCapture?: EventHandler;
    onSuspend?: EventHandler;
    onSuspendCapture?: EventHandler;
    onTimeUpdate?: EventHandler;
    onTimeUpdateCapture?: EventHandler;
    onVolumeChange?: EventHandler;
    onVolumeChangeCapture?: EventHandler;
    onWaiting?: EventHandler;
    onWaitingCapture?: EventHandler;
    onAuxClick?: EventHandler;
    onAuxClickCapture?: EventHandler;
    onClick?: EventHandler;
    onClickCapture?: EventHandler;
    onContextMenu?: EventHandler;
    onContextMenuCapture?: EventHandler;
    onDoubleClick?: EventHandler;
    onDoubleClickCapture?: EventHandler;
    onDrag?: EventHandler;
    onDragCapture?: EventHandler;
    onDragEnd?: EventHandler;
    onDragEndCapture?: EventHandler;
    onDragEnter?: EventHandler;
    onDragEnterCapture?: EventHandler;
    onDragExit?: EventHandler;
    onDragExitCapture?: EventHandler;
    onDragLeave?: EventHandler;
    onDragLeaveCapture?: EventHandler;
    onDragOver?: EventHandler;
    onDragOverCapture?: EventHandler;
    onDragStart?: EventHandler;
    onDragStartCapture?: EventHandler;
    onDrop?: EventHandler;
    onDropCapture?: EventHandler;
    onMouseDown?: EventHandler;
    onMouseDownCapture?: EventHandler;
    onMouseEnter?: EventHandler;
    onMouseLeave?: EventHandler;
    onMouseMove?: EventHandler;
    onMouseMoveCapture?: EventHandler;
    onMouseOut?: EventHandler;
    onMouseOutCapture?: EventHandler;
    onMouseOver?: EventHandler;
    onMouseOverCapture?: EventHandler;
    onMouseUp?: EventHandler;
    onMouseUpCapture?: EventHandler;
    onSelect?: EventHandler;
    onSelectCapture?: EventHandler;
    onTouchCancel?: EventHandler;
    onTouchCancelCapture?: EventHandler;
    onTouchEnd?: EventHandler;
    onTouchEndCapture?: EventHandler;
    onTouchMove?: EventHandler;
    onTouchMoveCapture?: EventHandler;
    onTouchStart?: EventHandler;
    onTouchStartCapture?: EventHandler;
    onPointerDown?: EventHandler;
    onPointerDownCapture?: EventHandler;
    onPointerMove?: EventHandler;
    onPointerMoveCapture?: EventHandler;
    onPointerUp?: EventHandler;
    onPointerUpCapture?: EventHandler;
    onPointerCancel?: EventHandler;
    onPointerCancelCapture?: EventHandler;
    onPointerEnter?: EventHandler;
    onPointerEnterCapture?: EventHandler;
    onPointerLeave?: EventHandler;
    onPointerLeaveCapture?: EventHandler;
    onPointerOver?: EventHandler;
    onPointerOverCapture?: EventHandler;
    onPointerOut?: EventHandler;
    onPointerOutCapture?: EventHandler;
    onGotPointerCapture?: EventHandler;
    onGotPointerCaptureCapture?: EventHandler;
    onLostPointerCapture?: EventHandler;
    onLostPointerCaptureCapture?: EventHandler;
    onScroll?: EventHandler;
    onScrollCapture?: EventHandler;
    onWheel?: EventHandler;
    onWheelCapture?: EventHandler;
    onAnimationStart?: EventHandler;
    onAnimationStartCapture?: EventHandler;
    onAnimationEnd?: EventHandler;
    onAnimationEndCapture?: EventHandler;
    onAnimationIteration?: EventHandler;
    onAnimationIterationCapture?: EventHandler;
    onTransitionEnd?: EventHandler;
    onTransitionEndCapture?: EventHandler;
}
export interface HTMLAttributes extends GinkgoElement, DOMAttributes {
    accessKey?: string;
    className?: string | string[] | (() => string | string[]);
    contentEditable?: boolean;
    contextMenu?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    id?: string;
    lang?: string;
    placeholder?: string;
    slot?: string;
    spellCheck?: boolean;
    style?: CSSProperties | (() => CSSProperties);
    tabIndex?: number;
    title?: string;
    setInnerHTML?: string;
}
export declare class HTMLComponent<P extends HTMLAttributes = any> extends GinkgoComponent<P> {
    protected readonly holder: {
        dom: Element;
    };
    private componentEventCaches?;
    private bindEventCaches?;
    private componentClassNameCaches;
    constructor(props?: P, holder?: {
        dom: Element;
    });
    get dom(): Element;
    animation(param: AnimationParams): any;
    componentWillReceiveProps(props: P, context?: any): void;
    private comparePropsVersion;
    private getFinalClassName;
    private isSameObject;
    /**
     *  private isSameClassName(c1: string, c2: string): boolean {
     *     if (c1 == null && c2 != null) return false;
     *     if (c1 != null && c2 == null) return false;
     *     if (c1 == null && c2 == null) return true;
     *
     *     let a1 = c1.split(" ");
     *     let a2 = c2.split(" ");
     *     if (a1.length != a2.length) return false;
     *     for (let i1 of a1) {
     *         let is = false;
     *         for (let i2 of a2) {
     *             if (i1.trim() == i2.trim()) {
     *                 is = true;
     *                 break;
     *             }
     *         }
     *         if (!is) return false;
     *     }
     *     return true;
     * }
     **/
    private clearNullDomStyle;
    private isEventProps;
    private bindDomEvent;
    reloadClassName(): void;
    reloadStyle(): void;
    reloadStyleSheets(): void;
    get width(): number;
    get height(): number;
    get clientWidth(): number;
    get clientHeight(): number;
    get scrollWidth(): number;
    get scrollHeight(): number;
    get scrollLeft(): number;
    get scrollTop(): number;
    get style(): CSSStyleDeclaration;
    get className(): string;
    set className(name: string);
    attr(key?: string, value?: string): any;
    addClass(cls: string): void;
    removeClass(cls: string): void;
    html(html?: string): string;
    text(text?: string): string;
    bind(name: string, callback: any, options?: any): void;
    unbind(name: string, callback?: any, options?: any): void;
}


/**HTMLDefinedAttribute.d.ts**/
export interface HTMLAnchorAttributes extends HTMLAttributes {
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    ping?: string;
    rel?: string;
    target?: "_blank" | "_self" | "_parent" | "_top" | string;
    type?: string;
    referrerPolicy?: string;
}
export interface HTMLAreaAttributes extends HTMLAttributes {
    alt?: string;
    coords?: string;
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    rel?: string;
    shape?: string;
    target?: string;
}
export interface HTMLMediaAttributes extends HTMLAttributes {
    autoPlay?: boolean;
    controls?: boolean;
    controlsList?: string;
    crossOrigin?: string;
    loop?: boolean;
    mediaGroup?: string;
    muted?: boolean;
    playsinline?: boolean;
    preload?: string;
    src?: string;
}
export interface HTMLAudioAttributes extends HTMLMediaAttributes {
}
export interface HTMLBaseAttributes extends HTMLAttributes {
    href?: string;
    target?: string;
}
export interface HTMLBlockquoteAttributes extends HTMLAttributes {
    cite?: string;
}
export interface HTMLButtonAttributes extends HTMLAttributes {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: 'submit' | 'reset' | 'button';
    value?: string | string[] | number;
}
export interface HTMLCanvasAttributes extends HTMLAttributes {
    height?: number | string;
    width?: number | string;
}
export interface HTMLColgroupAttributes extends HTMLAttributes {
    span?: number;
    width?: number | string;
}
export interface HTMLDataAttributes extends HTMLAttributes {
    value?: string | string[] | number;
}
export interface HTMLDelAttributes extends HTMLAttributes {
    cite?: string;
    dateTime?: string;
}
export interface HTMLDetailsAttributes extends HTMLAttributes {
    open?: boolean;
}
export interface HTMLDialogAttributes extends HTMLAttributes {
    open?: boolean;
}
export interface HTMLEmbedAttributes extends HTMLAttributes {
    height?: number | string;
    src?: string;
    type?: string;
    width?: number | string;
}
export interface HTMLFieldSetAttributes extends HTMLAttributes {
    disabled?: boolean;
    form?: string;
    name?: string;
}
export interface HTMLFormAttributes extends HTMLAttributes {
    acceptCharset?: string;
    action?: string;
    autoComplete?: string;
    encType?: string;
    method?: string;
    name?: string;
    noValidate?: boolean;
    target?: string;
}
export interface HTMLIFrameAttributes extends HTMLAttributes {
    allow?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    frameBorder?: number | string;
    height?: number | string;
    marginHeight?: number;
    marginWidth?: number;
    name?: string;
    referrerPolicy?: string;
    sandbox?: string;
    scrolling?: string;
    seamless?: boolean;
    src?: string;
    srcDoc?: string;
    width?: number | string;
}
export interface HTMLImageAttributes extends HTMLAttributes {
    alt?: string;
    crossOrigin?: "anonymous" | "use-credentials" | "";
    decoding?: "async" | "auto" | "sync";
    height?: number | string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    useMap?: string;
    width?: number | string;
}
export interface HTMLKeygenAttributes extends HTMLAttributes {
    autoFocus?: boolean;
    challenge?: string;
    disabled?: boolean;
    form?: string;
    keyType?: string;
    keyParams?: string;
    name?: string;
}
export interface HTMLLabelAttributes extends HTMLAttributes {
    form?: string;
    htmlFor?: string;
}
export interface HTMLLIAttributes extends HTMLAttributes {
    value?: string | string[] | number;
}
export interface HTMLLinkAttributes extends HTMLAttributes {
    as?: string;
    crossOrigin?: string;
    href?: string;
    hrefLang?: string;
    integrity?: string;
    media?: string;
    rel?: string;
    sizes?: string;
    type?: string;
}
export interface HTMLMapAttributes extends HTMLAttributes {
    name?: string;
}
export interface HTMLMenuAttributes extends HTMLAttributes {
    type?: string;
}
export interface HTMLMetaAttributes extends HTMLAttributes {
    charSet?: string;
    content?: string;
    httpEquiv?: string;
    name?: string;
}
export interface HTMLMeterAttributes extends HTMLAttributes {
    form?: string;
    high?: number;
    low?: number;
    max?: number | string;
    min?: number | string;
    optimum?: number;
    value?: string | string[] | number;
}
export interface HTMLObjectAttributes extends HTMLAttributes {
    classID?: string;
    data?: string;
    form?: string;
    height?: number | string;
    name?: string;
    type?: string;
    useMap?: string;
    width?: number | string;
    wmode?: string;
}
export interface HTMLOlAttributes extends HTMLAttributes {
    reversed?: boolean;
    start?: number;
    type?: '1' | 'a' | 'A' | 'i' | 'I';
}
export interface HTMLOptgroupAttributes extends HTMLAttributes {
    disabled?: boolean;
    label?: string;
}
export interface HTMLOptionAttributes extends HTMLAttributes {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string | string[] | number;
}
export interface HTMLOutputAttributes extends HTMLAttributes {
    form?: string;
    htmlFor?: string;
    name?: string;
}
export interface HTMLParamAttributes extends HTMLAttributes {
    name?: string;
    value?: string | string[] | number;
}
export interface HTMLProgressAttributes extends HTMLAttributes {
    max?: number | string;
    value?: string | string[] | number;
}
export interface HTMLQuoteAttributes extends HTMLAttributes {
    cite?: string;
}
export interface HTMLScriptAttributes extends HTMLAttributes {
    async?: boolean;
    charSet?: string;
    crossOrigin?: string;
    defer?: boolean;
    integrity?: string;
    noModule?: boolean;
    nonce?: string;
    src?: string;
    type?: string;
}
export interface HTMLSelectAttributes extends HTMLAttributes {
    autoComplete?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
    value?: string | string[] | number;
    onChange?: EventHandler;
}
export interface HTMLSourceAttributes extends HTMLAttributes {
    media?: string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    type?: string;
}
export interface HTMLStyleAttributes extends HTMLAttributes {
    media?: string;
    nonce?: string;
    scoped?: boolean;
    type?: string;
}
export interface HTMLColAttributes extends HTMLAttributes {
    span?: number;
    width?: number | string;
}
export interface HTMLTableAttributes extends HTMLAttributes {
    cellPadding?: number | string;
    cellSpacing?: number | string;
    summary?: string;
}
export interface HTMLTdAttributes extends HTMLAttributes {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
    valign?: "top" | "middle" | "bottom" | "baseline";
}
export interface HTMLThAttributes extends HTMLAttributes {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
}
export interface HTMLTextareaAttributes extends HTMLAttributes {
    autoComplete?: string;
    autoFocus?: boolean;
    cols?: number;
    dirName?: string;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    value?: string | string[] | number;
    wrap?: string;
    onChange?: EventHandler;
}
export interface HTMLTimeAttributes extends HTMLAttributes {
    dateTime?: string;
}
export interface HTMLTrackAttributes extends HTMLAttributes {
    default?: boolean;
    kind?: string;
    label?: string;
    src?: string;
    srcLang?: string;
}
export interface HTMLVideoAttributes extends HTMLMediaAttributes {
    height?: number | string;
    playsInline?: boolean;
    poster?: string;
    width?: number | string;
    disablePictureInPicture?: boolean;
}
export interface HTMLWebViewAttributes extends HTMLAttributes {
    allowFullScreen?: boolean;
    allowpopups?: boolean;
    autoFocus?: boolean;
    autosize?: boolean;
    blinkfeatures?: string;
    disableblinkfeatures?: string;
    disableguestresize?: boolean;
    disablewebsecurity?: boolean;
    guestinstance?: string;
    httpreferrer?: string;
    nodeintegration?: boolean;
    partition?: string;
    plugins?: boolean;
    preload?: string;
    src?: string;
    useragent?: string;
    webpreferences?: string;
}
export interface HTMLInsAttributes extends HTMLAttributes {
    cite?: string;
    dateTime?: string;
}
export interface HTMLHtmlAttributes extends HTMLAttributes {
    manifest?: string;
}


/**InputComponent.d.ts**/
export interface HTMLInputAttributes extends HTMLAttributes {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    capture?: boolean | string;
    checked?: boolean;
    crossOrigin?: string;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: "text" | "button" | "checkbox" | "file" | "hidden" | "image" | "password" | "radio" | "reset" | "submit" | string;
    value?: string | string[] | number;
    width?: number | string;
    onChange?: EventHandler;
}
export declare class InputComponent<P extends HTMLInputAttributes = any> extends HTMLComponent<P> {
    set value(value: string | number);
    get value(): string | number;
    /**
     * 添加元素到子元素
     * @param props
     */
    append(props: GinkgoElement | GinkgoElement[] | string): void;
    overlap<E extends GinkgoElement>(props?: E | E[] | string | null | undefined): void;
    componentReceiveProps(props: P, context?: {
        oldProps: P;
        type: "new" | "mounted";
    }): void;
}


/**TextComponent.d.ts**/
export declare class TextComponent extends GinkgoComponent {
    readonly text?: string | number;
    constructor(props?: GinkgoElement, text?: string | number);
}


/**Ginkgo.d.ts**/
declare type ElementType = keyof HTMLElementTagNameMap;
declare type ComponentType<P extends GinkgoElement, T extends GinkgoComponent<P>> = (new (props: P) => T);
declare type refObjectCall<C extends GinkgoComponent = any> = (instance: C) => void;
export declare type Bind = BindComponent;
export declare type Request = GinkgoHttpRequest;
export declare type GinkgoNode = GinkgoElement | string | undefined | null;
export interface GinkgoElement<C extends GinkgoComponent = any> {
    key?: string | number;
    readonly module?: ComponentType<any, any> | ElementType | Function | string;
    children?: Array<GinkgoElement>;
    ref?: refObjectCall | string | RefObject<C>;
    part?: string;
}
export interface RefObject<C extends GinkgoComponent> {
    instance?: C;
}
export declare class QueryObject<C extends GinkgoComponent> {
    private selector;
    private component;
    constructor(component: GinkgoComponent, selector: Array<any>);
    get instance(): C;
}
export default class Ginkgo {
    static Component: typeof GinkgoComponent;
    static Fragment: typeof FragmentComponent;
    static TakeParts: Array<string>;
    private static isWarn;
    static createElement<P extends GinkgoElement, T extends GinkgoComponent<P>>(tag: ComponentType<P, T> | ElementType | Function | string, attrs: {
        [key: string]: any;
    }, ...children: Array<GinkgoElement>): GinkgoElement;
    private static checkTakeParts;
    static createRef<C extends GinkgoComponent>(): RefObject<C>;
    static createQuery<C extends GinkgoComponent>(component: GinkgoComponent, ...selector: any): QueryObject<C>;
    static render<C extends GinkgoComponent, P extends GinkgoElement>(element: GinkgoElement, renderTo: Element): {
        component: C;
        props: P;
    };
    static getComponentStatus(component: GinkgoComponent): string;
    static getComponentByProps(props: GinkgoElement): GinkgoComponent;
    static getComponentByDom(dom: Node): GinkgoComponent;
    static unmount(renderTo: Element): void;
    static unmountByComponent(component: GinkgoComponent): void;
    static unmountByElement(element: GinkgoElement, renderTo: Element): void;
    static forEachChildren(fn: (component: GinkgoComponent) => boolean | any, component: GinkgoComponent, breakComponent?: any): void;
    private static forEachChildrenByLink;
    static instanceofComponent(props: GinkgoElement, fn: any): boolean;
    static get(url: string, data?: {
        [key: string]: any;
    } | FormData, config?: HttpConfig): Promise<any>;
    static post(url: string, data?: DataType, config?: HttpConfig): Promise<any>;
    static ajax(config: HttpConfig): Promise<any>;
}

declare namespace JSX {
    interface ElementClass extends GinkgoComponent<any> {
        render(): GinkgoElement | undefined | null;
    }

    interface IntrinsicElements {
        a: HTMLAnchorAttributes;
        abbr: HTMLAttributes;
        address: HTMLAttributes;
        applet: HTMLAttributes;
        area: HTMLAreaAttributes;
        article: HTMLAttributes;
        aside: HTMLAttributes;
        audio: HTMLAudioAttributes;
        b: HTMLAttributes;
        base: HTMLBaseAttributes;
        basefont: HTMLAttributes;
        bdi: HTMLAttributes;
        bdo: HTMLAttributes;
        big: HTMLAttributes;
        blockquote: HTMLBlockquoteAttributes;
        body: HTMLAttributes;
        br: HTMLAttributes;
        button: HTMLButtonAttributes;
        canvas: HTMLCanvasAttributes;
        caption: HTMLAttributes;
        cite: HTMLAttributes;
        code: HTMLAttributes;
        col: HTMLColAttributes;
        colgroup: HTMLColgroupAttributes;
        data: HTMLDataAttributes;
        datalist: HTMLAttributes;
        dd: HTMLAttributes;
        del: HTMLDelAttributes;
        details: HTMLDetailsAttributes;
        dfn: HTMLAttributes;
        dialog: HTMLDialogAttributes;
        dir: HTMLAttributes;
        div: HTMLAttributes;
        dl: HTMLAttributes;
        dt: HTMLAttributes;
        em: HTMLAttributes;
        embed: HTMLEmbedAttributes;
        fieldset: HTMLFieldSetAttributes;
        figcaption: HTMLAttributes;
        figure: HTMLAttributes;
        font: HTMLAttributes;
        footer: HTMLAttributes;
        form: HTMLFormAttributes;
        frame: HTMLAttributes;
        frameset: HTMLAttributes;
        h1: HTMLAttributes;
        h2: HTMLAttributes;
        h3: HTMLAttributes;
        h4: HTMLAttributes;
        h5: HTMLAttributes;
        h6: HTMLAttributes;
        head: HTMLAttributes;
        header: HTMLAttributes;
        hgroup: HTMLAttributes;
        hr: HTMLAttributes;
        html: HTMLHtmlAttributes;
        i: HTMLAttributes;
        iframe: HTMLIFrameAttributes;
        img: HTMLImageAttributes;
        input: HTMLInputAttributes;
        ins: HTMLInsAttributes;
        kbd: HTMLAttributes;
        keygen: HTMLKeygenAttributes,
        label: HTMLLabelAttributes;
        legend: HTMLAttributes;
        li: HTMLLIAttributes;
        link: HTMLLinkAttributes;
        main: HTMLAttributes;
        map: HTMLMapAttributes;
        mark: HTMLAttributes;
        menu: HTMLMenuAttributes;
        menuitem: HTMLAttributes;
        meta: HTMLMetaAttributes;
        meter: HTMLMeterAttributes;
        nav: HTMLAttributes;
        noindex: HTMLAttributes;
        noscript: HTMLAttributes;
        object: HTMLObjectAttributes;
        ol: HTMLOlAttributes;
        optgroup: HTMLOptgroupAttributes;
        option: HTMLOptionAttributes;
        output: HTMLOutputAttributes;
        p: HTMLAttributes;
        param: HTMLParamAttributes;
        picture: HTMLAttributes;
        pre: HTMLAttributes;
        progress: HTMLProgressAttributes;
        q: HTMLQuoteAttributes;
        rp: HTMLAttributes;
        rt: HTMLAttributes;
        ruby: HTMLAttributes;
        s: HTMLAttributes;
        samp: HTMLAttributes;
        script: HTMLScriptAttributes;
        section: HTMLAttributes;
        select: HTMLSelectAttributes;
        small: HTMLAttributes;
        source: HTMLSourceAttributes;
        span: HTMLAttributes;
        strong: HTMLAttributes;
        style: HTMLStyleAttributes;
        sub: HTMLAttributes;
        summary: HTMLAttributes;
        sup: HTMLAttributes;
        table: HTMLTableAttributes;
        tbody: HTMLAttributes;
        td: HTMLTdAttributes;
        template: HTMLAttributes;
        textarea: HTMLTextareaAttributes;
        tfoot: HTMLAttributes;
        th: HTMLThAttributes;
        thead: HTMLAttributes;
        time: HTMLTimeAttributes;
        title: HTMLAttributes;
        tr: HTMLAttributes;
        track: HTMLTrackAttributes;
        u: HTMLAttributes;
        ul: HTMLAttributes;
        var: HTMLAttributes;
        video: HTMLVideoAttributes;
        wbr: HTMLAttributes;
        webview: HTMLWebViewAttributes;


        bind: BindComponentElement;

        [elemName: string]: any;
    }
}
