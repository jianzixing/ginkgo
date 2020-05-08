import Ginkgo, {CSSProperties, GinkgoElement, GinkgoNode, HTMLComponent} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import Moving, {MovingPoint} from "../dragdrop/Moving";
import {tableCellTypes} from "./TableCell";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import Menu, {MenuModel, MenuProps, MenuShowing} from "../menu/Menu";
import "./TableColumn.scss";
import {ActionColumnItem, CellEditing} from "./TableRow";

export interface TableColumnModel {
    type?: tableCellTypes;
    width?: number;
    title?: string;
    dataIndex?: string;
    show?: boolean;
    checked?: boolean;
    sort?: "asc" | "desc";
    textAlign?: "left" | "center";
    /*宽度占比*/
    flex?: number;
    style?: CSSProperties;
    className?: string;
    children?: Array<TableColumnModel>;
    editing?: CellEditing;
    render?: (data: any, column: TableColumnModel) => GinkgoNode;

    // type="actioncolumn" 时有效
    items?: Array<ActionColumnItem>;
}

export interface GridColumnProps extends ComponentProps {
    onColumnStartResize?: (point: MovingPoint, column: TableColumnModel | undefined) => void;
    onColumnFinishResize?: (point: MovingPoint, column: TableColumnModel | undefined, newWidth: number) => void;
    onColumnResize?: (point: MovingPoint, column: TableColumnModel | undefined) => void;
    columns: Array<TableColumnModel>;
    column: TableColumnModel;
    onColumnChange: (type: "sortAsc" | "sortDesc" | "toggleColumns" | "checked", data: TableColumnModel) => void;
    // current column resize min width , default 40px
    minWidth?: number;
    columnSpace?: boolean;
}

export default class TableColumn<P extends GridColumnProps> extends Component<P> {

    protected static gridClsColumn;
    protected static columnClsBody;
    protected static columnClsBodyBorder;
    protected static columnClsAlignLeft;
    protected static columnClsAlignCenter;
    protected static columnClsInner;
    protected static columnClsText;
    protected static columnClsTextInner;
    protected static columnClsTextTitle;
    protected static columnClsCheckbox;
    protected static columnClsTrigger;
    protected static columnClsTriggerInner;
    protected static columnClsResize;
    protected static columnClsSort;

    protected isTriggerSelected: boolean = false;
    protected columnTrigger: HTMLComponent;
    protected columnBodyEl: HTMLComponent;
    protected menuItemModels?: Array<MenuModel>;
    protected showingModal?: MenuShowing;

    private _isResizing: boolean = false;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TableColumn.gridClsColumn = this.getThemeClass("column-header");
        TableColumn.columnClsBody = this.getThemeClass("column-header-body");
        TableColumn.columnClsBodyBorder = this.getThemeClass("column-header-border");
        TableColumn.columnClsAlignLeft = this.getThemeClass("column-header-align-left");
        TableColumn.columnClsAlignCenter = this.getThemeClass("column-header-align-center");
        TableColumn.columnClsInner = this.getThemeClass("column-header-inner");
        TableColumn.columnClsText = this.getThemeClass("column-header-text");
        TableColumn.columnClsTextInner = this.getThemeClass("column-header-text-inner");
        TableColumn.columnClsTextTitle = this.getThemeClass("column-header-text-title");
        TableColumn.columnClsCheckbox = this.getThemeClass("column-checkbox");
        TableColumn.columnClsTrigger = this.getThemeClass("column-header-trigger");
        TableColumn.columnClsTriggerInner = this.getThemeClass("column-header-trigger-inner");
        TableColumn.columnClsResize = this.getThemeClass("column-resize");
        TableColumn.columnClsSort = this.getThemeClass("column-sort");
    }

    protected drawing(): GinkgoElement | undefined | null {
        let column: TableColumnModel | undefined = this.props.column,
            columnWidth = column && column.width ? column.width : 120,
            text = column && column.title ? <span>{column.title}</span> : <span>&nbsp;</span>,
            extEls: Array<GinkgoElement> = [],
            contentBodyEls;

        if (column && column.type == "rownumber") {
            contentBodyEls = (
                <div className={TableColumn.columnClsInner}>
                    <div className={TableColumn.columnClsText}>
                        <div className={TableColumn.columnClsTextInner}>
                            <span>&nbsp;</span>
                        </div>
                    </div>
                </div>
            )
        } else if (column && column.type == "checkbox") {
            contentBodyEls = (
                <div className={TableColumn.columnClsInner}
                     onClick={() => {
                         if (column) {
                             if (column.checked == true) {
                                 column.checked = false;
                             } else {
                                 column.checked = true;
                             }
                             if (this.props.onColumnChange) {
                                 this.props.onColumnChange("checked", column);
                             }
                         }
                     }}>
                    <div className={TableColumn.columnClsText}>
                        <div className={TableColumn.columnClsTextInner} style={{position: "relative", top: "1px"}}>
                            <Icon
                                icon={column.checked == true ? IconTypes._extCheckedSel : IconTypes._extCheckedUnset}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            if (column && column.sort == 'asc') {
                extEls.push(<span key={1} className={TableColumn.columnClsSort}>
                    <Icon icon={IconTypes.longArrowAltUp}/></span>);
            }
            if (column && column.sort == 'desc') {
                extEls.push(<span key={2} className={TableColumn.columnClsSort}>
                    <Icon icon={IconTypes.longArrowAltDown}/></span>);
            }

            if (this.props) {

                let triggerEl;
                if (!this.props.column || this.props.column.type != "actioncolumn") {
                    triggerEl = (
                        <div
                            ref={component => this.columnTrigger = component}
                            className={TableColumn.columnClsTrigger}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.onColumnTriggerClick();
                            }}>
                            <div className={TableColumn.columnClsTriggerInner}>
                                <Icon icon={IconTypes.caretDown}/>
                            </div>
                        </div>
                    );
                }

                contentBodyEls = (
                    <div
                        className={TableColumn.columnClsInner}
                        // style={{width: column ? column.width : 120}}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            if (!this.props.column || this.props.column.type != "actioncolumn") {
                                let column = this.props.column,
                                    columns = this.props.columns;
                                if (column) {
                                    if (column.sort == "desc" || !column.sort) {
                                        if (columns) columns.map(v => v.sort = undefined);
                                        column.sort = "asc";
                                        if (this.props.onColumnChange) {
                                            this.props.onColumnChange("sortAsc", column);
                                        }
                                    } else {
                                        if (columns) columns.map(v => v.sort = undefined);
                                        column.sort = "desc";
                                        if (this.props.onColumnChange) {
                                            this.props.onColumnChange("sortDesc", column);
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        <div className={TableColumn.columnClsText}>
                            <div className={TableColumn.columnClsTextInner}>
                                <div className={TableColumn.columnClsTextTitle}>
                                    {text}
                                    {extEls}
                                </div>
                            </div>
                            {/* other elements */}
                        </div>
                        {triggerEl}

                        <Moving
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onMoving={point => {
                                if (point.moveX > 0 && point.startX > 0) {
                                    let width = this.getWidth() || 0,
                                        minWidth = this.props.minWidth || 40,
                                        newWidth = width + (point.moveX - point.startX);

                                    if (newWidth > minWidth) {
                                        if (this.props.onColumnResize) {
                                            this.props.onColumnResize(point, this.props.column);
                                        }
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                                return true;
                            }}
                            onStartMoving={point => {
                                if (this.props.onColumnStartResize) {
                                    this.props.onColumnStartResize(point, this.props.column);
                                }
                            }}
                            onFinishMoving={(point) => {
                                let width = this.getWidth() || 0,
                                    newWidth = width + (point.moveX - point.startX);

                                if (this.props.onColumnFinishResize) {
                                    this.props.onColumnFinishResize(point, this.props.column, newWidth);
                                }
                            }}
                            className={TableColumn.columnClsResize}
                        />
                    </div>
                )
            }

        }
        let columnBodyClass = [TableColumn.columnClsBody];
        if (this.props.columnSpace != false) {
            columnBodyClass.push(TableColumn.columnClsBodyBorder);
        }
        return (
            <div
                ref={component => this.columnBodyEl = component}
                className={columnBodyClass}
                style={{width: columnWidth}}
            >
                {contentBodyEls}
            </div>)
    }

    protected onMouseEnter(e: Event) {
        if (!this._isResizing) {
            if (!this.props.column || this.props.column.type != "actioncolumn") {
                super.onMouseEnter(e);
                this.setHovered(true);
            } else {
                this.setHovered(true);
            }
        }
    }

    protected onMouseLeave(e: Event) {
        if (!this._isResizing) {
            if (!this.props.column || this.props.column.type != "actioncolumn") {
                super.onMouseLeave(e);
                if (this.isTriggerSelected == false) {
                    this.setHovered(false);
                }
            } else {
                if (this.isTriggerSelected == false) {
                    this.setHovered(false);
                }
            }
        }
    }

    protected createMenuItems() {
        let columnItems: Array<TableColumnModel> = this.props.columns ? [...this.props.columns] : [];

        return [
            {iconType: IconTypes._extSortAlphaAsc, type: "1", text: "Sort Ascending"},
            {iconType: IconTypes._extSortAlphaDesc, type: "2", text: "Sort Descending"},
            {
                iconType: IconTypes._extColumns, text: "Columns",
                children: this.createColumnMenuItems(columnItems)
            }
        ]
    }

    protected createColumnMenuItems(columnItems: Array<TableColumnModel>): Array<MenuModel> {
        let columns: Array<MenuModel> = [];

        if (columnItems) {
            columnItems = columnItems.filter(value => {
                return value.type != "rownumber" && value.type != "checkbox";
            });
            let len = columnItems.length, showLen = 0;
            for (let ci of columnItems) {
                if (ci.show != false) showLen++;
            }

            for (let ci of columnItems) {
                let children;
                if (ci.children && ci.children.length > 0) {
                    children = this.createColumnMenuItems([...ci.children]);
                }

                if (ci.show != false) {
                    columns.push({
                        iconType: IconTypes.checkSquare,
                        type: "5",
                        text: ci.title || (ci.type == "actioncolumn" ? "Actions" : ""),
                        data: ci,
                        disabled: 1 == showLen,
                        children: children
                    });
                }
                if (ci.show == false) {
                    columns.push({
                        iconType: IconTypes.square,
                        type: "5",
                        text: ci.title || "",
                        data: ci,
                        children: children
                    });
                }
            }
        }

        return columns;
    }

    protected onColumnTriggerClick() {
        if (!this.isTriggerSelected) {
            this.setSelected(true);
            this.isTriggerSelected = true;

            let columnTrigger = this.columnTrigger.dom as HTMLElement;
            if (columnTrigger) {
                let xy = this.getBounds(columnTrigger);

                if (this.showingModal) {
                    this.showingModal.close();
                    this.showingModal = undefined;
                }
                Menu.closeAllMenus();

                this.menuItemModels = this.createMenuItems();

                this.showingModal = Menu.show(<Menu
                    x={xy.x + 1}
                    y={xy.y + xy.h}
                    clickCloseMenu={false}
                    items={this.menuItemModels}
                    onMenuItemClick={(e: Event, value: MenuModel, menu: Menu<MenuProps>) => {
                        if (!value.children || value.type == "5") {
                            let column = this.props.column,
                                columns = this.props.columns;
                            if (value.type == "1") {
                                this.closeGridColumnMenus(true);
                                if (column && column.sort != "asc") {
                                    if (columns) columns.map(v => v.sort = undefined);
                                    column.sort = "asc";

                                    if (this.props.onColumnChange) {
                                        this.props.onColumnChange("sortAsc", column);
                                    }
                                }
                            }
                            if (value.type == "2") {
                                this.closeGridColumnMenus(true);
                                if (column && column.sort != "desc") {
                                    if (columns) columns.map(v => v.sort = undefined);
                                    column.sort = "desc";
                                    if (this.props.onColumnChange) {
                                        this.props.onColumnChange("sortDesc", column);
                                    }
                                }
                            }
                            if (value.type == "5") {
                                let data: TableColumnModel = value.data;
                                if (data && data.show == false) data.show = true;
                                else data.show = false;

                                if (data.show == false) {
                                    value.iconType = IconTypes.square;
                                } else {
                                    value.iconType = IconTypes.checkSquare;
                                }
                                if (this.showingModal && this.menuItemModels) {
                                    this.menuItemModels = [...this.menuItemModels];
                                    this.checkMenuItemModels(this.menuItemModels);
                                    if (this.showingModal.component) {
                                        this.showingModal.component.update("items", this.menuItemModels);
                                    }
                                }

                                if (this.props.onColumnChange) {
                                    this.props.onColumnChange("toggleColumns", data);
                                }
                            }
                        }
                    }}
                    onMenuClose={e => {
                        this.isTriggerSelected = false;
                        this.setSelected(false);
                        this.setHovered(false);
                        this.showingModal = undefined;
                    }}/>
                );
            }
        } else {
            this.closeGridColumnMenus(true);
            this.setHovered(true)
        }
    }

    protected closeGridColumnMenus(hovered: boolean = false) {
        this.setSelected(false);
        this.isTriggerSelected = false;
        if (this.isOnHovered != hovered) this.setHovered(hovered);

        if (this.showingModal) {
            this.showingModal.close();
            this.showingModal = undefined;
        }
    }

    protected checkMenuItemModels(menuModels: Array<MenuModel>) {
        if (menuModels) {
            let totalShowCount = 0;
            for (let model of menuModels) {
                model.disabled = false;
                if (model.type == "5" && model.iconType == IconTypes.checkSquare) {
                    totalShowCount++;
                }
                if (model.children && model.children.length > 0) {
                    this.checkMenuItemModels(model.children);
                }
            }
            if (totalShowCount == 1) {
                for (let model of menuModels) {
                    if (model.type == "5" && model.iconType == IconTypes.checkSquare) {
                        model.disabled = true;
                    }
                }
            }
        }
    }

    protected getRootClassName(): string[] {
        let column: TableColumnModel | undefined = this.props.column;

        let arr = super.getRootClassName();
        arr.push(TableColumn.gridClsColumn);

        if (column && column.type == "rownumber") {

        } else if (column && column.type == "checkbox") {
            arr.push(TableColumn.columnClsCheckbox);
        }
        return arr;
    }

    set isResizing(value: boolean) {
        this._isResizing = value;
    }
}
