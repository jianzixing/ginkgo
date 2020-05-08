import Ginkgo, {CSSProperties, GinkgoElement} from "../../carbon/Ginkgo";
import "./TreeCell.scss";
import TableCell, {TableCellProps} from "../grid/TableCell";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import {TreeListModel} from "./Tree";


export interface TreeCellProps extends TableCellProps {
    text: string;
    status: "close" | "open" | "leaf";
    iconType?: string;
    icon?: string;
    deep?: number;
    treeListItem?: TreeListModel;
    expandByRow?: boolean;
    onExpand?: (e: { treeListItem: TreeListModel | undefined }) => void
}

export default class TreeCell<P extends TreeCellProps> extends TableCell<P> {
    protected static treeCellClsRoot;
    protected static treeCellClsElbow;
    protected static treeCellClsExpander;
    protected static treeCellClsIcon;
    protected static treeCellClsText;

    protected onExpandEvent?: (e: { treeListItem: TreeListModel | undefined }) => void = this.props.onExpand;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TreeCell.treeCellClsRoot = this.getThemeClass("tree-cell");
        TreeCell.treeCellClsElbow = this.getThemeClass("tree-cell-elbow");
        TreeCell.treeCellClsExpander = this.getThemeClass("tree-cell-expander");
        TreeCell.treeCellClsIcon = this.getThemeClass("tree-cell-icon");
        TreeCell.treeCellClsText = this.getThemeClass("tree-cell-text");
    }

    protected drawing(): GinkgoElement | undefined | null {
        let cls = [TableCell.tableCellClsBody],
            status = this.props.status,
            deep = this.props.deep || 1;
        cls.push(TreeCell.treeCellClsRoot);

        let elbowEl,
            iconEl,
            elbowCls = [TreeCell.treeCellClsElbow, TreeCell.treeCellClsExpander],
            /*微调图标*/
            style: CSSProperties = {position: "relative", top: "1px"};

        if (status == "close") {
            elbowEl = <Icon style={style} icon={IconTypes.caretRight}/>;
        } else if (status == "open") {
            elbowEl = <Icon style={style} icon={IconTypes.caretDown}/>;
        } else if (status == "leaf") {
            elbowCls = [TreeCell.treeCellClsElbow];
        }

        if (this.props.iconType || this.props.icon) {
            if (this.props.iconType) {
                iconEl = <Icon style={style} icon={this.props.iconType}/>;
            }
            if (this.props.icon) {
                iconEl = <img style={style} src={this.props.icon}/>;
            }
        }

        if (!iconEl) {
            if (status == "close") {
                iconEl = <Icon style={style} icon={IconTypes.folder}/>;
            } else if (status == "open") {
                iconEl = <Icon style={style} icon={IconTypes.folderOpen}/>;
            } else if (status == "leaf") {
                iconEl = <Icon style={style} icon={IconTypes.file}/>;
            }
        }

        let deepEls: Array<GinkgoElement> = [];
        if (deep > 1) {
            for (let i = 1; i < deep; i++) {
                deepEls.push(<div key={"blank" + i} className={TreeCell.treeCellClsElbow}></div>);
            }
        }
        return (
            <div className={cls.join(" ")} onClick={(e) => {
                this.onExpandNodeClick(1);
            }}>
                {deepEls}
                <div className={elbowCls.join(" ")} onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.onExpandNodeClick(2);
                }}>
                    {elbowEl}
                </div>
                <div className={[TreeCell.treeCellClsIcon].join(" ")}>
                    {iconEl}
                </div>
                {this.props.text ? <span className={TreeCell.treeCellClsText}>{this.props.text}</span> :
                    <span className={TreeCell.treeCellClsText}>&nbsp;</span>}
            </div>
        )
    }

    private onExpandNodeClick(type: number) {
        if (this.props.expandByRow && type == 1) {
            if (this.onExpandEvent) {
                this.onExpandEvent({treeListItem: this.props.treeListItem})
            }
        } else if (type == 2) {
            if (this.onExpandEvent) {
                this.onExpandEvent({treeListItem: this.props.treeListItem})
            }
        }
    }
}
