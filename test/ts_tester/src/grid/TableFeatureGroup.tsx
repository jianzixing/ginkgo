import Table, {TableItemModel, TableProps} from "./Table";
import Ginkgo, {GinkgoNode} from "../../carbon/Ginkgo";
import TableRow from "./TableRow";
import "./TableFeatureGroup.scss";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import {TableColumnModel} from "./TableColumn";


export interface TableFeatureGroupModel {
    enabled: boolean;
    childText?: string | "children";
    render?: (value: TableItemModel) => GinkgoNode | undefined;
}

export default class TableFeatureGroup {
    protected static tableClsFeatureGroup;
    protected static tableClsFeatureGroupIcon;
    protected static tableClsFeatureGroupText;

    renderItems(wrapper: TableProps,
                items: Array<GinkgoNode>,
                value: TableItemModel,
                table: Table<TableProps>,
                themePrefix: string) {

        TableFeatureGroup.tableClsFeatureGroup = themePrefix + "table-feature-group";
        TableFeatureGroup.tableClsFeatureGroupIcon = themePrefix + "table-feature-group-icon";
        TableFeatureGroup.tableClsFeatureGroupText = themePrefix + "table-feature-group-text";

        let plugin = table.props.plugin,
            columns: Array<TableColumnModel> = wrapper.columns,
            tableItemModels: Array<TableItemModel> | undefined = wrapper.tableItemModels,
            data = value.data,
            grouping: TableFeatureGroupModel = table.props.feature ?
                table.props.feature.grouping : {
                    enabled: true,
                    childText: 'children'
                },
            rowValueList: Array<any> = data && data[grouping.childText || 'children'];

        if (rowValueList && rowValueList instanceof Array) {
            items.push(
                <div
                    className={TableFeatureGroup.tableClsFeatureGroup}
                    onClick={() => {
                        if (value.show == undefined || value.show == true) {
                            value.show = false;
                        } else {
                            value.show = true;
                        }
                        table.redrawing();
                    }}
                >
                    <Icon className={TableFeatureGroup.tableClsFeatureGroupIcon}
                          icon={value.show || value.show == undefined ? IconTypes.minusSquare : IconTypes.plusSquare}/>
                    <span className={TableFeatureGroup.tableClsFeatureGroupText}>
                        {grouping.render ? grouping.render(value) : "Group (10 Items)"}
                    </span>
                </div>
            );

            rowValueList.map((dt, index) => {
                let cloneValue = {...value};
                cloneValue.data = dt;
                items.push(
                    <TableRow
                        tableItem={cloneValue}
                        hidden={value.show == false}
                        zebra={wrapper.zebra && index % 2 == 1}
                        border={wrapper.tableRowBorder}
                        selected={value.selected}
                        plugin={plugin}
                        columns={columns}
                        index={index}
                        onSelected={(e, data: TableItemModel) => {
                            if (tableItemModels) {
                                tableItemModels.map((v) => {
                                    v.selected = false;
                                });
                                data.selected = true;
                                table.redrawing();
                            }
                        }}
                        onDeselected={(e, data: TableItemModel) => {
                            /*如果是多选则开启*/
                            // data.selected = false;
                            // this.applyUpdateState();
                        }}/>
                );
            });
        }
    }
}
