import Ginkgo, {GinkgoElement, GinkgoNode, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import Panel, {PanelProps} from "../panel/Panel";
import Grid, {GridProps} from "./Grid";
import "./GridPanel.scss";
import PagingToolbar, {PagingToolbarProps} from "../toolbar/PagingToolbar";
import {ToolbarProps} from "../toolbar/Toolbar";

export interface GridPanelProps extends PanelProps, GridProps {
    paging?: boolean | PagingToolbarProps;
}

export default class GridPanel<P extends GridPanelProps> extends Panel<P> {
    protected static gridPanelBodyCls;

    protected gridPanelBodyRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected gridRef: RefObject<Grid<any>> = Ginkgo.createRef();
    protected gridWidth: number;
    protected gridHeight: number;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        GridPanel.gridPanelBodyCls = this.getThemeClass("gridpanel-body");
    }

    protected drawingPanelChild(): GinkgoNode | GinkgoElement[] {
        return [
            <div ref={this.gridPanelBodyRef} className={GridPanel.gridPanelBodyCls}>
                <Grid
                    {...this.props}
                    width={this.gridWidth}
                    height={this.gridHeight}
                    ref={this.gridRef}
                />
            </div>
        ];
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();

        this.setGridPanelSize();
    }

    protected getToolbars(): Array<ToolbarProps> {
        let toolbars = super.getToolbars();
        if (!toolbars) toolbars = [];
        if (this.props.paging) {
            if (typeof this.props.paging == "object") {
                let props = this.props;
                props.paging['store'] = props.store;
                if (!props.paging['align']) {
                    props.paging['align'] = "bottom";
                    // props.paging['border'] = "top";
                } else if (!props.paging['border']) {
                    if (props.paging['align'] == "top") {
                        // props.paging['border'] = "bottom";
                    }
                    if (props.paging['align'] == "bottom") {
                        // props.paging['border'] = "top";
                    }
                }
                toolbars.push(this.props.paging as ToolbarProps);
            } else {
                toolbars.push(<PagingToolbar
                    store={this.props.store}
                    align={"bottom"}
                    border={"top"}
                />);
            }
        }
        return toolbars;
    }

    private setGridPanelSize() {
        if (this.gridPanelBodyRef && this.gridPanelBodyRef.instance
            && this.gridRef && this.gridRef.instance) {
            let dom = this.gridPanelBodyRef.instance.dom as HTMLElement;
            let grid = this.gridRef.instance;
            this.gridWidth = dom.offsetWidth;
            this.gridHeight = dom.offsetHeight;
            grid.setSize(this.gridWidth, this.gridHeight);
        }
    }

    doLayout() {
        super.doLayout();
        this.setGridPanelSize();
    }
}
