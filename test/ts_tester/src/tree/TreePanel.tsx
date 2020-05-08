import Ginkgo, {GinkgoElement} from "../../carbon/Ginkgo";
import "./TreePanel.scss";
import Panel, {PanelProps} from "../panel/Panel";
import Tree, {TreeProps} from "./Tree";

export interface TreePanelProps extends PanelProps, TreeProps {

}

export default class TreePanel<P extends TreePanelProps> extends Panel<P> {
    protected static treeClsPanel;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TreePanel.treeClsPanel = this.getThemeClass("tree-panel");
    }

    protected drawingPanelChild() {
        let newProps: any = {...this.props};
        newProps.ref = undefined;
        return (
            <Tree
                {...newProps}
            />)
    }

    render(): any {
        return super.render();
    }

    protected drawing(): GinkgoElement<any> | undefined | null {
        return super.drawing();
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(TreePanel.treeClsPanel);
        return arr;
    }
}
