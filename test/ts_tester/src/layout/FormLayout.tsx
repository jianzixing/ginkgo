import Ginkgo, {CSSProperties, GinkgoElement, GinkgoNode} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import FormField from "../form/FormField";
import Container from "../component/Container";
import Icon from "../icon/Icon";
import "./FormLayout.scss";

export interface FormLayoutProps extends ComponentProps {
    // 列数量
    column?: number;
    // 间距
    spacingH?: number;
    spacingV?: number;
    padding?: boolean | string | number;
    scroll?: "x" | "y" | "xy" | "auto" | "autoX" | "autoY" | boolean;
    bodyWidth?: number;
    bodyHeight?: number;
    bodyStyle?: CSSProperties;
}

export default class FormLayout extends Container<FormLayoutProps> {
    protected static formLayoutCls;
    protected static formLayoutBody;
    protected static formLayoutHiddenBody;
    protected static formLayoutPaddingCls;
    protected static formLayoutAXCls;
    protected static formLayoutAYCls;
    protected static formLayoutXCls;
    protected static formLayoutYCls;
    protected static formItemCls;
    protected static formItemFieldCls;
    protected static formItemRowCls;
    protected static formItemCellCls;

    protected cellWidth?: number;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        FormLayout.formLayoutCls = this.getThemeClass("form-layout");
        FormLayout.formLayoutBody = this.getThemeClass("form-layout-body");
        FormLayout.formLayoutHiddenBody = this.getThemeClass("form-layout-hidden-body");
        FormLayout.formLayoutPaddingCls = this.getThemeClass("form-layout-padding");
        FormLayout.formLayoutAXCls = this.getThemeClass("form-layout-scroll-ax");
        FormLayout.formLayoutAYCls = this.getThemeClass("form-layout-scroll-ay");
        FormLayout.formLayoutXCls = this.getThemeClass("form-layout-scroll-x");
        FormLayout.formLayoutYCls = this.getThemeClass("form-layout-scroll-y");
        FormLayout.formItemCls = this.getThemeClass("form-item");
        FormLayout.formItemFieldCls = this.getThemeClass("form-item-field");
        FormLayout.formItemRowCls = this.getThemeClass("form-item-row");
        FormLayout.formItemCellCls = this.getThemeClass("form-item-cell");
    }

    protected drawing(): GinkgoElement<any> | string | undefined | null | GinkgoElement[] {
        let childrenEls: GinkgoElement[] = [],
            columnCount = this.props.column || 1,
            spacingH = this.props.spacingH == null ? 10 : this.props.spacingH,
            rowEls = [],
            cellEls = [],
            width = this.rootEl.width,

            childSplits: Array<Array<any>> = [];

        if (this.children) {
            let newChild = [], hiddenChild = [];
            for (let c of this.children) {
                if (c instanceof FormLayoutTitle) {
                    if (newChild.length > 0) {
                        childSplits.push(newChild);
                    }
                    newChild = [];
                    newChild.push(c);
                } else {
                    let isHidden = false;
                    if (c instanceof Component) {
                        if (c.getHidden()) {
                            hiddenChild.push(c);
                            isHidden = true;
                        }
                    }
                    if (!isHidden) {
                        newChild.push(c);
                    }
                }
            }
            childSplits.push(newChild);

            let styleItem: CSSProperties = {};
            if (this.props.spacingV != null) {
                styleItem.marginBottom = this.props.spacingV;
            } else {
                styleItem.marginBottom = 10;
            }

            let bodys = [];
            for (let children of childSplits) {
                for (let c of children) {
                    if (c instanceof FormLayoutTitle) {
                        bodys.push(c.props);
                    } else {
                        if (c instanceof FormField) {
                            c.addRootClassName(FormLayout.formItemFieldCls);
                        }
                        if (columnCount == 1) {
                            childrenEls.push(
                                <div className={FormLayout.formItemCls} style={styleItem}>{c.props}</div>
                            );
                        } else {
                            cellEls.push(c.props);
                        }
                    }
                }

                let c = 0, num = -1, spacingItem = spacingH / 2,
                    cellWidth = (width - (columnCount - 1) * spacingH) / columnCount;
                if (columnCount > 1) {
                    for (let cell of cellEls) {
                        let style: CSSProperties = {};
                        if (c % columnCount == 0) {
                            style.paddingRight = spacingItem;
                        } else {
                            if ((c + 1) % columnCount == 0) {
                                style.paddingLeft = spacingItem;
                            } else {
                                style.paddingRight = spacingItem;
                                style.paddingLeft = spacingItem;
                            }
                        }
                        style.width = cellWidth;
                        let cellStruts = (
                            <div className={FormLayout.formItemCellCls} style={style}>
                                {cell}
                            </div>
                        );
                        if (c % columnCount == 0) {
                            rowEls.push([cellStruts]);
                            num++;
                        } else {
                            let arr = rowEls[num];
                            arr.push(cellStruts);
                        }
                        c++;
                    }
                }

                if (rowEls && rowEls.length > 0) {
                    let rows = [];
                    for (let row of rowEls) {
                        rows.push(
                            <div className={FormLayout.formItemRowCls} style={styleItem}>
                                {row}
                            </div>
                        )
                    }
                    childrenEls.push(
                        <div className={FormLayout.formItemCls} style={styleItem}>
                            {rows}
                        </div>
                    );
                }

                let style: CSSProperties = this.props.bodyStyle || {};
                if (this.props.bodyWidth) {
                    style.width = this.props.bodyWidth;
                }
                if (this.props.bodyHeight) {
                    style.height = this.props.bodyHeight;
                }

                bodys.push(
                    <div className={FormLayout.formLayoutBody} style={style}>
                        {childrenEls}
                    </div>
                );
            }

            if (hiddenChild && hiddenChild.length > 0) {
                let childProps = [];
                hiddenChild.map(value => childProps.push(value.props));
                bodys.push(
                    <div className={FormLayout.formLayoutHiddenBody}>
                        {childProps}
                    </div>
                )
            }
            return bodys;
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(FormLayout.formLayoutCls);
        if (this.props.scroll == true
            || this.props.scroll == "auto"
            || this.props.scroll == null) {
            arr.push(FormLayout.formLayoutAXCls);
            arr.push(FormLayout.formLayoutAYCls);
        }
        if (this.props.scroll == "xy") {
            arr.push(FormLayout.formLayoutXCls);
            arr.push(FormLayout.formLayoutYCls);
        }
        if (this.props.scroll == "autoX") {
            arr.push(FormLayout.formLayoutAXCls);
        }
        if (this.props.scroll == "x") {
            arr.push(FormLayout.formLayoutXCls);
        }
        if (this.props.scroll == "autoY") {
            arr.push(FormLayout.formLayoutAYCls);
        }
        if (this.props.scroll == "y") {
            arr.push(FormLayout.formLayoutYCls);
        }
        if (this.props.padding != false) {
            let padding = this.props.padding;
            if (typeof padding == "string") {

            } else {
                arr.push(FormLayout.formLayoutPaddingCls);
            }
        }
        return arr;
    }

    protected getRootStyle(): CSSProperties {
        let style = super.getRootStyle();
        let padding = this.props.padding;
        if (typeof padding == "string") {
            let str = padding.split(" ");
            if (str.length == 1) {
                style.padding = parseInt(str[0]);
            }
            if (str.length == 2) {
                style.paddingTop = parseInt(str[0]);
                style.paddingBottom = parseInt(str[0]);
                style.paddingLeft = parseInt(str[1]);
                style.paddingRight = parseInt(str[1]);
            }
            if (str.length == 3) {
                style.paddingTop = parseInt(str[0]);
                style.paddingBottom = parseInt(str[2]);
                style.paddingLeft = parseInt(str[1]);
                style.paddingRight = parseInt(str[1]);
            }
            if (str.length == 4) {
                style.paddingTop = parseInt(str[0]);
                style.paddingBottom = parseInt(str[2]);
                style.paddingLeft = parseInt(str[3]);
                style.paddingRight = parseInt(str[1]);
            }
        }
        if (typeof padding == "number") {
            style.padding = padding;
        }
        return style;
    }

    doLayout(): void {
        this.redrawing();
    }
}

export interface FormLayoutTitleProps extends ComponentProps {
    title?: GinkgoNode;
    text?: GinkgoNode;
    icon?: string;
    iconType?: string;
}

export class FormLayoutTitle<P extends FormLayoutTitleProps> extends Component<P> {
    protected static formLayoutTitleCls;
    protected static formLayoutTitleImgCls;
    protected static formLayoutTitleTextCls;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        FormLayoutTitle.formLayoutTitleCls = this.getThemeClass("form-layout-title");
        FormLayoutTitle.formLayoutTitleImgCls = this.getThemeClass("form-layout-title-img");
        FormLayoutTitle.formLayoutTitleTextCls = this.getThemeClass("form-layout-title-text");
    }

    protected drawing(): GinkgoNode | GinkgoElement[] {
        if (this.props.title) {
            return this.props.title;
        } else {
            let icon;
            if (this.props.icon) {
                icon = <img src={this.props.icon}/>;
            } else if (this.props.iconType) {
                icon = <Icon icon={this.props.iconType}/>;
            }
            return [
                <div className={FormLayoutTitle.formLayoutTitleImgCls}>
                    {icon}
                </div>,
                <div className={FormLayoutTitle.formLayoutTitleTextCls}>
                    {this.props.text || "Form Title"}
                </div>
            ];
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(FormLayoutTitle.formLayoutTitleCls);
        return arr;
    }
}
