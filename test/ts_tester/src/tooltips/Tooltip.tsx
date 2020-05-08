import Ginkgo, {
    GinkgoComponent,
    GinkgoElement,
    GinkgoNode,
    GinkgoTools,
    HTMLComponent,
    RefObject
} from "../../carbon/Ginkgo";
import "./Tooltip.scss";
import Component, {ComponentProps} from "../component/Component";

export interface TooltipProps extends ComponentProps {
    align?: "bottom" | "left" | "top" | "right";
    alignAdjust?: number;
    x?: number;
    y?: number;
    targetWidth?: number;
    targetHeight?: number;
    indicator?: boolean;
    // 固定位置 | 鼠标位置 | 跟随鼠标
    position?: "fix" | "mouse";// | "follow";
}

let showingTooltips: Array<{
    el?: HTMLElement | Component<any> | HTMLComponent,
    props: GinkgoElement,
    manager: TooltipManager
}> = [];

export class TooltipManager {
    private info: { component: GinkgoComponent, props: GinkgoElement };

    constructor(info: { component: GinkgoComponent; props: GinkgoElement }) {
        this.info = info;
    }

    updateProps(props: TooltipProps) {
        if (this.info && this.info.component) {
            this.info.component.update(props);
        }
    }

    get component() {
        if (this.info) {
            return this.info.component;
        }
        return null;
    }

    close() {
        Ginkgo.unmountByElement(this.info.props, document.body);
        showingTooltips = showingTooltips.filter(value => value.manager != this);
    }
}

export default class Tooltip<P extends TooltipProps> extends Component<P> {
    protected static tooltipsCls;
    protected static tooltipsDefaultCls;
    protected static tooltipsAnchorCls;
    protected static tooltipsAnchorHideCls;
    protected static tooltipsAnchorBottomCls;
    protected static tooltipsAnchorLeftCls;
    protected static tooltipsAnchorTopCls;
    protected static tooltipsAnchorRightCls;

    protected authorRef: RefObject<HTMLComponent> = Ginkgo.createRef();

    public static show(props: TooltipProps, el: HTMLElement | Component<any> | HTMLComponent): TooltipManager {
        let has = showingTooltips.filter(value => value.el == el);
        if (!has || has.length == 0) {
            if (props.position != "mouse") {
                let bounds;
                if (el instanceof Component) {
                    bounds = el.getBounds();
                } else if (el instanceof HTMLComponent) {
                    bounds = GinkgoTools.getBounds(el.dom as HTMLElement);
                } else {
                    bounds = GinkgoTools.getBounds(el);
                }
                if (bounds) {
                    props["x"] = bounds.x;
                    props["y"] = bounds.y;
                    props["targetWidth"] = bounds.w;
                    props["targetHeight"] = bounds.h;
                }
            }
            let info = Ginkgo.render(props, document.body);
            let manager = new TooltipManager(info);
            showingTooltips.push({el, props, manager});
            return manager;
        }
    }

    public static showTooltips(props: GinkgoElement) {
        let has = showingTooltips.filter(value => value.props == props);
        if (!has || has.length == 0) {
            let info = Ginkgo.render(props, document.body);
            let manager = new TooltipManager(info);
            showingTooltips.push({props, manager});
            return manager;
        }
    }

    public static close(manager: TooltipManager) {
        if (manager) manager.close();
    }

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        Tooltip.tooltipsCls = this.getThemeClass("tooltips");
        Tooltip.tooltipsDefaultCls = this.getThemeClass("tooltips-default");
        Tooltip.tooltipsAnchorCls = this.getThemeClass("tooltips-anchor");
        Tooltip.tooltipsAnchorHideCls = this.getThemeClass("tooltips-anchor-hide");
        Tooltip.tooltipsAnchorBottomCls = this.getThemeClass("align-bottom");
        Tooltip.tooltipsAnchorLeftCls = this.getThemeClass("align-left");
        Tooltip.tooltipsAnchorTopCls = this.getThemeClass("align-top");
        Tooltip.tooltipsAnchorRightCls = this.getThemeClass("align-right");
    }

    protected drawing(): GinkgoNode | GinkgoElement[] {
        let cls = [Tooltip.tooltipsAnchorCls];
        if (this.props.align == "top") {
            cls.push(Tooltip.tooltipsAnchorTopCls);
        } else if (this.props.align == "left") {
            cls.push(Tooltip.tooltipsAnchorLeftCls);
        } else if (this.props.align == "right") {
            cls.push(Tooltip.tooltipsAnchorRightCls);
        } else {
            cls.push(Tooltip.tooltipsAnchorBottomCls);
        }

        let list = [];
        if (this.props && this.props.children) {
            list = [...this.props.children];
        }

        if (!this.props.indicator) {
            cls.push(Tooltip.tooltipsAnchorHideCls);
        }

        list.push(<div ref={this.authorRef} className={cls}></div>);
        return list;
    }

    protected onAfterDrawing() {
        this.updatePosition();
    }

    protected compareAfterUpdate(props: P, oldProps: P): boolean {
        if (props && oldProps) {
            let hasOtherProps = false;
            for (let p in props) {
                if (props[p] != oldProps[p] && p != 'x' && p != 'y') {
                    hasOtherProps = true;
                }
            }
            if (!hasOtherProps) {
                this.updatePosition();
                return true;
            }
        }
        return false;
    }

    updatePosition() {
        if (this.rootEl && this.authorRef && this.authorRef.instance) {
            let authorDom = this.authorRef.instance.dom as HTMLElement;
            let rootDom = this.rootEl.dom as HTMLElement;
            let alignAdjust = this.props.alignAdjust || 0;

            let x = this.props.x;
            let y = this.props.y;
            let targetWidth = this.props.targetWidth || 0;
            let targetHeight = this.props.targetHeight || 0;

            if (authorDom && rootDom) {
                rootDom.style.left = "0px";
                rootDom.style.top = "0px";
                let w1 = authorDom.offsetWidth;
                let w2 = rootDom.offsetWidth;
                let h1 = authorDom.offsetHeight;
                let h2 = rootDom.offsetHeight;
                let position = this.props.position || "fix";

                if (this.props.align == "top") {
                    let left = (w2 - w1) / 2 + alignAdjust;
                    authorDom.style.left = left + "px";

                    if (position == "fix") {
                        rootDom.style.left = x + (targetWidth / 2 - left) - w1 / 2 + "px";
                        rootDom.style.top = y - targetHeight - w1 / 2 + "px";
                    } else if (position == "mouse") {
                        rootDom.style.left = x + 20 + "px";
                        rootDom.style.top = y + 20 + "px";
                    }

                } else if (this.props.align == "left") {
                    let top = (h2 - h1) / 2 + alignAdjust;
                    authorDom.style.top = top + "px";

                    if (position == "fix") {
                        rootDom.style.left = x - w2 - w1 + "px";
                        rootDom.style.top = y + (targetHeight / 2 - top) - h1 / 2 + "px";
                    } else if (position == "mouse") {
                        rootDom.style.left = x + 20 + "px";
                        rootDom.style.top = y + 20 + "px";
                    }

                } else if (this.props.align == "right") {
                    let top = (h2 - h1) / 2 + alignAdjust;
                    authorDom.style.top = top + "px";

                    if (position == "fix") {
                        rootDom.style.left = x + targetWidth + w1 + "px";
                        rootDom.style.top = y + (targetHeight / 2 - top) - h1 / 2 + "px";
                    } else if (position == "mouse") {
                        rootDom.style.left = x + 20 + "px";
                        rootDom.style.top = y + 20 + "px";
                    }

                } else {
                    let left = (w2 - w1) / 2 + alignAdjust;
                    authorDom.style.left = left + "px";

                    if (position == "fix") {
                        rootDom.style.left = x + (targetWidth / 2 - left) - w1 / 2 + "px";
                        rootDom.style.top = y + targetHeight + w1 / 2 + "px";
                    } else if (position == "mouse") {
                        rootDom.style.left = x + 20 + "px";
                        rootDom.style.top = y + 20 + "px";
                    }
                }
            }
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(Tooltip.tooltipsCls);
        if (!this.props.className) {
            arr.push(Tooltip.tooltipsDefaultCls);
        }
        return arr;
    }
}
