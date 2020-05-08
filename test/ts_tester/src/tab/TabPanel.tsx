import Ginkgo, {
    CSSProperties,
    GinkgoElement,
    GinkgoNode,
    HTMLComponent,
    RefObject
} from "../../carbon/Ginkgo";
import "./TabPanel.scss";
import Component, {ComponentProps} from "../component/Component";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import Container from "../component/Container";

export interface TabModel {
    key?: any;
    title?: GinkgoNode;
    icon?: string;
    iconType?: string;
    action?: boolean;
    content?: GinkgoNode;
    data?: any;
    closable?: boolean;
}

interface TabModelWrapper {
    model: TabModel;
    ref?: RefObject<HTMLComponent>;
    tabButtonRef?: RefObject<HTMLComponent>;
}

export interface TabPanelProps extends ComponentProps {
    headerAlign?: "top" | "right" | "bottom" | "left";
    headerRotation?: "deg90" | "deg270";
    onCloseClick?: ((e: Event, model?: TabModel) => void);
    border?: boolean;
    models?: Array<TabModel>;
}

const tabItemSplitWidth = 4;

export default class TabPanel<P extends TabPanelProps> extends Container<P> {

    protected static tabPanelCls;
    protected static tabPanelBorderCls;
    protected static tabPanelClsRight;
    protected static tabPanelClsLeft;
    protected static tabPanelClsBottom;

    protected static tabPanelClsBody;
    protected static tabPanelClsHeader;
    protected static tabPanelClsHeaderBody;
    protected static tabPanelClsHeaderBodyItem;
    protected static tabPanelClsHeaderBodyItem90;
    protected static tabPanelClsHeaderBodyItem270;

    protected static tabPanelClsHeaderBodyItemActive;
    protected static tabPanelClsHeaderBodyItemInner;
    protected static tabPanelClsHeaderBodyItemClose;
    protected static tabPanelClsHeaderBodyItemIcon;
    protected static tabPanelClsHeaderBodyItemText;
    protected static tabPanelClsInner;
    protected static tabPanelClsInnerContent;
    protected static tabPanelClsHidden;

    protected headerBodyStyle?: CSSProperties;
    protected tabs?: Array<TabModelWrapper>;
    protected headerAlign: string = this.props.headerAlign;
    protected headerRotation: string = this.props.headerRotation;
    protected tabInnerRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected clickHistory: Array<TabModel> = []; // TAB点击历史

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TabPanel.tabPanelCls = this.getThemeClass("tabpanel");
        TabPanel.tabPanelBorderCls = this.getThemeClass("tabpanel-border");
        TabPanel.tabPanelClsRight = this.getThemeClass("tabpanel-right");
        TabPanel.tabPanelClsLeft = this.getThemeClass("tabpanel-left");
        TabPanel.tabPanelClsBottom = this.getThemeClass("tabpanel-bottom");

        TabPanel.tabPanelClsBody = this.getThemeClass("tabpanel-body");
        TabPanel.tabPanelClsHeader = this.getThemeClass("tabpanel-header");
        TabPanel.tabPanelClsHeaderBody = this.getThemeClass("tabpanel-header-body");
        TabPanel.tabPanelClsHeaderBodyItem = this.getThemeClass("tabpanel-header-item");
        TabPanel.tabPanelClsHeaderBodyItem90 = this.getThemeClass("tabpanel-header-item-90deg");
        TabPanel.tabPanelClsHeaderBodyItem270 = this.getThemeClass("tabpanel-header-item-270deg");

        TabPanel.tabPanelClsHeaderBodyItemActive = this.getThemeClass("tabpanel-header-item-active");
        TabPanel.tabPanelClsHeaderBodyItemInner = this.getThemeClass("tabpanel-header-item-inner");
        TabPanel.tabPanelClsHeaderBodyItemClose = this.getThemeClass("tabpanel-header-item-close");
        TabPanel.tabPanelClsHeaderBodyItemIcon = this.getThemeClass("tabpanel-header-icon");
        TabPanel.tabPanelClsHeaderBodyItemText = this.getThemeClass("tabpanel-header-text");
        TabPanel.tabPanelClsInner = this.getThemeClass("tabpanel-inner");
        TabPanel.tabPanelClsInnerContent = this.getThemeClass("tabpanel-inner-content");
        TabPanel.tabPanelClsHidden = this.getThemeClass("tabpanel-hidden");
    }

    protected drawing(): GinkgoElement<any> | undefined | null | GinkgoElement[] {
        let tabs: Array<TabModelWrapper> | undefined = this.tabs,
            tabsEls = [],
            bodyEls = [],
            headerBodyStyle = {...this.headerBodyStyle},
            tabPanelCls = [TabPanel.tabPanelClsBody],
            tabItemNodes = [];

        if (tabs && tabs.length > 0) {
            let index = 0;
            for (let tab of tabs) {
                let ref: RefObject<HTMLComponent> = Ginkgo.createRef(),
                    tbRCls = [TabPanel.tabPanelClsHeaderBodyItem],
                    style: CSSProperties = {},
                    iconEl;

                if (tab.model.action == true) {
                    tbRCls.push(TabPanel.tabPanelClsHeaderBodyItemActive);
                }

                if (this.props.headerRotation == "deg90") {
                    tbRCls.push(TabPanel.tabPanelClsHeaderBodyItem90);
                }
                if (this.props.headerRotation == "deg270") {
                    tbRCls.push(TabPanel.tabPanelClsHeaderBodyItem270);
                }

                if (tab.model.iconType) {
                    iconEl = (
                        <div className={TabPanel.tabPanelClsHeaderBodyItemIcon}><Icon icon={tab.model.iconType}/>
                        </div>);
                }
                if (tab.model.icon) {
                    iconEl = (
                        <div className={TabPanel.tabPanelClsHeaderBodyItemIcon}><img src={tab.model.icon}/></div>);
                }

                tabsEls.push(
                    <div
                        ref={ref}
                        className={tbRCls.join(" ")}
                        style={style}
                        onClick={(e) => {
                            this.tabs.map(value => value.model.action = false);
                            tab.model.action = true;
                            this.onTabClickSetting(tab);
                            this.redrawing();
                        }}
                    >
                        <div className={TabPanel.tabPanelClsHeaderBodyItemInner}>
                            {iconEl}
                            <div className={TabPanel.tabPanelClsHeaderBodyItemText}>{tab.model.title}</div>
                        </div>
                        {
                            tab.model.closable != false ?
                                <div
                                    className={TabPanel.tabPanelClsHeaderBodyItemClose}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        this.closeTab(e, tab);
                                    }}
                                >
                                    <Icon icon={IconTypes.times}/>
                                </div> : undefined
                        }
                    </div>
                );
                tab.tabButtonRef = ref;
                let refItem: RefObject<HTMLComponent> = Ginkgo.createRef();
                let contentCls = [TabPanel.tabPanelClsInnerContent];
                if (tab.model.action != true) {
                    contentCls.push(TabPanel.tabPanelClsHidden);
                }
                tabItemNodes.push(
                    <div ref={refItem}
                         className={contentCls}>
                        {tab.model && tab.model.content ? tab.model.content : undefined}
                    </div>);
                tab.ref = refItem;
                index++;
            }
        }

        if (this.props.headerAlign == "right" || this.props.headerAlign == "bottom") {
            bodyEls.push(
                <div ref={this.tabInnerRef} className={TabPanel.tabPanelClsInner}>
                    {tabItemNodes}
                </div>
            );
            bodyEls.push(
                <div className={TabPanel.tabPanelClsHeader}>
                    <div style={headerBodyStyle} className={TabPanel.tabPanelClsHeaderBody}>
                        {tabsEls}
                    </div>
                </div>
            );
        } else {
            bodyEls.push(
                <div className={TabPanel.tabPanelClsHeader}>
                    <div style={headerBodyStyle} className={TabPanel.tabPanelClsHeaderBody}>
                        {tabsEls}
                    </div>
                </div>
            );
            bodyEls.push(
                <div ref={this.tabInnerRef} className={TabPanel.tabPanelClsInner}>
                    {tabItemNodes}
                </div>
            );
        }

        return (
            <div className={tabPanelCls}>
                {bodyEls}
            </div>
        )
    }

    protected onAfterDrawing() {
        this.resetHeaderAlign();
        this.recalTabPosition();
    }

    componentChildChange(children: Array<GinkgoElement>, old: Array<GinkgoElement>): void {
        this.redrawing();
    }

    protected onTabClickSetting(tab: TabModelWrapper) {
        if (this.tabs) {
            this.clickHistory.splice(this.clickHistory.indexOf(tab.model), 1);
            this.clickHistory.push(tab.model);
            for (let ti of this.tabs) {
                if (ti == tab) {
                    ti.model.action = true;
                } else {
                    ti.model.action = false;
                }
            }

            for (let ti of this.tabs) {
                let tab = ti.ref;
                if (tab instanceof HTMLComponent) {
                    let el = tab.dom;
                    if (el && el instanceof HTMLElement) {
                        if (!ti.model.action) {
                            el.style.display = "none";
                        } else {
                            el.style.display = null;
                        }
                    }
                }
            }
        }
    }

    private closeTab(e: Event, tab: TabModelWrapper) {
        let hasAction = false;
        if (this.tabs != null) {
            this.tabs.splice(this.tabs.indexOf(tab), 1);
            this.clickHistory.splice(this.clickHistory.indexOf(tab.model), 1);
            for (let tab of this.tabs) {
                if (tab.model.action) {
                    hasAction = true;
                    break;
                }
            }
        }

        let rms = [];
        for (let history of this.clickHistory) {
            let has = false;
            for (let tab of this.tabs) {
                if (history == tab) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                rms.push(history);
            }
        }

        for (let rm of rms) {
            this.clickHistory.splice(this.clickHistory.indexOf(rm), 1);
        }

        if (!hasAction) {
            if (this.clickHistory && this.clickHistory.length > 0) {
                this.clickHistory[this.clickHistory.length - 1].action = true;
            } else {
                this.tabs[this.tabs.length - 1].model.action = true;
            }
        }

        if (this.props.onCloseClick) {
            this.props.onCloseClick(e, tab.model);
        } else {
            this.resetHeaderAlign();
            this.recalTabPosition();
        }
    }

    private recalTabPosition() {
        if (this.tabs && this.tabs.length > 0) {
            let totalWidth = 0, totalHeight = 0, index = 0;
            for (let tab of this.tabs) {
                let element = tab.tabButtonRef && tab.tabButtonRef.instance ? tab.tabButtonRef.instance.dom as HTMLElement : undefined;
                if (element) {
                    let width = element.offsetWidth,
                        height = element.offsetHeight;
                    if (totalWidth != 0) totalWidth += tabItemSplitWidth;
                    if (totalHeight != 0) totalHeight += tabItemSplitWidth;
                    index++;

                    if (this.headerAlign == "right" || this.headerAlign == "left") {
                        if (this.headerRotation == "deg90" || this.headerRotation == "deg270") {
                            if (this.headerRotation == "deg90") {
                                element.style.top = totalWidth + "px";
                                element.style.left = height + "px";

                                totalWidth += width;
                                totalHeight += height;
                            }
                            if (this.headerRotation == "deg270") {
                                totalWidth += width;
                                totalHeight += height;

                                element.style.top = totalWidth + "px";
                                element.style.left = undefined;
                            }
                        } else {
                            element.style.top = totalHeight + "px";
                            element.style.left = undefined;

                            totalWidth += width;
                            totalHeight += height;
                        }
                    } else {
                        if (this.headerRotation == "deg90" || this.headerRotation == "deg270") {
                            if (this.headerRotation == "deg90") {
                                totalWidth += width;
                                totalHeight += height;

                                element.style.left = totalHeight + "px";
                                element.style.top = undefined;
                            }

                            if (this.headerRotation == "deg270") {
                                element.style.left = totalHeight + "px";
                                element.style.top = width + "px";

                                totalWidth += width;
                                totalHeight += height;
                            }
                        } else {
                            element.style.left = totalWidth + "px";
                            element.style.top = undefined;

                            totalWidth += width;
                            totalHeight += height;
                        }
                    }
                }
            }
        }
    }

    private resetHeaderAlign() {
        let width = 0,
            headerBodyStyle: CSSProperties = {...this.headerBodyStyle};
        if (this.tabs) {
            this.tabs.map(value => {
                let ref = value.tabButtonRef,
                    el = ref && ref.instance ? ref.instance.dom as HTMLElement : undefined;
                if (el) {
                    if (width < el.offsetWidth) {
                        width = el.offsetWidth;
                    }
                }
            });
        }
        if (this.headerAlign == "right") {
            if (this.headerRotation == "deg90" || this.headerRotation == "deg270") {
                headerBodyStyle.width = undefined;
                headerBodyStyle.height = undefined;
            } else {
                headerBodyStyle.width = width;
                headerBodyStyle.height = undefined;
            }
        } else if (this.headerAlign == "left") {
            if (this.headerRotation == "deg90" || this.headerRotation == "deg270") {
                headerBodyStyle.width = undefined;
                headerBodyStyle.height = undefined;
            } else {
                headerBodyStyle.width = width;
                headerBodyStyle.height = undefined;
            }
        } else if (this.headerAlign == "bottom") {
            if (this.headerRotation == "deg90" || this.headerRotation == "deg270") {
                headerBodyStyle.height = width;
                headerBodyStyle.width = undefined;
            } else {
                headerBodyStyle.width = undefined;
                headerBodyStyle.height = undefined;
            }
        } else {
            if (this.headerRotation == "deg90" || this.headerRotation == "deg270") {
                headerBodyStyle.height = width;
                headerBodyStyle.width = undefined;
            } else {
                headerBodyStyle.height = undefined;
                headerBodyStyle.width = undefined;
            }
        }

        this.headerBodyStyle = headerBodyStyle;
    }

    protected compareUpdate(key: string, newValue: any, oldValue: any): boolean {
        if (key == "models" && newValue != oldValue) {
            let tabs: Array<TabModelWrapper> = [];
            for (let v of newValue) {
                tabs.push({model: v});
            }
            this.tabs = tabs;
            return true;
        }
        return false;
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(TabPanel.tabPanelCls);

        if (this.headerAlign == "right") {
            arr.push(TabPanel.tabPanelClsRight);
        } else if (this.headerAlign == "left") {
            arr.push(TabPanel.tabPanelClsLeft);
        } else if (this.headerAlign == "bottom") {
            arr.push(TabPanel.tabPanelClsBottom);
        } else {

        }

        if (this.props.border) {
            arr.push(TabPanel.tabPanelBorderCls);
        }
        return arr;
    }
}
