import Ginkgo, {GinkgoElement, GinkgoNode, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import "./TableColumnGroup.scss";
import TableColumn, {TableColumnModel} from "./TableColumn";
import Component, {ComponentProps,} from "../component/Component";
import {MovingPoint} from "../dragdrop/Moving";
import {getCellWidth, getFixCellWidth, isFixCellWidth} from "./TableCell";

export interface TableColumnGroupProps extends ComponentProps {
    columns: Array<TableColumnModel>;
    columnResizeLineRef?: RefObject<HTMLComponent>;
    columnPositionRef?: RefObject<HTMLComponent>;
    onColumnResize?: (type: "start" | "finish", column: TableColumnModel | undefined, oldWidth: number) => void;
    onColumnMenuChange?: (type: string, data: TableColumnModel) => void;
    columnSpace?: boolean;
    // 列填充满整行
    fit?: boolean;
    // 计算填充满时的宽度
    fitBaseRef?: RefObject<HTMLComponent>;
    tableWidth?: number;
}

export default class TableColumnGroup<P extends TableColumnGroupProps> extends Component<P> {
    protected static tableClsColumn;
    protected static tableClsColumnBody;
    protected static tableClsColumnInner;
    protected static tableClsColumnGroupMerge;
    protected static tableClsColumnGroupHeader;
    protected static tableClsColumnGroupBody;
    protected static tableClsColumnGroupHidden;

    protected bodyBounds: any;
    protected columnGroupInnerEl: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected tableColumnBodyRef: RefObject<HTMLComponent> = Ginkgo.createRef();

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TableColumnGroup.tableClsColumn = this.getThemeClass("column-group");
        TableColumnGroup.tableClsColumnBody = this.getThemeClass("column-group-body");
        TableColumnGroup.tableClsColumnInner = this.getThemeClass("column-group-inner");
        TableColumnGroup.tableClsColumnGroupMerge = this.getThemeClass("column-group-header-merge");
        TableColumnGroup.tableClsColumnGroupHeader = this.getThemeClass("column-group-header");
        TableColumnGroup.tableClsColumnGroupBody = this.getThemeClass("column-group-header-inner");
        TableColumnGroup.tableClsColumnGroupHidden = this.getThemeClass("column-group-hidden");
    }

    protected drawing(): GinkgoElement | undefined | null {
        let columns: Array<TableColumnModel> = this.props.columns || [],
            columnNodes: Array<GinkgoNode> = [],
            checkboxColumnCount = 0;

        columns.map((value, index) => {
            value.width = getCellWidth(value);
            if (value.type == "checkbox") {
                checkboxColumnCount++;
                if (checkboxColumnCount > 1) {
                    throw new Error("checkbox column only set once");
                }
            }
            if (value.show == undefined) value.show = true;
        });

        let totalRealWidth = this.calColumnWidth(columns),
            totalWidth = this.props.tableWidth; // 初始值留作多余使用,比如滚动条宽度

        columns.map((value, index) => {
            columnNodes.push(this.buildTableColumns(value, index));
        });

        return (
            <div
                ref={this.tableColumnBodyRef}
                className={TableColumnGroup.tableClsColumnBody}
                style={{width: totalWidth + "px"}}
            >
                <div
                    ref={this.columnGroupInnerEl}
                    className={TableColumnGroup.tableClsColumnInner}
                    style={{width: totalRealWidth + "px"}}
                >
                    {columnNodes}
                </div>
            </div>
        )
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();

        Ginkgo.forEachChildren(component => {
            if (component instanceof TableColumn) {
                component.isResizing = false;
            }
        }, this);
    }

    calGroupColumnWidth() {
        if (this.props.fitBaseRef) {
            let columns = this.props.columns;
            if (columns && columns.length > 0) {
                let width = this.props.fitBaseRef.instance.clientWidth;
                if (width > 0) {
                    let hasFlex = false;
                    let totalWidth = 0, flexTotal = 0;
                    for (let c of columns) {
                        if (c.flex > 0) {
                            hasFlex = true;
                            flexTotal += c.flex;
                        } else {
                            if (!isFixCellWidth(c.type)) {
                                totalWidth += c.width;
                            } else {
                                width -= getFixCellWidth(c.type);
                            }
                        }
                    }
                    if (hasFlex) {
                        let diff = width - totalWidth;
                        for (let c of columns) {
                            if (c.flex > 0) {
                                c.width = Math.round(diff / flexTotal * c.flex);
                            }
                        }
                    } else {
                        for (let c of columns) {
                            if (!isFixCellWidth(c.type)) {
                                c.width = Math.round(width / totalWidth * c.width);
                            }
                        }
                    }
                }
            }
        }
    }

    private calColumnWidth(columns: Array<TableColumnModel>, last: boolean = false): number {
        let totalWidth = 0;
        columns.map(value => {
            if (value.show != false) {
                let children = value.children;
                if (children && !last) {
                    let totalChildrenWidth = this.calColumnWidth(children, true);
                    totalWidth += totalChildrenWidth;
                    value.width = totalChildrenWidth;
                } else {
                    totalWidth += (value.width || 120);
                }
            }
        });
        return totalWidth;
    }

    private buildTableColumns(value: TableColumnModel, index: number) {
        let columns: Array<TableColumnModel> = this.props.columns || [],
            children: Array<TableColumnModel> | undefined = value.children,
            tableColumnGroupBodyCls = [TableColumnGroup.tableClsColumnGroupBody];

        if (children) {
            let childColumns: Array<GinkgoNode> = [],
                totalWidth = 0;

            children.map((cv, ci) => {
                if (cv.show != false) {
                    totalWidth += cv.width || 120;
                    childColumns.push(
                        this.buildChildrenTableColumns(cv, "c" + index + "-" + ci)
                    )
                }
            });
            if (value.show == false) {
                tableColumnGroupBodyCls.push(TableColumnGroup.tableClsColumnGroupHidden);
            }

            return (
                <div
                    key={"btc" + index}
                    className={tableColumnGroupBodyCls.join(" ")}
                    style={{width: totalWidth}}
                >
                    <div
                        className={TableColumnGroup.tableClsColumnGroupMerge}
                        style={{width: totalWidth}}
                    >
                        {this.buildChildrenTableColumns(value, "c" + index)}
                    </div>
                    <div
                        className={TableColumnGroup.tableClsColumnGroupHeader}
                        style={{width: totalWidth}}
                    >
                        {childColumns}
                    </div>
                </div>
            );
        } else {
            return (this.buildChildrenTableColumns(value, "" + index));
        }
    }

    private buildChildrenTableColumns(value: TableColumnModel, key: string) {
        let columns: Array<TableColumnModel> = this.props.columns || [],
            children = value.children;

        return (
            <TableColumn
                columns={columns}
                column={value}
                columnSpace={this.props.columnSpace}
                hidden={value.show == false}
                onColumnStartResize={(point, column) => {
                    this.onColumnStartResize(point, column);
                }}
                onColumnResize={(point, column) => {
                    this.onColumnResize(point, column);
                }}
                onColumnFinishResize={((point, column, newWidth) => {
                    this.onColumnFinishResize(column, newWidth);
                })}
                onColumnChange={(type: string, data: TableColumnModel) => {
                    if (this.props.onColumnMenuChange) {
                        this.props.onColumnMenuChange(type, data);
                    }
                }}
            />);
    }

    private onColumnStartResize(point: MovingPoint, column: TableColumnModel | undefined) {
        if (this.props.columnResizeLineRef && this.props.columnPositionRef
            && this.props.columnResizeLineRef.instance && this.props.columnPositionRef.instance) {
            let columnLineRef = this.props.columnResizeLineRef.instance.dom as HTMLElement;
            let columnPositionRef = this.props.columnPositionRef.instance.dom as HTMLElement;
            this.bodyBounds = this.getBounds(columnPositionRef);
            if (columnLineRef) {
                columnLineRef.style.display = "block";
                columnLineRef.style.left = (point.startX - this.bodyBounds.x) + "px";
            }

            Ginkgo.forEachChildren(component => {
                if (component instanceof TableColumn) {
                    component.isResizing = true;
                }
            }, this);

            if (this.props.onColumnResize) {
                this.props.onColumnResize("start", column, null);
            }
        }
    }

    private onColumnResize(point: MovingPoint, column: TableColumnModel | undefined) {
        if (this.props.columnResizeLineRef && this.props.columnPositionRef
            && this.props.columnResizeLineRef.instance && this.props.columnPositionRef.instance) {
            let columnLineRef = this.props.columnResizeLineRef.instance.dom as HTMLElement;
            if (columnLineRef && point && this.bodyBounds) {
                let x = point.x;
                if (!x) x = 0;
                columnLineRef.style.left = ((point.startX - this.bodyBounds.x) - x) + "px";
            }
        }
    }

    private onColumnFinishResize(column: TableColumnModel | undefined,
                                 newWidth: number) {
        if (this.props.columnResizeLineRef && this.props.columnPositionRef
            && this.props.columnResizeLineRef.instance && this.props.columnPositionRef.instance) {
            let columns = this.props.columns;
            let nextColumn, flexColumns = [];
            newWidth = Math.round(newWidth);
            for (let i = 0; i < columns.length; i++) {
                if (columns[i] == column) {
                    if (columns.length > i + 1) {
                        nextColumn = columns[i + 1];
                    } else {
                        nextColumn = columns[i - 1];
                    }
                }
                if (columns[i].flex > 0) flexColumns.push(columns[i]);
            }
            let oldWidth = column.width;
            if (this.props.fit) {
                let diff = newWidth - oldWidth;
                column.width = oldWidth + diff;
                if (flexColumns && flexColumns.length > 0) {
                    let totalFlexWidth = 0;
                    for (let fc of flexColumns) totalFlexWidth += fc.width;
                    for (let fc of flexColumns) {
                        fc.width = fc.width - (totalFlexWidth / fc.width) * diff;
                    }
                } else if (nextColumn) {
                    nextColumn.width = nextColumn.width - diff;
                }
            } else {
                column.width = newWidth;
            }
            if (this.props.columnResizeLineRef && this.props.columnResizeLineRef.instance) {
                let columnLineRef = this.props.columnResizeLineRef.instance.dom as HTMLElement;
                columnLineRef.style.display = "none";
            }

            Ginkgo.forEachChildren(component => {
                if (component instanceof TableColumn) {
                    component.isResizing = false;
                }
            }, this);
            if (this.props.onColumnResize) {
                this.props.onColumnResize("finish", column, oldWidth);
            }
        }
    }

    public setScrollLeft(left: number) {
        this.rootEl && this.rootEl.dom && (this.rootEl.dom.scrollLeft = left);
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(TableColumnGroup.tableClsColumn);
        return arr;
    }
}
