import Ginkgo, {CSSProperties, GinkgoElement, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import './Grid.scss';
import Table, {
    TableBodyPlugin,
    TableCellPlugin,
    TableItemModel, TableProps,
    TableRowPlugin
} from "./Table";
import Component from "../component/Component";
import {TableColumnModel} from "./TableColumn";
import TableColumnGroup, {TableColumnGroupProps} from "./TableColumnGroup";
import {StoreProcessor} from "../store/DataStore";
import Loading from "../loading/Loading";
import {getCellWidth, getFixCellWidth, isFixCellWidth} from "./TableCell";

export interface GridBodyPlugin extends TableBodyPlugin {

}

export interface GridRowPlugin extends TableRowPlugin {

}

export interface GridCellPlugin extends TableCellPlugin {

}

export interface GridProps extends TableProps {
    columns: Array<TableColumnModel>;
    plugin?: {
        body?: GridBodyPlugin,
        row?: GridRowPlugin,
        cell?: { [dataIndex: string]: GridCellPlugin }
    };
    data?: Array<any>;
    models?: Array<TableItemModel>;
    /*列宽度保持表格总宽度*/
    fit?: boolean;
}

export default class Grid<P extends GridProps> extends Component<P> implements StoreProcessor {
    protected static gridClsRoot;
    protected static gridClsBody;
    protected static gridClsTable;
    protected static gridClsResize;
    protected static clsColumnResizeLine;

    protected columnLineRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected gridBodyRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected columnsRef: TableColumnGroup<TableColumnGroupProps>;
    protected tableRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected tableComponentRef: Table<any>;

    protected hasGridResizeCls = false;
    protected tableItemModels?: Array<TableItemModel> | undefined;
    protected isLoading?: boolean = false;

    protected columns: Array<TableColumnModel> = this.props.columns;
    protected tableWidth = 0;
    protected tableClientWidth = 0;

    defaultProps = {
        zebra: true,
        tableRowBorder: true
    };

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        Grid.gridClsRoot = this.getThemeClass("grid");
        Grid.gridClsBody = this.getThemeClass("grid-body");
        Grid.gridClsTable = this.getThemeClass("grid-table");
        Grid.gridClsResize = this.getThemeClass("grid-resize");
        Grid.clsColumnResizeLine = this.getThemeClass("column-resize-line");
    }

    protected compareUpdate(key: string, newValue: any, oldValue: any): boolean {
        if (key == "data" && newValue != oldValue) {
            this.tableItemModels = this.data2TableItemModels(newValue);
        }
        if (key == "columns" && newValue != oldValue) {
            this.columns = newValue;
        }
        return false;
    }

    protected data2TableItemModels(data: any): Array<TableItemModel> | undefined {
        if (this.props && this.props.models) {
            return this.props.models;
        } else {
            if (data && data instanceof Array) {
                let arr = new Array<TableItemModel>();
                data.map((value, index) => {
                    arr.push({
                        key: "" + index,
                        data: value
                    })
                });

                return arr;
            }
        }
        return undefined;
    }

    protected drawing(): GinkgoElement | undefined | null {
        let columns: Array<TableColumnModel> = this.columns || [],
            gridTableClsNames = [Grid.gridClsTable];

        return (
            <div ref={this.gridBodyRef} className={Grid.gridClsBody}>
                <TableColumnGroup
                    ref={(component: any) => this.columnsRef = component}
                    columnPositionRef={this.gridBodyRef}
                    columnResizeLineRef={this.columnLineRef}
                    columns={columns}
                    fit={this.props.fit}
                    fitBaseRef={this.tableRef}
                    columnSpace={this.props.tableCellBorder}
                    tableWidth={this.tableClientWidth}
                    onColumnResize={(type, column, oldWidth) => {
                        if (type == "start") {
                            this.hasGridResizeCls = true;
                            this.rootEl.reloadClassName();
                        }
                        if (type == "finish") {
                            this.hasGridResizeCls = false;
                            // this.rootEl.reloadClassName();
                            // this.tableComponentRef && this.tableComponentRef.redrawing();
                            this.redrawing();
                        }
                    }}
                    onColumnMenuChange={((type, data) => {
                        this.onColumnChange(type, data);
                    })}
                />
                <div
                    ref={this.tableRef}
                    className={gridTableClsNames}
                    onScroll={(e) => {
                        this.onTableScroll(e);
                    }}
                >
                    <Table
                        disableClickSelected={false}
                        enableToggleSelected={true}
                        {...this.props}
                        width={this.tableWidth}
                        height={undefined}
                        ref={c => this.tableComponentRef = (c as Table<any>)}
                        tableItemModels={this.tableItemModels}
                        referRefObjectWidth={this.tableRef}
                        columns={columns}
                        onSelected={(e: Event, data: TableItemModel) => {
                            if (this.tableItemModels) {
                                let allSel = true;
                                this.tableItemModels.map(tableItemModel => {
                                    if (tableItemModel.selected != true) {
                                        allSel = false;
                                    }
                                });
                                if (allSel && this.props.columns) {
                                    let arr = columns.filter(column => column.type == "checkbox");
                                    arr.map(column => column.checked = true);
                                    this.redrawing();
                                }
                            }
                            if (this.props.onSelected) {
                                this.props.onSelected(e, data.data);
                            }
                        }}
                        onDeselected={(e: Event, data: TableItemModel) => {
                            if (this.props.columns) {
                                let arr = columns.filter(column => column.type == "checkbox");
                                arr.map(column => column.checked = false);
                            }
                            this.redrawing();

                            if (this.props.onDeselected) {
                                this.props.onDeselected(e, data.data);
                            }
                        }}
                    />
                    {this.isLoading ? <Loading/> : undefined}
                </div>
                <div ref={this.columnLineRef} className={Grid.clsColumnResizeLine}></div>
            </div>
        )
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();
        this.calTableWidth();
    }

    onSizeChange(width: number, height: number): void {
        super.onSizeChange(width, height);
        this.calTableWidth();
    }

    protected calTableWidth() {
        if (this.columnsRef && this.props.fit) {
            this.columnsRef.calGroupColumnWidth();
        }

        let totalWidth = 0;
        for (let c of this.columns) {
            if (c.show != false) {
                totalWidth += getCellWidth(c);
            }
        }
        this.tableWidth = totalWidth;
        this.tableComponentRef.setWidth(totalWidth);
        let tableRef = this.tableRef.instance.dom as HTMLElement;
        this.tableClientWidth = totalWidth + (tableRef.offsetWidth - tableRef.clientWidth);
        this.redrawing(false);
    }

    protected onColumnChange(type: string, data: TableColumnModel) {
        let columns: Array<TableColumnModel> = this.columns || [];

        if (type == 'sortAsc' || type == 'sortDesc') {
            let index = columns.indexOf(data);
            columns.splice(index, 1, {...data});
        }
        if (type == 'checked') {
            if (this.tableItemModels) {
                this.tableItemModels = [...this.tableItemModels];
                let tableItemModels = this.tableItemModels;
                if (tableItemModels) {
                    for (let tableItemModel of tableItemModels) {
                        tableItemModel.selected = data.checked;
                    }
                }
            }
        }
        this.redrawing();
    }

    protected onTableScroll(e: Event) {
        let columnsEl: TableColumnGroup<TableColumnGroupProps> | null = this.columnsRef,
            tableEl = this.tableRef.instance ? this.tableRef.instance.dom : undefined;
        if (columnsEl && tableEl) {
            columnsEl.setScrollLeft(tableEl.scrollLeft);
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(Grid.gridClsRoot);
        if (this.hasGridResizeCls) {
            arr.push(Grid.gridClsResize);
        }
        return arr;
    }


    storeBeforeLoad?(): void {
        this.isLoading = true;
        this.redrawing();
    }

    storeLoaded(data: Object | Object[], total?: number, originData?: any): void {
        this.isLoading = false;

        if (data instanceof Array) {
            this.tableItemModels = this.data2TableItemModels(data);
        } else {
            this.tableItemModels = [];
        }
        this.redrawing();
    }
}
