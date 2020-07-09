import {GinkgoComponent} from "./GinkgoComponent";
import {GinkgoElement} from "./Ginkgo";
import {CSSProperties} from "./CSSProperties";
import {GinkgoAnimation, AnimationParams} from "./GinkgoAnimation";

export type EventHandler = (e: Event) => void;

interface DOMAttributes {
    // Clipboard Events
    onCopy?: EventHandler;
    onCopyCapture?: EventHandler;
    onCut?: EventHandler;
    onCutCapture?: EventHandler;
    onPaste?: EventHandler;
    onPasteCapture?: EventHandler;

    // Composition Events
    onCompositionEnd?: EventHandler;
    onCompositionEndCapture?: EventHandler;
    onCompositionStart?: EventHandler;
    onCompositionStartCapture?: EventHandler;
    onCompositionUpdate?: EventHandler;
    onCompositionUpdateCapture?: EventHandler;

    // Focus Events
    onFocus?: EventHandler;
    onFocusCapture?: EventHandler;
    onBlur?: EventHandler;
    onBlurCapture?: EventHandler;

    // Form Events
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

    // Image Events
    onLoad?: EventHandler;
    onLoadCapture?: EventHandler;
    onError?: EventHandler; // also a Media Event
    onErrorCapture?: EventHandler; // also a Media Event

    // Keyboard Events
    onKeyDown?: EventHandler;
    onKeyDownCapture?: EventHandler;
    onKeyPress?: EventHandler;
    onKeyPressCapture?: EventHandler;
    onKeyUp?: EventHandler;
    onKeyUpCapture?: EventHandler;

    // Media Events
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

    // MouseEvents
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

    // Selection Events
    onSelect?: EventHandler;
    onSelectCapture?: EventHandler;

    // Touch Events
    onTouchCancel?: EventHandler;
    onTouchCancelCapture?: EventHandler;
    onTouchEnd?: EventHandler;
    onTouchEndCapture?: EventHandler;
    onTouchMove?: EventHandler;
    onTouchMoveCapture?: EventHandler;
    onTouchStart?: EventHandler;
    onTouchStartCapture?: EventHandler;

    // Pointer Events
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

    // UI Events
    onScroll?: EventHandler;
    onScrollCapture?: EventHandler;

    // Wheel Events
    onWheel?: EventHandler;
    onWheelCapture?: EventHandler;

    // Animation Events
    onAnimationStart?: EventHandler;
    onAnimationStartCapture?: EventHandler;
    onAnimationEnd?: EventHandler;
    onAnimationEndCapture?: EventHandler;
    onAnimationIteration?: EventHandler;
    onAnimationIterationCapture?: EventHandler;

    // Transition Events
    onTransitionEnd?: EventHandler;
    onTransitionEndCapture?: EventHandler;
}

export interface HTMLAttributes extends GinkgoElement, DOMAttributes {
    // Standard HTML Attributes
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

const Exclude2PxName = [
    "zIndex",
    "fontWeight",
    "opacity",
    "fontSizeAdjust"
];

const NonAttrName = [
    "module",
    "children",
    "ref",
    "setInnerHTML",
    "key",
    "style",
    "className",
    "part"
]

export class HTMLComponent<P extends HTMLAttributes = any> extends GinkgoComponent<P> {
    protected readonly holder: { dom: Element };
    private componentEventCaches?: { [key: string]: EventHandler };
    private bindEventCaches?: { [key: string]: EventHandler[] };
    private componentClassNameCaches;

    constructor(props?: P, holder?: { dom: Element }) {
        super(props);
        this.holder = holder;
    }

    get dom(): Element {
        return this.holder ? this.holder.dom : undefined;
    }

    animation(param: AnimationParams) {
        if (this.holder && this.holder.dom) {
            let wrapParam: any = param;
            wrapParam['targets'] = this.holder.dom;
            return GinkgoAnimation(param);
        }
    }

    componentReceiveProps(props: P, context?: { oldProps: P, type: "new" | "mounted" }): void {
        if (props && this.holder && this.holder.dom) {
            let dom = this.holder.dom;

            let style = props.style, oldStyle = context && context.oldProps ? context.oldProps.style : null;
            this.clearNullDomStyle(dom, style, oldStyle);

            let compare = this.comparePropsVersion(context.oldProps, props);
            if (compare.setStyle) {
                // 替换旧的style
                if (props.style && dom instanceof HTMLElement) {
                    let style: any = props.style;
                    if (typeof style == "function") {
                        style = style();
                    }
                    for (let key in style) {
                        let value = style[key];
                        if (typeof value == "number" && Exclude2PxName.indexOf(key) === -1) {
                            value = value + "px";
                        }
                        (<any>dom.style)[key] = value;
                    }
                }
            }
            if (compare.setClassName) {
                // 重新设置css
                if (compare.classNames) {
                    dom.className = compare.classNames;
                } else {
                    dom.removeAttribute("class");
                }
                this.componentClassNameCaches = compare.classNames;
            }

            if (compare.setEvents) {
                // 替换或者新增事件
                let events = [];
                for (let key in props) {
                    if (NonAttrName.indexOf(key) == -1) {
                        if (this.isEventProps(props, key)) {
                            this.bindDomEvent(props, key);
                            events.push(key);
                        }
                    }
                }

                // 移除已经为空的事件
                while (true) {
                    let next = false;
                    for (let eventName in this.componentEventCaches) {
                        if (events.indexOf(eventName) == -1) {
                            let evt = this.componentEventCaches[eventName];
                            if (evt) {
                                let en = eventName.toLowerCase().substring(2);
                                dom.removeEventListener(en, evt);
                            }
                            this.componentEventCaches[eventName] = undefined;
                            delete this.componentEventCaches[eventName];
                            next = true;
                            break;
                        }
                    }
                    if (!next) break;
                }
            }

            if (compare.setAttrs) {
                // 替换或者新增属性值
                for (let key in props) {
                    if (NonAttrName.indexOf(key) == -1) {
                        if (!this.isEventProps(props, key)) {
                            if (key == "value") {
                                dom['value'] = props[key];
                            }
                            if (key == "src"
                                && props.module == "img"
                                && props['src'] == dom.getAttribute("src")) {
                            } else {
                                dom.setAttribute(key.toLowerCase(), (props as any)[key]);
                            }
                        }
                    }
                }

                // 移除设置为空的属性值
                if (context.oldProps) {
                    for (let k2 in context.oldProps) {
                        if (NonAttrName.indexOf(k2) == -1) {
                            if (!this.isEventProps(context.oldProps, k2) && props[k2] == null) {
                                dom.removeAttribute(k2.toLowerCase());
                            }
                        }
                    }
                }
            }

            if (props["setInnerHTML"]) {
                let html = props["setInnerHTML"];
                if (typeof html === "string") {
                    dom.innerHTML = html;
                }
            }
        }
    }

    private comparePropsVersion(oldProps, newProps):
        {
            setStyle: boolean,
            styles: { [key: string]: any },
            setClassName: boolean,
            classNames: string,
            setEvents: boolean,
            setAttrs: boolean
        } {

        let change: any = {};
        if (oldProps == null && newProps != null) {
            return {
                setStyle: true,
                styles: newProps.style,
                setClassName: true,
                classNames: this.getFinalClassName(newProps),
                setEvents: true,
                setAttrs: true
            }
        }

        let oldStyle = oldProps.style;
        let style = newProps.style;
        if (typeof style == "function") {
            change.setStyle = style != oldStyle;
        } else {
            let r1 = this.isSameObject(oldStyle, style);
            change.setStyle = !r1;
        }
        change.styles = style;

        let oldClassName = this.componentClassNameCaches;
        let newClassName = this.getFinalClassName(newProps);
        let r2 = this.isSameClassName(oldClassName, newClassName);
        change.setClassName = !r2;
        change.classNames = newClassName;

        let r3 = true;
        let r4 = true;
        for (let key in newProps) {
            if (NonAttrName.indexOf(key) == -1) {
                if (this.isEventProps(newProps, key)) {
                    if (r3 == true) {
                        let evt = this.componentEventCaches ? this.componentEventCaches[key] : undefined;
                        if (evt != newProps[key]) r3 = false;
                    }
                } else {
                    if (r4 == true) {
                        if (newProps[key] != oldProps[key]) r4 = false;
                    }
                }
            }
        }

        if (r3 == true && this.componentEventCaches) {
            for (let cache in this.componentEventCaches) {
                if (this.componentEventCaches[cache] != newProps[cache]) {
                    r3 = false;
                    break;
                }
            }
        }
        change.setEvents = !r3;

        if (r4 == true) {
            for (let key in oldProps) {
                if (NonAttrName.indexOf(key) == -1) {
                    if (!this.isEventProps(oldProps, key)) {
                        if (newProps[key] != oldProps[key]) {
                            r4 = false;
                            break;
                        }
                    }
                }
            }
        }
        change.setAttrs = !r4;

        return change;
    }

    private getFinalClassName(props) {
        let classNames;
        if (props.className instanceof Array) {
            classNames = props.className.join(" ");
        } else if (typeof props.className == "function") {
            let cls = props.className();
            if (cls) {
                if (cls instanceof Array) {
                    classNames = cls.join(" ");
                } else {
                    classNames = cls;
                }
            }
        } else {
            classNames = props.className;
        }
        return classNames;
    }

    private isSameObject(obj1: Object, obj2: Object): boolean {
        if (obj1 == null && obj2 != null) return false;
        if (obj2 == null && obj1 != null) return false;
        if (obj1 == null && obj2 == null) return true;

        for (let key in obj1) {
            if (obj2[key] != obj1[key]) return false;
        }
        for (let key in obj2) {
            if (obj2[key] != obj1[key]) return false;
        }

        return true;
    }

    private isSameClassName(c1: string, c2: string): boolean {
        if (c1 == null && c2 != null) return false;
        if (c1 != null && c2 == null) return false;
        if (c1 == null && c2 == null) return true;

        let a1 = c1.split(" ");
        let a2 = c2.split(" ");
        if (a1.length != a2.length) return false;
        for (let i1 of a1) {
            let is = false;
            for (let i2 of a2) {
                if (i1.trim() == i2.trim()) {
                    is = true;
                    break;
                }
            }
            if (!is) return false;
        }
        return true;
    }

    private clearNullDomStyle(dom, style, oldStyle) {
        if (style != oldStyle) {
            if (oldStyle) {
                for (let os in oldStyle) {
                    if (style == undefined || style[os] == undefined) {
                        (<any>dom.style)[os] = null;
                    }
                }
            }
        }
    }

    private isEventProps(props: any, key: any): boolean {
        if (props
            && key
            && key != "style"
            && key != "className"
            && typeof props[key] == "function"
            && key.indexOf("on") >= 0) {
            return true;
        }
        return false;
    }


    private bindDomEvent(props: P, key: string) {
        let p: any = props;
        let callback = p[key];

        if (this.holder && this.holder.dom) {
            let dom = this.holder.dom;
            if (!this.componentEventCaches) this.componentEventCaches = {};
            let cacheEvent: EventHandler = this.componentEventCaches[key];

            if (cacheEvent != callback) {
                let eventName = key.toLowerCase().substring(2);
                if (cacheEvent) {
                    dom.removeEventListener(eventName, cacheEvent, false);
                }
                dom.addEventListener(eventName, callback, false);
                this.componentEventCaches[key] = callback;
            }
        }
    }

    reloadClassName() {
        let props = this.props;
        if (typeof props.className == "function" && this.dom) {
            let fn = props.className as Function;
            let cls = fn();
            if (cls) {
                if (cls instanceof Array) {
                    this.dom.className = cls.join(" ");
                } else {
                    this.dom.className = cls;
                }
            }
        }
    }

    reloadStyle() {
        let props = this.props;
        if (typeof props.style == "function" && this.dom instanceof HTMLElement) {
            let fn = props.style as Function;
            let cls = fn();
            if (cls) {
                for (let key in cls) {
                    let value = cls[key];
                    if (typeof value == "number" && Exclude2PxName.indexOf(key) === -1) {
                        value = value + "px";
                    }
                    this.dom.style[key] = value;
                }
            }
        }
    }

    reloadStyleSheets() {
        this.reloadClassName();
        this.reloadStyle();
    }

    get width(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.offsetWidth;
        }
        return 0;
    }

    get height(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.offsetHeight;
        }
        return 0;
    }

    get clientWidth(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.clientWidth;
        }
        return 0;
    }

    get clientHeight(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.clientHeight;
        }
        return 0;
    }

    get scrollWidth(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.scrollWidth;
        }
        return 0;
    }

    get scrollHeight(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.scrollHeight;
        }
        return 0;
    }

    get scrollLeft(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.scrollLeft;
        }
        return 0;
    }

    get scrollTop(): number {
        if (this.dom instanceof HTMLElement) {
            return this.dom.scrollTop;
        }
        return 0;
    }

    get style(): CSSStyleDeclaration {
        if (this.dom instanceof HTMLElement) {
            return this.dom.style;
        }
        return null
    }

    get className(): string {
        return this.dom.className;
    }

    set className(name: string) {
        if (this.dom) {
            this.dom.className = name;
        }
    }

    attribute(key?: string, value?: string): any {
        if (this.dom && key && value) {
            this.dom.setAttribute(key, value);
        }
        if (this.dom && key && !value) {
            return this.dom.getAttribute(key);
        }
        if (this.dom && !key && !value) {
            let names = this.dom.getAttributeNames();
            let obj = {};
            for (let k of names) {
                obj[k] = this.dom.getAttribute(k);
            }
            return obj;
        }
    }

    html(html?: string): string {
        if (this.dom && html) {
            this.dom.innerHTML = html;
        }
        if (this.dom && !html) {
            return this.dom.innerHTML;
        }
    }

    text(text?: string): string {
        if (this.dom && text) {
            if (typeof this.dom.textContent == "undefined") {
                (this.dom as any).innerText = text;
            } else {
                this.dom.textContent = text;
            }
        }
        if (this.dom && !text) {
            if (typeof this.dom.textContent == "undefined") {
                return (this.dom as any).innerText;
            } else {
                return this.dom.textContent;
            }
        }
    }

    bind(name: string, callback: any, options?: any): void {
        if (this.dom) {
            this.dom.addEventListener(name, callback, options);
            let events = this.bindEventCaches[name];
            if (!events) events = [];
            events.push(callback);
            this.bindEventCaches[name] = events;
        }
    }

    unbind(name: string, callback?: any, options?: any): void {
        if (this.dom) {
            if (name && callback) {
                this.dom.removeEventListener(name, callback, options);
                let events = this.bindEventCaches[name];
                if (events && events.indexOf(callback) >= 0) {
                    events.splice(events.indexOf(callback), 1);
                }
                if (events && events.length == 0) {
                    this.bindEventCaches[name] = undefined;
                } else {
                    this.bindEventCaches[name] = events;
                }
            }
            if (name && !callback) {
                let events = this.bindEventCaches[name];
                if (events) {
                    for (let e of events) {
                        this.dom.removeEventListener(name, e);
                    }
                    this.bindEventCaches[name] = undefined;
                }
            }
        }
    }
}
