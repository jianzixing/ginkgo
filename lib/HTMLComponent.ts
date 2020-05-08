import {GinkgoComponent} from "./GinkgoComponent";
import {GinkgoElement} from "./Ginkgo";
import {CSSProperties} from "./CSSProperties";
import GinkgoAnimation, {AnimationParams} from "./GinkgoAnimation";

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

const Exclude2PxName = ["zIndex"];

export class HTMLComponent<P extends HTMLAttributes = any> extends GinkgoComponent<P> {
    protected readonly holder: { dom: Element };
    private componentEventCaches?: { [key: string]: EventHandler };

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

            for (let key in props) {
                if (key != "module"
                    && key != "children"
                    && key != "ref"
                    && key != "setInnerHTML") {

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
                    if (props.className) {
                        if (props.className instanceof Array) {
                            dom.className = props.className.join(" ");
                        } else if (typeof props.className == "function") {
                            let cls = props.className();
                            if (cls) {
                                if (cls instanceof Array) {
                                    dom.className = cls.join(" ");
                                } else {
                                    dom.className = cls;
                                }
                            }
                        } else {
                            dom.className = props.className;
                        }
                    }

                    if (key != "style" && key != "className") {
                        let p: any = props;
                        if (this.isEventProps(props, key)) {
                            this.bindDomEvent(props, key);
                        } else {
                            if (key == "value") {
                                dom['value'] = p[key];
                            }
                            dom.setAttribute(key.toLowerCase(), p[key]);
                        }
                    }
                } else if (key == "setInnerHTML") {
                    let html = props[key];
                    if (typeof html === "string") {
                        dom.innerHTML = html;
                    }
                }
            }
        }
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

    clearDomEvents() {
        if (this.componentEventCaches) {
            if (this.holder && this.holder.dom) {
                let dom = this.holder.dom;
                for (let key in this.componentEventCaches) {
                    let cacheEvent: EventHandler = this.componentEventCaches[key];
                    if (cacheEvent) {
                        let eventName = key.toLowerCase().substring(2);
                        dom.removeEventListener(eventName, cacheEvent, false);
                    }
                }
            }
            this.componentEventCaches = {};
        }
    }

    bindDomEvents() {
        let props = this.props;
        this.clearDomEvents();
        if (props && this.holder && this.holder.dom) {
            for (let key in props) {
                if (key != "module"
                    && key != "children"
                    && key != "ref"
                    && key != "setInnerHTML") {

                    if (this.isEventProps(props, key)) {
                        this.bindDomEvent(props, key);
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
}
