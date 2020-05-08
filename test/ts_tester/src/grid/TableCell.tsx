import Ginkgo, {CSSProperties, GinkgoElement, RefObject} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import "./TableCell.scss";
import {TableColumnModel} from "./TableColumn";
import {AbstractFormField} from "../form/AbstractFormField";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import {TableRecord} from "./TableRow";
import TextField from "../form/TextField";
import ComboboxField from "../form/ComboboxField";

export type tableCellTypes = "gridcolumn" | "rownumber" | "checkbox" | "actioncolumn";
export const RowNumberWidth = 32;

export function isFixCellWidth(type: tableCellTypes) {
    if (type == "rownumber" || type == "checkbox") {
        return true;
    }
    return false;
}

export function getFixCellWidth(type: tableCellTypes) {
    if (isFixCellWidth(type)) {
        return RowNumberWidth;
    }
    return 0;
}

export function getCellWidth(column: TableColumnModel) {
    if (isFixCellWidth(column.type)) {
        let w = getFixCellWidth(column.type);
        column.width = w;
        return w;
    }
    return column.width || 120;
}

export interface TableCellProps extends ComponentProps {
    hasPadding?: boolean;
    type?: tableCellTypes;
    // 单元格右边的边线
    cellSpace?: boolean;
    column: TableColumnModel;
    data: any;
    record?: TableRecord;
    value: any;
    onValueChange?: (data: any, value: any) => void;
}

export default class TableCell<P extends TableCellProps> extends Component<P> {
    protected static tableCellClsRoot;
    protected static tableCellClsBody;
    protected static tableCellClsPadding;
    protected static tableCellClsRowNumber;
    protected static tableCellClsCheckbox;
    protected static tableCellClsLine;
    protected static tableCellClsModify;

    protected onEditing: boolean = false;
    protected editingFieldRef: RefObject<Component<any>> = Ginkgo.createRef();
    protected value: any = this.props.value;
    protected doubleClickCount = 0;
    protected doubleTimeoutHandler;

    defaultProps = {
        hasPadding: true,
        cellSpace: true
    };

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TableCell.tableCellClsRoot = this.getThemeClass("table-cell");
        TableCell.tableCellClsBody = this.getThemeClass("table-cell-body-el");
        TableCell.tableCellClsPadding = this.getThemeClass("table-cell-body-el-padding");
        TableCell.tableCellClsRowNumber = this.getThemeClass("table-cell-rownumber");
        TableCell.tableCellClsCheckbox = this.getThemeClass("table-cell-checkbox");
        TableCell.tableCellClsLine = this.getThemeClass("table-cell-line");
        TableCell.tableCellClsModify = this.getThemeClass("table-cell-modify");
    }

    protected drawing(): GinkgoElement | undefined | GinkgoElement[] {
        let cls, record = this.props.record, column = this.props.column;
        let editing = column ? column.editing : undefined;

        if (this.props.hasPadding && !this.onEditing) {
            cls = [TableCell.tableCellClsBody, TableCell.tableCellClsPadding];
        } else {
            cls = [TableCell.tableCellClsBody];
        }

        if (editing && editing.showEvent == "show") {
            this.onEditing = true;
        }
        let children = this.buildCellChildren();

        let elements = [
            <div
                className={cls.join(" ")}
                onClick={e => {
                    if (this.onEditing) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }}
            >
                {children}
            </div>
        ];

        if (record && column && !record.equals(column.dataIndex)) {
            elements.push(<Icon className={TableCell.tableCellClsModify} icon={IconTypes._gridCellModify}/>)
        }

        return elements;
    }

    protected onDocumentMouseDown(e: MouseEvent) {
        if (!this.targetEventInCurrent(e)) {
            let column = this.props.column;
            let editing = column && column.editing ? column.editing : {};
            if (editing.showEvent != "show") {
                this.onEditing = false;
            }
            if (this.editingFieldRef
                && this.editingFieldRef.instance
                && this.editingFieldRef.instance instanceof AbstractFormField) {
                let value = this.editingFieldRef.instance.getValue();
                if (value == this.value) {

                } else {
                    this.value = value;
                    if (this.props.data && this.props.column && this.props.column.dataIndex) {
                        this.props.data[this.props.column.dataIndex] = this.value;
                    }
                    if (this.props.onValueChange) {
                        this.props.onValueChange(this.props.data, this.value);
                    }
                }
            }
            this.redrawing();
            this.unmountDocumentMouseDown();
        }
    }

    protected compareUpdate(key: string, newValue: any, oldValue: any): boolean {
        if (key == "value" && this.value != newValue) {
            this.value = newValue;
            return true;
        }
        return false;
    }

    protected onClick(e: Event) {
        super.onClick(e);
        let column = this.props.column;
        if (column && column.editing &&
            (column.editing.showEvent == "click" || !column.editing.showEvent)) {
            e.stopPropagation();
            e.preventDefault();
            this.onEditing = true;
            this.redrawing();
            this.mountDocumentMouseDown();
        }

        if (column && column.editing && column.editing.showEvent == "dbclick") {
            this.doubleClickCount++;
            if (this.doubleClickCount == 1) {
                this.doubleTimeoutHandler = setTimeout(() => {
                    this.doubleClickCount = 0;
                    clearImmediate(this.doubleTimeoutHandler);
                }, 300);
            }
            if (this.doubleClickCount > 1) {
                e.stopPropagation();
                e.preventDefault();
                this.onEditing = true;
                this.redrawing();
                this.mountDocumentMouseDown();
            }
        }
    }

    protected buildCellChildren() {
        let column = this.props.column;
        if (this.onEditing && column.editing && column.editing.field) {
            let field = {...column.editing.field};
            field['style'] = {...field['style'] || {}, width: "100%", height: "100%"};
            field['ref'] = this.editingFieldRef;
            field['onChange'] = this.onEditValueChange.bind(this);
            if (column.editing.fieldType == "check") {
                field['checkAlign'] = "center";
                field['itemStyle'] = {padding: "5px"};
            }
            return field;
        } else {
            return this.props.children;
        }
    }

    protected onEditValueChange(e, value: any) {
        if (this.editingFieldRef
            && this.editingFieldRef.instance
            && this.editingFieldRef.instance instanceof AbstractFormField) {
            let value = this.editingFieldRef.instance.getValue();
            if (this.value != value) {
                this.value = value;
                if (this.props.data && this.props.column && this.props.column.dataIndex) {
                    this.props.data[this.props.column.dataIndex] = this.value;
                }
                if (this.props.onValueChange) {
                    this.props.onValueChange(this.props.data, this.value);
                }
            }
        }
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();
        if (this.editingFieldRef && this.editingFieldRef.instance
            && this.editingFieldRef.instance instanceof AbstractFormField) {
            let value = this.value;
            if (this.props.column && this.props.column.editing && this.props.column.editing.onValue) {
                value = this.props.column.editing.onValue(this.props.column, this.props.data, value);
            }
            this.editingFieldRef.instance.setValue(value);
            this.editingFieldRef.instance.focus();
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(Component.componentClsEnabledSelect);
        arr.push(TableCell.tableCellClsRoot);
        if (this.props.type == "rownumber") {
            arr.push(TableCell.tableCellClsRowNumber);
        }
        if (this.props.type == "checkbox") {
            arr.push(TableCell.tableCellClsCheckbox);
        }
        if (this.props.cellSpace) {
            arr.push(TableCell.tableCellClsLine);
        }
        return arr;
    }

    protected getRootStyle(): CSSProperties {
        let style = super.getRootStyle();

        return style;
    }
}
