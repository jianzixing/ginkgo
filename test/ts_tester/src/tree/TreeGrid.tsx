import Ginkgo, {CSSProperties, GinkgoNode} from "../../carbon/Ginkgo";
import Tree, {TreeProps} from "./Tree";
import Grid, {GridProps} from "../grid/Grid";

export interface TreeGridProps extends TreeProps, GridProps {
    treeDataIndex?: string;
}

export default class TreeGrid<P extends TreeGridProps> extends Tree<P> {

    constructor(props: P) {
        super(props);
    }

    drawing() {
        return (
            <Grid
                {...this.buildGridProps()}
                onSelected={(e, data) => {
                    if (this.props && this.props.onItemClick) {
                        this.props.onItemClick(e, {
                            data: data.data,
                            type: "selected"
                        });
                    }
                }}
                onDeselected={(e, data) => {
                    if (this.props && this.props.onItemClick) {
                        this.props.onItemClick(e, {
                            data: data.data,
                            type: "deselected"
                        });
                    }
                }}
            />
        )
    }

    protected buildGridProps(): GridProps {
        let cell = {};
        if (this.props.treeDataIndex) {
            cell[this.props.treeDataIndex] = this;
        } else {
            cell["text"] = this;
        }
        return {
            zebra: false,
            columns: this.props.columns,
            tableRowBorder: false,
            data: this.props.data,
            plugin: {cell: cell},
            ...this.props,
            models: this.tableItemModels
        }
    }
}
