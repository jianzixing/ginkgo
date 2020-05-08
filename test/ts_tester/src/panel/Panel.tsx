import Ginkgo, {CSSProperties, GinkgoElement, GinkgoNode, HTMLComponent} from "../../carbon/Ginkgo";
import "./Panel.scss";
import Component, {ComponentProps} from "../component/Component";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import Loading from "../loading/Loading";
import Toolbar, {ToolbarProps} from "../toolbar/Toolbar";
import Container from "../component/Container";

export interface PanelToolModel {
    icon?: string;
    iconType?: string;
    data?: any;
    lr?: "left" | "right";
    onClick?: (e: Event, model: PanelToolModel) => void;
}

export interface PanelProps extends ComponentProps {
    border?: boolean;
    light?: boolean;
    header?: boolean;
    fillParent?: boolean;
    scroll?: "x" | "y" | "xy" | "auto" | "autoX" | "autoY" | boolean;
    hasInnerPadding?: boolean;
    frame?: boolean;
    headerAlign?: "top" | "right" | "bottom" | "left";
    title?: GinkgoNode;
    titleIcon?: string;
    titleIconType?: string;
    tools?: Array<PanelToolModel>;
    collapse?: boolean;
    collapseType?: "top" | "right" | "bottom" | "left";
    collapseStatus?: "open" | "close";
    toolbars?: Array<ToolbarProps>;

    mask?: boolean;
    maskText?: string;

    onHeaderMouseDown?: (e: Event) => void;
    onHeaderMouseUp?: (e: Event) => void;
    onHeaderMouseMove?: (e: Event) => void;
}

export default class Panel<P extends PanelProps> extends Container<P> {

    protected static panelClsRoot;
    protected static panelFillCls;
    protected static panelClsLightRoot;
    protected static panelClsBorder;
    protected static panelClsFrame;
    protected static panelClsBody;
    protected static panelClsHeader;
    protected static panelClsHeaderBody;
    protected static panelClsHeaderInner;
    protected static panelClsHeaderTitle;
    protected static panelClsTitleIcon;

    protected static panelClsHeaderIconBody;
    protected static panelClsHeaderIcon;
    protected static panelClsHeaderIconTool;
    protected static panelClsHeaderImg;
    protected static panelClsWrapper;
    protected static panelClsScrollX;
    protected static panelClsScrollY;
    protected static panelClsScrollAutoX;
    protected static panelClsScrollAutoY;
    protected static panelClsInner;
    protected static panelClsInnerPadding;

    protected static panelClsAlignRight;
    protected static panelClsAlignLeft;

    protected headerEl: HTMLComponent;
    protected headerBodyEl: HTMLComponent;
    protected wrapperEl: HTMLComponent;

    protected collapse: boolean = false;
    protected originalWidth: number;
    protected originalHeight: number;
    protected headerAlign?: "top" | "right" | "bottom" | "left" = this.props.headerAlign;
    protected collapseType: "top" | "right" | "bottom" | "left" | undefined = this.props.collapseType;

    protected headerStyle: CSSProperties = {};
    protected headerBodyStyle: CSSProperties = {};
    protected wrapperStyle: CSSProperties = {};
    protected innerStyle: CSSProperties = {};

    protected extTools: Array<PanelToolModel>;
    protected extOnCollapseClick: (e, panel: Panel<any>) => boolean;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        Panel.panelClsRoot = this.getThemeClass("panel");
        Panel.panelFillCls = this.getThemeClass("panel-fill");
        Panel.panelClsLightRoot = this.getThemeClass("panel-light");
        Panel.panelClsBorder = this.getThemeClass("panel-border");
        Panel.panelClsFrame = this.getThemeClass("panel-frame");
        Panel.panelClsBody = this.getThemeClass("panel-body-el");
        Panel.panelClsHeader = this.getThemeClass("panel-header");
        Panel.panelClsHeaderBody = this.getThemeClass("panel-header-body");
        Panel.panelClsHeaderInner = this.getThemeClass("panel-header-inner");
        Panel.panelClsHeaderTitle = this.getThemeClass("panel-header-title");
        Panel.panelClsTitleIcon = this.getThemeClass("panel-header-title-icon");

        Panel.panelClsHeaderIconBody = this.getThemeClass("panel-header-icon-body");
        Panel.panelClsHeaderIcon = this.getThemeClass("panel-header-icon-inner");
        Panel.panelClsHeaderIconTool = this.getThemeClass("panel-header-icon-tool");
        Panel.panelClsHeaderImg = this.getThemeClass("panel-header-img-inner");
        Panel.panelClsWrapper = this.getThemeClass("panel-wrapper-el");
        Panel.panelClsScrollX = this.getThemeClass("panel-scroll-x");
        Panel.panelClsScrollY = this.getThemeClass("panel-scroll-y");
        Panel.panelClsScrollAutoX = this.getThemeClass("panel-scroll-ax");
        Panel.panelClsScrollAutoY = this.getThemeClass("panel-scroll-ay");
        Panel.panelClsInner = this.getThemeClass("panel-inner-el");
        Panel.panelClsInnerPadding = this.getThemeClass("panel-inner-padding");

        Panel.panelClsAlignRight = this.getThemeClass("align-right");
        Panel.panelClsAlignLeft = this.getThemeClass("align-left");
    }

    protected drawing(): GinkgoElement | undefined | null {
        let scroll = this.props.scroll,
            hasInnerPadding = this.props.hasInnerPadding,
            innerElCls = [Panel.panelClsInner],
            toolsEl: Array<GinkgoNode> = [],
            preToolsEl: Array<GinkgoNode> = [],
            titleIcons = [],
            headerReactElement,
            contentReactElement,
            currentElements: Array<GinkgoNode> = [];

        if (!this.lockScroll()) {
            if (scroll == 'x') innerElCls.push(Panel.panelClsScrollX);
            if (scroll == 'y') innerElCls.push(Panel.panelClsScrollY);
            if (scroll == 'auto' || scroll == true) {
                innerElCls.push(Panel.panelClsScrollAutoX);
                innerElCls.push(Panel.panelClsScrollAutoY);
            }
            if (scroll == "autoX") innerElCls.push(Panel.panelClsScrollAutoX);
            if (scroll == "autoY") innerElCls.push(Panel.panelClsScrollAutoY);
            if (scroll == 'xy') {
                innerElCls.push(Panel.panelClsScrollX);
                innerElCls.push(Panel.panelClsScrollY);
            }
        }

        if (hasInnerPadding) {
            innerElCls.push(Panel.panelClsInnerPadding)
        }

        if (this.props.header != false && (this.props.header == true || this.props.title)) {

            if (this.props.collapse) {
                let icon;
                if (this.collapse) {
                    if (this.collapseType == "left") icon = <Icon icon={IconTypes.chevronRight}/>;
                    else if (this.collapseType == "right") icon = <Icon icon={IconTypes.chevronLeft}/>;
                    else if (this.collapseType == "bottom") icon = <Icon icon={IconTypes.chevronUp}/>;
                    else icon = <Icon icon={IconTypes.chevronDown}/>;
                } else {
                    if (this.collapseType == "left") icon = <Icon icon={IconTypes.chevronLeft}/>;
                    else if (this.collapseType == "right") icon = <Icon icon={IconTypes.chevronRight}/>;
                    else if (this.collapseType == "bottom") icon = <Icon icon={IconTypes.chevronDown}/>;
                    else icon = <Icon icon={IconTypes.chevronUp}/>;
                }
                toolsEl.push(
                    <div
                        key="abc"
                        className={Panel.panelClsHeaderIcon + " " + Panel.panelClsHeaderIconTool}
                        onClick={(e) => {
                            if (this.extOnCollapseClick && this.extOnCollapseClick(e, this)) {

                            } else {
                                this.onCollapseClick();
                            }
                        }}>
                        {icon}
                    </div>
                )
            }


            let tools = this.getHeaderTools() || [];
            if (this.extTools) this.extTools.map(value => tools.push(value));
            if (tools) {
                tools.map((value, index) => {
                    if (value.iconType) {
                        (value.lr == "left" ? preToolsEl : toolsEl).push(
                            <div
                                className={Panel.panelClsHeaderIcon + " " + Panel.panelClsHeaderIconTool}
                                onClick={(e: any) => {
                                    if (value.onClick) value.onClick(e, value);
                                }}>
                                <Icon icon={value.iconType}/>
                            </div>
                        );
                    }
                    if (value.icon) {
                        (value.lr == "left" ? preToolsEl : toolsEl).push(
                            <div
                                className={Panel.panelClsHeaderIcon + " " + Panel.panelClsHeaderIconTool + " " + Panel.panelClsHeaderImg}
                                onClick={(e: any) => {
                                    if (value.onClick) value.onClick(e, value);
                                }}>
                                <img src={value.icon}/>
                            </div>
                        );
                    }
                });
            }

            if (this.props.titleIconType) {
                titleIcons.push(
                    <div className={Panel.panelClsHeaderIcon + " " + Panel.panelClsTitleIcon}>
                        <Icon icon={this.props.titleIconType}/>
                    </div>
                )
            }
            if (this.props.titleIcon) {
                titleIcons.push(
                    <div
                        className={Panel.panelClsHeaderIcon + " " + Panel.panelClsHeaderImg + " " + Panel.panelClsTitleIcon}>
                        <img src={this.props.titleIcon}/>
                    </div>
                )
            }


            let iconsEl1;
            if (preToolsEl && preToolsEl.length > 0) {
                iconsEl1 = (
                    <div className={Panel.panelClsHeaderIconBody}>
                        {preToolsEl}
                    </div>
                );
            }
            let iconsEl2;
            if (titleIcons && titleIcons.length > 0) {
                iconsEl2 = (
                    <div className={Panel.panelClsHeaderIconBody}>
                        {titleIcons}
                    </div>
                );
            }
            let iconsEl3;
            if (toolsEl && toolsEl.length > 0) {
                iconsEl3 = (
                    <div className={Panel.panelClsHeaderIconBody}>
                        {toolsEl}
                    </div>
                );
            }

            headerReactElement = (
                <div
                    ref={c => this.headerEl = c}
                    className={Panel.panelClsHeader}
                    style={this.headerStyle}
                    onMouseDown={e => {
                        if (this.props && this.props.onHeaderMouseDown) {
                            this.props.onHeaderMouseDown(e);
                        }
                    }}
                    onMouseMove={e => {
                        if (this.props && this.props.onHeaderMouseMove) {
                            this.props.onHeaderMouseMove(e);
                        }
                    }}
                    onMouseUp={e => {
                        if (this.props && this.props.onHeaderMouseUp) {
                            this.props.onHeaderMouseUp(e);
                        }
                    }}
                >
                    <div
                        ref={c => this.headerBodyEl = c}
                        className={Panel.panelClsHeaderBody}
                        style={this.headerBodyStyle}
                    >
                        {iconsEl1}
                        {iconsEl2}
                        <div className={Panel.panelClsHeaderInner}>
                            <div className={Panel.panelClsHeaderTitle}>
                                {this.props.title || <span>&nbsp;</span>}
                            </div>
                        </div>
                        {iconsEl3}
                    </div>
                </div>
            );
        }

        let toolbars = this.getToolbars();
        let topToolbar, bottomToolbar;
        if (toolbars && toolbars.length > 0) {
            for (let tb of toolbars) {
                if (tb.align == "bottom") {
                    if (!bottomToolbar) bottomToolbar = [];
                    bottomToolbar.push(tb);
                } else {
                    if (!topToolbar) topToolbar = [];
                    topToolbar.push(tb);
                }
            }
        }

        contentReactElement = (
            <div
                ref={c => this.wrapperEl = c}
                className={Panel.panelClsWrapper}
                style={this.wrapperStyle}
            >
                {topToolbar}
                <div
                    className={innerElCls.join(" ")}
                    style={this.innerStyle}
                >
                    {this.drawingPanelChild()}
                </div>
                {bottomToolbar}
                {this.props.mask ? <Loading text={this.props.maskText}/> : undefined}
            </div>
        );

        if (this.headerAlign == "right" || this.headerAlign == "bottom") {
            currentElements.push(contentReactElement);
            currentElements.push(headerReactElement);
        } else {
            currentElements.push(headerReactElement);
            currentElements.push(contentReactElement);
        }

        return (
            <div className={Panel.panelClsBody}>
                {currentElements}
            </div>
        )
    }

    protected drawingPanelChild(): GinkgoNode | GinkgoElement[] {
        return this.props.children;
    }

    protected getToolbars(): Array<ToolbarProps> {
        return this.props.toolbars;
    }

    protected lockScroll(): boolean {
        return false;
    }

    protected getHeaderTools(): Array<PanelToolModel> {
        return this.props.tools;
    }

    private onCollapseClick() {
        if (this.collapse == false) {
            if (this.collapseType) {
                this.headerAlign = this.props.headerAlign;
                this.setHeaderAlign(this.collapseType);
            }

            this.setCollapseClose();
        } else {
            this.setCollapseOpen();
            if (this.collapseType) {
                this.headerAlign = this.props.headerAlign;
                this.setHeaderAlign(this.headerAlign);
            }
        }
    }

    doLayout() {
        this.resizePanelBounds();
        this.resizeToolbars();
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();
        this.layout();
    }

    setHeaderAlign(headerAlign: "top" | "right" | "bottom" | "left" | undefined) {
        this.headerAlign = headerAlign;
        this.resizePanelBounds();
    }

    protected resizePanelBounds() {
        let align = this.headerAlign;
        if (this.headerBodyEl) {
            let headerBodyEl = this.headerBodyEl.dom as HTMLElement;

            let width = this.getWidth(),
                height = this.getHeight(),
                headerHeight = headerBodyEl ? headerBodyEl.offsetHeight : 0;

            if (align == "right") {
                this.headerBodyStyle.left = headerHeight + "px";
                this.headerBodyStyle.top = 0 + "px";
                this.headerBodyStyle.width = height + "px";
                this.headerStyle.width = headerHeight;
            } else if (align == "left") {
                this.headerBodyStyle.left = headerHeight + "px";
                this.headerBodyStyle.top = 0 + "px";
                this.headerBodyStyle.width = height + "px";
                this.headerStyle.width = headerHeight;
            } else if (align == "bottom") {
                this.headerBodyStyle.left = 0 + "px";
                this.headerBodyStyle.top = 0 + "px";
                this.headerBodyStyle.width = width + "px";
                this.headerStyle.width = undefined;
            } else {
                this.headerBodyStyle.left = 0 + "px";
                this.headerBodyStyle.top = 0 + "px";
                this.headerBodyStyle.width = width + "px";
                this.headerStyle.width = undefined;
            }
            this.redrawing(false);
        }
    }

    protected resizeToolbars() {
        Ginkgo.forEachChildren(component => {
            if (component instanceof Toolbar) {
                component.setWidth(this.getWidth());
            }
        }, this);
    }

    setCollapseClose() {
        let headerBodyEl = this.headerBodyEl.dom as HTMLElement,
            wrapperEl = this.wrapperEl.dom as HTMLElement,
            headerHeight = headerBodyEl ? headerBodyEl.offsetHeight || 0 : 0;

        if (wrapperEl) {
            if (this.collapse == false) {
                this.collapse = true;
                this.originalWidth = this.getWidth();
                this.originalHeight = this.getHeight();

                if (this.headerAlign == "right" || this.headerAlign == "left") {
                    super.setWidth(headerHeight);

                    this.wrapperStyle.width = 0 + 'px';
                    if (headerBodyEl) {
                        this.headerBodyStyle.left = headerHeight + "px";
                    }
                } else {
                    super.setHeight(headerHeight);
                    this.wrapperStyle.height = headerHeight + 'px';

                    if (headerBodyEl) {
                        this.headerBodyStyle.top = "0px";
                    }
                }

                this.redrawing();
            }
        }
    }

    setCollapseOpen() {
        let wrapperEl = this.wrapperEl.dom as HTMLElement;

        if (wrapperEl) {
            if (this.collapse == true) {
                this.collapse = false;

                if (this.headerAlign == "right" || this.headerAlign == "left") {
                    super.setWidth(this.originalWidth);
                    this.wrapperStyle.width = "";

                    super.setHeight(this.originalHeight);
                    this.wrapperStyle.height = "";
                } else {
                    super.setWidth(this.originalWidth);
                    this.wrapperStyle.width = "";

                    super.setHeight(this.originalHeight);
                    this.wrapperStyle.height = "";
                }

                this.headerStyle.width = null;
                this.headerBodyStyle.width = null;

                this.redrawing();
            }
        }
    }

    setCollapseType(type: "left" | "right" | "bottom" | "top") {
        this.collapseType = type;
        this.redrawing();
    }

    setCollapse(collapse: boolean) {
        this.collapse = collapse;
        this.redrawing();
    }

    isCollapse(): boolean {
        return this.collapse;
    }

    getHeaderModel() {
        return {
            title: this.props.title,
            iconType: this.props.titleIconType,
            icon: this.props.titleIcon,
            key: this.props.key
        }
    }

    setOnCollapseClick(evt: (e, panel: Panel<any>) => boolean) {
        this.extOnCollapseClick = evt;
    }

    getHeaderMinWidth(): number {
        let headerBodyEl = this.headerBodyEl.dom as HTMLElement;
        if (this.headerAlign == "left" || this.headerAlign == "right") {
            return headerBodyEl.offsetWidth;
        } else {
            return headerBodyEl.offsetHeight;
        }
    }

    getOriginalWidth() {
        if (this.collapse) {
            return this.originalWidth;
        } else {
            return this.getWidth();
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(Panel.panelClsRoot);
        if (this.props.border == true) {
            arr.push(Panel.panelClsBorder);
        }
        if (this.props.light == true) {
            arr.push(Panel.panelClsLightRoot);
        }
        if (this.props.frame == true) {
            arr.push(Panel.panelClsFrame);
        }

        if (this.headerAlign == "right") {
            arr.push(Panel.panelClsAlignRight);
        }
        if (this.headerAlign == "left") {
            arr.push(Panel.panelClsAlignLeft);
        }
        if (this.props.fillParent == true) {
            arr.push(Panel.panelFillCls);
        }
        return arr;
    }
}
