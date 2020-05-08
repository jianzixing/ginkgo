import Ginkgo, {CSSProperties, GinkgoComponent, GinkgoElement, GinkgoNode, HTMLComponent} from "../../carbon/Ginkgo";
import "./Toolbar.scss";
import Component, {ComponentProps} from "../component/Component";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";

export interface ToolbarProps extends ComponentProps {
    border?: boolean | 'top' | 'left' | 'bottom' | 'right';
    direction?: 'vertical' | 'horizontal';
    scroller?: boolean;

    // 位于父组件的什么位置(父组件必须支持才行)
    align?: "top" | "bottom";
}

export default class Toolbar<P extends ToolbarProps> extends Component<P> {
    protected static toolbarCls;
    protected static toolbarBorderCls;
    protected static toolbarBorderTCls;
    protected static toolbarBorderLCls;
    protected static toolbarBorderRCls;
    protected static toolbarBorderBCls;
    protected static toolbarClsScroller;
    protected static toolbarClsScrollerBody;
    protected static toolbarClsScrollerDisabled;
    protected static toolbarClsV;
    protected static toolbarClsBorder;
    protected static toolbarClsBorderTop;
    protected static toolbarClsBorderLeft;
    protected static toolbarClsBorderBottom;
    protected static toolbarClsBorderRight;

    protected static toolbarClsInner;
    protected static toolbarClsInnerVertical;
    protected static toolbarClsBody;

    protected static toolbarClsBodyContainer;
    protected static toolbarClsBodySplit;

    protected defaultSplitWidth = 10;
    protected toolbarInnerEl: HTMLComponent;
    protected toolbarScrollerEl: HTMLComponent;
    protected toolbarScrollerBodyEl: HTMLComponent;
    protected bodyStyle?: CSSProperties;
    protected scrollerShow?: boolean;
    protected scrollerLeftDisabled?: boolean = true;
    protected scrollerRightDisabled?: boolean;
    protected positionChildren = {left: [], center: [], right: []};

    defaultProps = {
        scroller: true
    };

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        Toolbar.toolbarCls = this.getThemeClass("toolbar");
        Toolbar.toolbarBorderCls = this.getThemeClass("toolbar-border");
        Toolbar.toolbarBorderTCls = this.getThemeClass("toolbar-border-top");
        Toolbar.toolbarBorderLCls = this.getThemeClass("toolbar-border-left");
        Toolbar.toolbarBorderRCls = this.getThemeClass("toolbar-border-right");
        Toolbar.toolbarBorderBCls = this.getThemeClass("toolbar-border-bottom");
        Toolbar.toolbarClsScroller = this.getThemeClass("toolbar-scroller");
        Toolbar.toolbarClsScrollerBody = this.getThemeClass("toolbar-scroller-body");
        Toolbar.toolbarClsScrollerDisabled = this.getThemeClass("toolbar-scroller-disabled");
        Toolbar.toolbarClsV = this.getThemeClass("toolbar-vertical");
        Toolbar.toolbarClsBorder = this.getThemeClass("toolbar-border");
        Toolbar.toolbarClsBorderTop = this.getThemeClass("toolbar-border-top");
        Toolbar.toolbarClsBorderLeft = this.getThemeClass("toolbar-border-left");
        Toolbar.toolbarClsBorderBottom = this.getThemeClass("toolbar-border-bottom");
        Toolbar.toolbarClsBorderRight = this.getThemeClass("toolbar-border-right");

        Toolbar.toolbarClsInner = this.getThemeClass("toolbar-inner");
        Toolbar.toolbarClsInnerVertical = this.getThemeClass("toolbar-inner-vertical");
        Toolbar.toolbarClsBody = this.getThemeClass("toolbar-body");

        Toolbar.toolbarClsBodyContainer = this.getThemeClass("toolbar-body-container");
        Toolbar.toolbarClsBodySplit = this.getThemeClass("toolbar-body-split");
    }

    protected drawing(): GinkgoElement | undefined | null {
        let innerCls = [Toolbar.toolbarClsInner],
            bodyCls = [Toolbar.toolbarClsBody],
            bodyStyle = {...this.bodyStyle},
            bodyContainerEls: any = [],
            innerEls: Array<any> = [],
            childType = 0;

        if (this.props.direction == "vertical") {
            innerCls.push(Toolbar.toolbarClsInnerVertical);
        }

        this.positionChildren.left = [];
        this.positionChildren.center = [];
        this.positionChildren.right = [];

        let children = this.drawingToolbarChildren();
        if (children && children.length > 0) {
            for (let c of children) {
                if (c.module == ToolbarSplit && (c as ToolbarSplitProps).type == "align") {
                    childType = childType + 1;
                } else {
                    if (c.module == ToolbarSplit) {
                        let split = "split";
                        if (childType == 0) {
                            this.positionChildren.left.push({item: split});
                        } else if (childType == 1) {
                            this.positionChildren.center.push({item: split});
                        } else {
                            this.positionChildren.right.push({item: split});
                        }
                    } else {
                        if (childType == 0) {
                            this.positionChildren.left.push({item: c});
                        } else if (childType == 1) {
                            this.positionChildren.center.push({item: c});
                        } else {
                            this.positionChildren.right.push({item: c});
                        }
                    }
                }
            }

            if (this.positionChildren.left.length > 0
                && this.positionChildren.center.length > 0
                && this.positionChildren.right.length == 0) {
                this.positionChildren.right = this.positionChildren.center;
                this.positionChildren.center = [];
            }
        }

        for (let l of this.positionChildren.left) {
            l.ref = Ginkgo.createRef();
            if (l.item == "split") {
                bodyContainerEls.push(<div ref={l.ref} className={Toolbar.toolbarClsBodySplit}></div>);
            } else {
                bodyContainerEls.push(<div ref={l.ref} className={Toolbar.toolbarClsBodyContainer}>{l.item}</div>);
            }
        }
        for (let c of this.positionChildren.center) {
            c.ref = Ginkgo.createRef();
            if (c.item == "split") {
                bodyContainerEls.push(<div ref={c.ref} className={Toolbar.toolbarClsBodySplit}></div>);
            } else {
                bodyContainerEls.push(<div ref={c.ref} className={Toolbar.toolbarClsBodyContainer}>{c.item}</div>);
            }
        }
        for (let r of this.positionChildren.right) {
            r.ref = Ginkgo.createRef();
            if (r.item == "split") {
                bodyContainerEls.push(<div ref={r.ref} className={Toolbar.toolbarClsBodySplit}></div>);
            } else {
                bodyContainerEls.push(<div ref={r.ref} className={Toolbar.toolbarClsBodyContainer}>{r.item}</div>);
            }
        }

        if (this.props.scroller == true && this.scrollerShow != false) {
            let tscA = [Toolbar.toolbarClsScroller], tscB = [Toolbar.toolbarClsScroller];
            if (this.scrollerLeftDisabled == true) tscA.push(Toolbar.toolbarClsScrollerDisabled);
            if (this.scrollerRightDisabled == true) tscB.push(Toolbar.toolbarClsScrollerDisabled);

            innerEls.push(
                <div className={tscA.join(" ")} onClick={(e) => this.onLeftScrollerClick(e)}>
                    {this.props.direction == 'vertical' ?
                        <Icon icon={IconTypes.chevronUp}/> :
                        <Icon icon={IconTypes.chevronLeft}/>
                    }
                </div>);
            innerEls.push(
                <div ref={c => this.toolbarScrollerEl = c} className={Toolbar.toolbarClsScrollerBody}>
                    <div
                        ref={c => this.toolbarScrollerBodyEl = c}
                        className={bodyCls.join(" ")}
                        style={bodyStyle}
                    >
                        {bodyContainerEls}
                    </div>
                </div>
            );
            innerEls.push(
                <div className={tscB.join(" ")} onClick={(e) => this.onRightScrollerClick(e)}>
                    {this.props.direction == 'vertical' ?
                        <Icon icon={IconTypes.chevronDown}/> :
                        <Icon icon={IconTypes.chevronRight}/>}
                </div>);
        } else {
            innerEls.push(
                <div ref={c => this.toolbarScrollerEl = c} className={Toolbar.toolbarClsScrollerBody}>
                    <div
                        ref={c => this.toolbarScrollerBodyEl = c}
                        className={bodyCls.join(" ")}
                        style={bodyStyle}
                    >
                        {bodyContainerEls}
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={c => this.toolbarInnerEl = c}
                className={innerCls.join(" ")}
            >
                {innerEls}
            </div>
        );
    }

    protected drawingToolbarChildren() {
        return this.props.children;
    }

    private getAllChildren() {
        let children = [];
        for (let l of this.positionChildren.left) {
            children.push(l);
        }
        for (let l of this.positionChildren.center) {
            children.push(l);
        }
        for (let l of this.positionChildren.right) {
            children.push(l);
        }
        return children;
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();

        let children = this.getAllChildren();
        for (let l of children) {
            let component = l.ref.instance as HTMLComponent;
            if (component.children
                && component.children.length > 0
                && component.children[0] instanceof Button) {
                if (!component.children[0].props['action']) {
                    component.children[0].update("action", "light");
                }
            }
        }

        this.resetPositionChildren();
    }

    onSizeChange(width: number, height: number): void {
        this.resetPositionChildren();
    }

    protected resetPositionChildren() {
        let wh = this.getMaxWH(),
            lastLeft = 0,
            lastRight = 0,
            innerWidth = 0,
            innerHeight = 0,
            oldScrollerShow = this.scrollerShow,
            direction = this.props.direction == "vertical" ? true : false;
        if (this.toolbarInnerEl) {
            let dom = this.toolbarInnerEl.dom as HTMLElement;
            innerWidth = dom.offsetWidth;
            innerHeight = dom.offsetHeight;
        }

        if (direction) {
            if (wh.th <= innerHeight) {
                this.scrollerShow = false;
            } else {
                this.scrollerShow = true;
            }
        } else {
            if (wh.tw <= innerWidth) {
                this.scrollerShow = false;
            } else {
                this.scrollerShow = true;
            }
        }
        if (this.scrollerShow != oldScrollerShow) {
            this.redrawing();
        }

        if (this.toolbarScrollerEl) {
            let dom = this.toolbarScrollerEl.dom as HTMLElement;
            if (direction) {
                dom.style.height = wh.th + "px";
                dom.style.width = wh.w + "px";
            } else {
                dom.style.height = wh.h + "px";
                dom.style.width = wh.tw + "px";
            }
        }

        for (let l of this.positionChildren.left) {
            let el = l.ref.instance as HTMLComponent;
            if (el && el.dom) {
                let dom = el.dom as HTMLElement;
                let width = dom.offsetWidth;
                let height = dom.offsetHeight;
                dom.style.zIndex = "1";

                if (direction) {
                    dom.style.top = lastLeft + "px";
                    lastLeft += height + this.defaultSplitWidth;

                    let dl = (wh.w - width) / 2;
                    dl = dl >= 0 ? dl : 0;
                    dom.style.left = dl + "px";
                } else {
                    dom.style.left = lastLeft + "px";
                    lastLeft += width + this.defaultSplitWidth;

                    let dl = (wh.h - height) / 2;
                    dl = dl >= 0 ? dl : 0;
                    dom.style.top = dl + "px";
                }
            }
        }

        let totalCenterSize = (this.positionChildren.center.length - 1) * this.defaultSplitWidth;
        for (let c of this.positionChildren.center) {
            let el = c.ref.instance as HTMLComponent;
            if (el.dom) {
                let dom = el.dom as HTMLElement;
                let width = dom.offsetWidth;
                let height = dom.offsetHeight;

                if (direction) {
                    totalCenterSize += height;
                } else {
                    totalCenterSize += width;
                }
            }
        }
        if (totalCenterSize < 0) totalCenterSize = 0;
        let centerLeft;
        if (direction) {
            centerLeft = (innerHeight - totalCenterSize) / 2;
        } else {
            centerLeft = (innerWidth - totalCenterSize) / 2;
        }
        for (let c of this.positionChildren.center) {
            let el = c.ref.instance as HTMLComponent;
            if (el.dom) {
                let dom = el.dom as HTMLElement;
                let width = dom.offsetWidth;
                let height = dom.offsetHeight;
                dom.style.zIndex = "2";

                if (direction) {
                    dom.style.top = centerLeft + "px";
                    centerLeft += height + this.defaultSplitWidth;

                    let dl = (wh.w - width) / 2;
                    dl = dl >= 0 ? dl : 0;
                    dom.style.left = dl + "px";
                } else {
                    dom.style.left = centerLeft + "px";
                    centerLeft += width + this.defaultSplitWidth;

                    let dl = (wh.h - height) / 2;
                    dl = dl >= 0 ? dl : 0;
                    dom.style.top = dl + "px";
                }
            }
        }

        let rightList = [...this.positionChildren.right];
        rightList.reverse();
        for (let r of rightList) {
            let el = r.ref.instance as HTMLComponent;
            if (el.dom) {
                let dom = el.dom as HTMLElement;
                let width = dom.offsetWidth;
                let height = dom.offsetHeight;
                dom.style.zIndex = "1";

                if (direction) {
                    dom.style.bottom = lastRight + "px";
                    lastRight += height + this.defaultSplitWidth;

                    let dl = (wh.w - width) / 2;
                    dl = dl >= 0 ? dl : 0;
                    dom.style.left = dl + "px";
                } else {
                    dom.style.right = lastRight + "px";
                    lastRight += width + this.defaultSplitWidth;

                    let dl = (wh.h - height) / 2;
                    dl = dl >= 0 ? dl : 0;
                    dom.style.top = dl + "px";
                }
            }
        }
    }

    protected getMaxWH() {
        let maxW = 0, maxH = 0, totalW = 0, totalH = 0;
        if (this.toolbarScrollerBodyEl) {
            let lefts = this.positionChildren.left;
            if (lefts && lefts.length > 0) {
                for (let c of lefts) {
                    let el = c.ref.instance as HTMLComponent;
                    if (el instanceof HTMLComponent) {
                        if (el.dom && el.dom instanceof HTMLElement) {
                            let width = el.dom.offsetWidth;
                            let height = el.dom.offsetHeight;
                            totalW += width;
                            totalH += height;
                        }
                    }
                }
            }

            let lists = [...this.positionChildren.left, ...this.positionChildren.center, ...this.positionChildren.right];
            if (lists && lists.length > 0) {
                for (let c of lists) {
                    let el = c.ref.instance as HTMLComponent;
                    if (el instanceof HTMLComponent) {
                        if (el.dom && el.dom instanceof HTMLElement) {
                            let width = el.dom.offsetWidth;
                            let height = el.dom.offsetHeight;
                            if (maxW < width) maxW = width;
                            if (maxH < height) maxH = height;
                        }
                    }
                }
            }
        }
        return {w: maxW, h: maxH, tw: totalW, th: totalH};
    }

    protected onLeftScrollerClick(e: Event) {
        let scrollerEl = this.toolbarScrollerEl.dom as HTMLElement;
        if (scrollerEl) {
            if (this.props.direction == "vertical") {
                let height = scrollerEl.offsetHeight,
                    scrollTop = scrollerEl ? scrollerEl.scrollTop : 0;
                if (scrollTop > 0) scrollTop = scrollTop - (height / 2);
                if (scrollTop <= 0) {
                    scrollTop = 0;
                    this.scrollerLeftDisabled = true;
                }
                this.scrollerRightDisabled = false;

                this.redrawing();
                scrollerEl.scrollTop = scrollTop;
            } else {
                let width = scrollerEl.offsetWidth,
                    scrollLeft = scrollerEl ? scrollerEl.scrollLeft : 0;
                if (scrollLeft > 0) scrollLeft = scrollLeft - (width / 2);
                if (scrollLeft <= 0) {
                    scrollLeft = 0;
                    this.scrollerLeftDisabled = true;
                }
                this.scrollerRightDisabled = false;

                this.redrawing();
                scrollerEl.scrollLeft = scrollLeft;
            }
        }
    }

    protected onRightScrollerClick(e: Event) {
        let scrollerEl = this.toolbarScrollerEl.dom as HTMLElement;
        if (scrollerEl) {
            if (this.props.direction == "vertical") {
                let height = scrollerEl.offsetHeight,
                    scrollHeight = scrollerEl.scrollHeight,
                    scrollTop = scrollerEl ? scrollerEl.scrollTop : 0;
                scrollTop = scrollTop + (height / 2);
                if (scrollTop >= (scrollHeight - height)) {
                    scrollTop = scrollHeight - height;
                    this.scrollerRightDisabled = true;
                }
                this.scrollerLeftDisabled = false;

                this.redrawing();
                scrollerEl.scrollTop = scrollTop;
            } else {
                let width = scrollerEl.offsetWidth,
                    scrollWidth = scrollerEl.scrollWidth,
                    scrollLeft = scrollerEl ? scrollerEl.scrollLeft : 0;
                scrollLeft = scrollLeft + (width / 2);
                if (scrollLeft >= (scrollWidth - width)) {
                    scrollLeft = scrollWidth - width;
                    this.scrollerRightDisabled = true;
                }
                this.scrollerLeftDisabled = false;

                this.redrawing();
                scrollerEl.scrollLeft = scrollLeft;
            }
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(Toolbar.toolbarCls);
        if (this.props.border == true) {
            arr.push(Toolbar.toolbarBorderCls);
        }
        if (this.props.border == "left") {
            arr.push(Toolbar.toolbarBorderLCls);
        }
        if (this.props.border == "right") {
            arr.push(Toolbar.toolbarBorderRCls);
        }
        if (this.props.border == "top") {
            arr.push(Toolbar.toolbarBorderTCls);
        }
        if (this.props.border == "bottom") {
            arr.push(Toolbar.toolbarBorderBCls);
        }
        return arr;
    }
}


export interface ToolbarSplitProps {
    type: "split" | "align";
}

export class ToolbarSplit extends Ginkgo.Component<ToolbarSplitProps> {
    render() {
        return null;
    }
}
