import Ginkgo, {CSSProperties, GinkgoElement, HTMLComponent} from "../../carbon/Ginkgo";
import Panel, {PanelProps} from "../panel/Panel";
import Component, {ComponentProps} from "../component/Component";
import {IconTypes} from "../icon/IconTypes";
import "./Window.scss";
import WindowManager from "./WindowManager";
import Button from "../button/Button";

export class WindowWrapper {
    private wins: { component: Component<any>, props: WindowProps };

    constructor(wins?: { component: Component<any>; props: WindowProps }) {
        this.wins = wins;
    }

    close() {
        Ginkgo.unmountByElement(this.wins.props, document.body);
    }

    get component() {
        if (this.wins && this.wins.component) {
            return this.wins.component;
        }
    }
}

export interface WindowProps extends ComponentProps, PanelProps {
    width?: number;
    height?: number;
    restrict?: boolean;
    maskLayer?: boolean;
    resizable?: boolean;
    closable?: boolean;
    onWindowClose?: (e: Event) => void;
    x?: number;
    y?: number;
    zIndex?: number; // 1-99999
    floating?: boolean; // position = absolute
    center?: boolean;
    onMaskClick?: (e: Event) => void;
    closeOnMaskClick?: boolean;

    windowWrapper?: WindowWrapper;
}


export class WindowPanel<P extends WindowProps> extends Component<P> {
    protected static windowManager: WindowManager = new WindowManager();

    protected static windowCls;
    protected static windowClsMask;
    protected static windowClsGhost;

    protected static windowClsResize;
    protected static windowClsResizeProxy;
    protected static windowClsResizeWest;
    protected static windowClsResizeEast;
    protected static windowClsResizeSouth;
    protected static windowClsResizeNorth;

    protected static windowClsResizeNW;
    protected static windowClsResizeNE;
    protected static windowClsResizeSE;
    protected static windowClsResizeSW;

    protected resizeProxyEl: HTMLComponent;
    protected panelRef: Panel<PanelProps>;
    protected ghost = false;
    protected left?: number;
    protected top?: number;

    protected startX: number = 0;
    protected startY: number = 0;
    protected moveX: number = 0;
    protected moveY: number = 0;

    protected zIndex: number = this.props.zIndex;
    protected originalX: number = 0;
    protected originalY: number = 0;
    protected currentResizeType?: string;
    protected parentSize: { w: number, h: number } = {w: 0, h: 0};
    protected mask = this.props.mask;
    protected isAllowResizable = true;
    protected isShowHeader = true;

    defaultProps = {
        resizable: true
    };

    public static open(props: WindowProps) {
        let wrapper = new WindowWrapper();
        props.windowWrapper = wrapper;
        let result: { component: WindowPanel<any>, props: WindowProps } =
            Ginkgo.render(props, document.body);
        (wrapper as any).wins = result;
        return wrapper;
    }

    constructor(props: P) {
        super(props);
        this.onResizeMouseMove = this.onResizeMouseMove.bind(this);
        this.onResizeMouseUp = this.onResizeMouseUp.bind(this);
        this.onWindowMouseMove = this.onWindowMouseMove.bind(this);
        this.onWindowMouseUp = this.onWindowMouseUp.bind(this);
    }

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        WindowPanel.windowCls = this.getThemeClass("window");
        WindowPanel.windowClsMask = this.getThemeClass("window-mask");
        WindowPanel.windowClsGhost = this.getThemeClass("window-ghost");

        WindowPanel.windowClsResize = this.getThemeClass("resizable-handle");
        WindowPanel.windowClsResizeProxy = this.getThemeClass("resizable-handle-proxy");
        WindowPanel.windowClsResizeWest = this.getThemeClass("resizable-handle-west");
        WindowPanel.windowClsResizeEast = this.getThemeClass("resizable-handle-east");
        WindowPanel.windowClsResizeSouth = this.getThemeClass("resizable-handle-south");
        WindowPanel.windowClsResizeNorth = this.getThemeClass("resizable-handle-north");

        WindowPanel.windowClsResizeNW = this.getThemeClass("resizable-handle-northwest");
        WindowPanel.windowClsResizeNE = this.getThemeClass("resizable-handle-northeast");
        WindowPanel.windowClsResizeSE = this.getThemeClass("resizable-handle-southeast");
        WindowPanel.windowClsResizeSW = this.getThemeClass("resizable-handle-southwest");
    }

    protected drawing(): GinkgoElement | undefined | null {
        let width = this.width,
            height = this.height,
            resizableEls,
            resizableProxyEls,
            tools = [];


        if (this.props.resizable == true && this.isAllowResizable) {
            resizableEls = (
                <Ginkgo.Fragment>
                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeWest}
                        onMouseDown={e => this.onResizeMouseDown(e, "w")}
                    ></div>
                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeEast}
                        onMouseDown={e => this.onResizeMouseDown(e, "e")}
                    ></div>
                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeSouth}
                        onMouseDown={e => this.onResizeMouseDown(e, "s")}
                    ></div>
                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeNorth}
                        onMouseDown={e => this.onResizeMouseDown(e, "n")}
                    ></div>

                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeNW}
                        onMouseDown={e => this.onResizeMouseDown(e, "nw")}
                    ></div>
                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeNE}
                        onMouseDown={e => this.onResizeMouseDown(e, "ne")}
                    ></div>
                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeSE}
                        onMouseDown={e => this.onResizeMouseDown(e, "se")}
                    ></div>
                    <div
                        className={WindowPanel.windowClsResize + " " + WindowPanel.windowClsResizeSW}
                        onMouseDown={e => this.onResizeMouseDown(e, "sw")}
                    ></div>
                </Ginkgo.Fragment>
            );

            resizableProxyEls = (
                <div
                    ref={c => this.resizeProxyEl = c}
                    className={WindowPanel.windowClsResizeProxy}
                ></div>
            );
        }

        if (this.props.closable != false) {
            tools.push({
                iconType: IconTypes.close,
                onClick: (e: any) => {
                    this.closeWindow(e);
                }
            })
        }

        let children = this.drawingWindowChildren();

        return (
            <Ginkgo.Fragment>
                {resizableEls}
                <Panel
                    ref={(c: any) => this.panelRef = c}
                    border={this.props.border || true}
                    {...this.props}
                    header={this.isShowHeader == false ? false : true}
                    width={width}
                    height={height}
                    tools={tools}
                    onHeaderMouseDown={(e: any) => {
                        let rootEl = this.rootEl.dom as HTMLElement;
                        this.startX = e.clientX;
                        this.startY = e.clientY;
                        this.originalX = rootEl ? rootEl.offsetLeft : 0;
                        this.originalY = rootEl ? rootEl.offsetTop : 0;
                        this.parentSize = this.getParentSize();

                        document.documentElement.addEventListener("mousemove", this.onWindowMouseMove, false);
                        document.documentElement.addEventListener("mouseup", this.onWindowMouseUp, false);

                        WindowPanel.windowManager.activeWindow(this);

                        if (this.props && this.props.onHeaderMouseDown) {
                            this.props.onHeaderMouseDown(e);
                        }
                    }}
                    onHeaderMouseMove={(e: any) => {
                        if (this.props && this.props.onHeaderMouseMove) {
                            this.props.onHeaderMouseMove(e);
                        }
                    }}
                    onHeaderMouseUp={(e: any) => {
                        if (this.props && this.props.onHeaderMouseUp) {
                            this.props.onHeaderMouseUp(e);
                        }
                    }}

                    onMouseDown={e => {
                        WindowPanel.windowManager.activeWindow(this);
                    }}
                >
                    {children}
                </Panel>
                {resizableProxyEls}
            </Ginkgo.Fragment>
        );
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();

        if (this.panelRef) {
            Ginkgo.forEachContent(component => {
                if (component instanceof Button && component.props.type == "close") {
                    component.setTypeEvent((e) => {
                        this.closeWindow(e);
                    });
                }
            }, this.panelRef);
        }
    }

    protected closeWindow(e) {
        if (this.props.windowWrapper) {
            this.props.windowWrapper.close();
        }
        this.props && this.props.onWindowClose && this.props.onWindowClose(e);
    }

    protected drawingWindowChildren(): GinkgoElement | GinkgoElement[] {
        return this.props.children;
    }

    protected onResizeMouseDown(e: any, type: string) {
        let width = this.width,
            height = this.height;

        WindowPanel.windowManager.activeWindow(this);

        this.parentSize = this.getParentSize();

        if (this.props.resizable == true) {
            this.currentResizeType = type;
            this.startX = e.clientX;
            this.startY = e.clientY;

            if (this.resizeProxyEl && this.resizeProxyEl.dom) {
                let rp = this.resizeProxyEl.dom as HTMLElement;
                rp.style.width = width + "px";
                rp.style.height = height + "px";
                rp.style.left = 0 + "px";
                rp.style.top = 0 + "px";
            }

            document.documentElement.addEventListener("mousemove", this.onResizeMouseMove, false);
            document.documentElement.addEventListener("mouseup", this.onResizeMouseUp, false);
        }
    }

    protected onResizeMouseMove(e: any) {
        let width = this.width || 0,
            height = this.height || 0,
            left = this.left || this.getX(),
            top = this.top || this.getY();

        let moveX = e.clientX, moveY = e.clientY,
            x = this.startX - moveX, y = this.startY - moveY;

        this.moveX = moveX;
        this.moveY = moveY;

        if (this.resizeProxyEl && this.resizeProxyEl.dom) {
            let rp = this.resizeProxyEl.dom as HTMLElement;
            rp.style.display = "block";

            if (this.props.restrict == true) {
                let gout = false,
                    newHeight = 0,
                    newWidth = 0,
                    newX = 0,
                    newY = 0;
                if (this.currentResizeType == "n"
                    || this.currentResizeType == "nw"
                    || this.currentResizeType == "ne") {
                    newY = 0 - y;
                    newHeight = height + y;

                    if (top + newY < 0) {
                        rp.style.top = newY + "px";
                        rp.style.height = newHeight + "px";

                        gout = true;
                    }

                    if (newHeight <= 50) {
                        rp.style.top = (height - 50) + "px";
                        rp.style.height = 50 + "px";
                        this.moveY = this.startY + height - 50;

                        gout = true;
                    } else if (top + newY >= 0) {
                        rp.style.top = (0 - y) + "px";
                        rp.style.height = (height + y) + "px";
                    }
                }

                if (this.currentResizeType == "w"
                    || this.currentResizeType == "nw"
                    || this.currentResizeType == "sw") {
                    newX = 0 - x;
                    newWidth = width + x;
                    if (left + newX < 0) {
                        rp.style.left = newX + "px";
                        rp.style.width = newWidth + "px";

                        gout = true;
                    }

                    if (newWidth <= 50) {
                        rp.style.left = (width - 50) + "px";
                        rp.style.width = 50 + "px";
                        this.moveX = this.startX + width - 50;

                        gout = true;
                    } else if (left + newX >= 0) {
                        rp.style.left = (0 - x) + "px";
                        rp.style.width = (width + x) + "px";
                    }
                }

                if (this.currentResizeType == "s"
                    || this.currentResizeType == "sw"
                    || this.currentResizeType == "se") {
                    newHeight = height - y;
                    if (newHeight + top >= this.parentSize.h) {
                        rp.style.height = (this.parentSize.h - top) + "px";
                        this.moveY = this.startY + (this.parentSize.h - top - height);

                        gout = true;
                    }

                    if (newHeight <= 50) {
                        rp.style.height = 50 + "px";
                        this.moveY = this.startY - (height - 50);

                        gout = true;
                    } else if (newHeight + top < this.parentSize.h) {
                        rp.style.height = (height - y) + "px";
                    }
                }

                if (this.currentResizeType == "e"
                    || this.currentResizeType == "ne"
                    || this.currentResizeType == "se") {
                    newWidth = width - x;
                    if (newWidth + left >= this.parentSize.w) {
                        rp.style.width = (this.parentSize.w - left) + "px";
                        this.moveX = this.startX + (this.parentSize.w - left - width);

                        gout = true;
                    }

                    if (newWidth <= 50) {
                        rp.style.width = 50 + "px";
                        this.moveX = this.startX - (width - 50);

                        gout = true;
                    } else if (newWidth + left < this.parentSize.w) {
                        rp.style.width = (width - x) + "px";
                    }
                }

                if (gout) return;
            }

            if (this.currentResizeType == "n"
                || this.currentResizeType == "nw"
                || this.currentResizeType == "ne") {
                rp.style.top = (0 - y) + "px";
                rp.style.height = (height + y) + "px";
            }

            if (this.currentResizeType == "w"
                || this.currentResizeType == "nw"
                || this.currentResizeType == "sw") {
                rp.style.left = (0 - x) + "px";
                rp.style.width = (width + x) + "px";
            }

            if (this.currentResizeType == "s"
                || this.currentResizeType == "sw"
                || this.currentResizeType == "se") {
                rp.style.height = (height - y) + "px";
            }

            if (this.currentResizeType == "e"
                || this.currentResizeType == "ne"
                || this.currentResizeType == "se") {
                rp.style.width = (width - x) + "px";
            }
        }
    }

    protected onResizeMouseUp(e: any) {
        document.documentElement.removeEventListener("mousemove", this.onResizeMouseMove);
        document.documentElement.removeEventListener("mouseup", this.onResizeMouseUp);

        if (this.moveX > 0 && this.moveY > 0) {
            let width = this.getWidth(),
                height = this.getHeight(),
                left = this.left || this.getX(),
                top = this.top || this.getY();

            let x = this.startX - this.moveX, y = this.startY - this.moveY;

            if (this.currentResizeType == "n"
                || this.currentResizeType == "nw"
                || this.currentResizeType == "ne") {
                let ntop = top - y;
                let nheight = height + y;
                this.top = ntop;
                this.height = nheight;
                this.redrawing();
                // this.panelRef && this.panelRef.setHeaderDefaultAlign();
            }

            if (this.currentResizeType == "w"
                || this.currentResizeType == "nw"
                || this.currentResizeType == "sw") {
                let nleft = left - x;
                let nwidth = width + x;
                this.left = nleft;
                this.width = nwidth;
                this.redrawing();
                //this.panelRef &&  this.panelRef.setHeaderDefaultAlign();
            }

            if (this.currentResizeType == "s"
                || this.currentResizeType == "sw"
                || this.currentResizeType == "se") {
                let nheight = height - y;
                this.height = nheight;
                this.redrawing();
                // this.panelRef  && this.panelRef.setHeaderDefaultAlign();
            }

            if (this.currentResizeType == "e"
                || this.currentResizeType == "ne"
                || this.currentResizeType == "se") {
                let nwidth = width - x;
                this.width = nwidth;
                this.redrawing();
                // this.panelRef && this.panelRef.setHeaderDefaultAlign();
            }

        }

        if (this.resizeProxyEl && this.resizeProxyEl.dom) {
            let rp = this.resizeProxyEl.dom as HTMLElement;
            rp.style.display = "none";
        }

        this.startX = 0;
        this.startY = 0;
        this.originalX = 0;
        this.originalY = 0;
        this.moveX = 0;
        this.moveY = 0;
    }


    protected onWindowMouseUp(e: any) {
        document.documentElement.removeEventListener("mousemove", this.onWindowMouseMove);
        document.documentElement.removeEventListener("mouseup", this.onWindowMouseUp);

        if (this.moveX > 0 && this.moveY > 0) {
            let x = this.startX - this.moveX, y = this.startY - this.moveY,
                left = (this.originalX - x), top = (this.originalY - y);

            this.ghost = false;
            this.left = left;
            this.top = top;
            this.redrawing();
        }

        this.startX = 0;
        this.startY = 0;
        this.originalX = 0;
        this.originalY = 0;
        this.moveX = 0;
        this.moveY = 0;
    }

    protected onWindowMouseMove(e: any) {
        let moveX = e.clientX, moveY = e.clientY,
            x = this.startX - moveX, y = this.startY - moveY,
            left = this.originalX - x, top = this.originalY - y,
            width = this.width || 0, height = this.height || 0;

        if (this.props.restrict == true) {
            let gout: boolean = false;
            if (left < 0) {
                this.moveX = this.startX - this.originalX;
                this.setWindowPosition(0);
                gout = true;
            } else {
                this.moveX = moveX;
                this.setWindowPosition(left);
            }

            if (top < 0) {
                this.moveY = this.startY - this.originalY;
                this.setWindowPosition(undefined, 0);
                gout = true;
            } else {
                this.moveY = moveY;
                this.setWindowPosition(undefined, top);
            }

            if (left + width > this.parentSize.w) {
                this.moveX = this.startX + (this.parentSize.w - this.originalX - width);
                this.setWindowPosition(this.parentSize.w - width);
                gout = true;
            }

            if (top + height > this.parentSize.h) {
                this.moveY = this.startY + (this.parentSize.h - this.originalY - height);
                this.setWindowPosition(undefined, this.parentSize.h - height);
                gout = true;
            }

            if (gout) return;
        }

        this.moveX = moveX;
        this.moveY = moveY;
        this.setWindowPosition(left, top);
        if (this.ghost != true) {
            this.ghost = true;
            this.redrawing();
        }
    }

    protected setWindowPosition(x?: number, y?: number) {
        if (this.rootEl && this.rootEl.dom) {
            let dom = this.rootEl.dom as HTMLElement;
            if (x != undefined) dom.style.left = x + "px";
            if (y != undefined) dom.style.top = y + "px";
        }
    }

    protected getParentSize() {
        let rootEl = this.rootEl.dom as HTMLElement;
        if (rootEl) {
            let parent: Element | null;
            if (this.props.floating == false) {
                parent = rootEl.parentElement;
            } else {
                parent = rootEl.offsetParent;
            }
            if (parent) {
                let el = parent as HTMLElement;
                return {w: el.offsetWidth, h: el.offsetHeight};
            }
        }
        return {w: 0, h: 0};
    }

    componentDidMount(): void {
        super.componentDidMount();

        WindowPanel.windowManager.addWindow(this);
        WindowPanel.windowManager.activeWindow(this);
    }

    componentWillUnmount(): void {
        super.componentWillUnmount();
        WindowPanel.windowManager.removeWindow(this);
    }

    setZIndex(zIndex: number) {
        this.zIndex = zIndex;
        if (this.rootEl) this.rootEl.reloadStyle();
    }

    getParentElement(): HTMLElement {
        if (this.rootEl && this.rootEl.dom) {
            return this.rootEl.dom.parentElement;
        }
    }

    isMask(): boolean {
        return this.props.maskLayer != false;
    }

    getMaskClassNames(): string {
        return WindowPanel.windowClsMask;
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(WindowPanel.windowCls);
        if (this.ghost == true) {
            arr.push(WindowPanel.windowClsGhost);
        }
        return arr;
    }

    protected getRootStyle(notDefaultSize?: boolean): CSSProperties {
        let style = super.getRootStyle();
        style.zIndex = this.zIndex;
        if (this.props.floating == false) {
            style.position = "relative";
        } else {
            style.position = "absolute";
        }

        if (this.left != undefined || this.top != undefined) {
            if (this.left != undefined && this.left >= 0) style.left = this.left;
            if (this.top != undefined && this.top >= 0) style.top = this.top;
        }

        if (!notDefaultSize) {
            if (this.width == null) {
                style.width = 350;
            }
            if (this.height == null) {
                style.height = 280;
            }
        }

        let dom = this.rootEl.dom as HTMLElement;
        let parent = dom.parentElement;
        if (this.left == undefined) {
            style.left = (parent.offsetWidth - dom.offsetWidth) / 2 + "px";
        }
        if (this.top == undefined) {
            style.top = (parent.offsetHeight - dom.offsetHeight) / 2 + "px";
        }

        return style;
    }
}
