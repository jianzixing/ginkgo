import Ginkgo, {GinkgoElement, GinkgoNode, RefObject} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import TabPanel, {TabModel} from "../tab/TabPanel";
import {NavModuleModel} from "./AppNavigation";
import AppPanel from "./AppPanel";

export interface TabContentModel extends TabModel {
    module: NavModuleModel;
}

export interface AppContentProps extends ComponentProps {
    items?: Array<TabContentModel>
}

export default class AppContent<P extends AppContentProps> extends Component<P> {
    protected tabPanelRefObject: RefObject<TabPanel<any>> = Ginkgo.createRef();
    protected items: Array<TabContentModel> = this.props.items;

    protected drawing(): GinkgoNode | GinkgoElement[] {
        let tabs = this.items || [];
        for (let tab of tabs) {
            let module = tab.module;
            if (module && !tab.content) {
                let props = module.props || {};
                let ref = Ginkgo.createRef();
                props["navModule"] = module;
                props["navPanel"] = ref;
                tab.content = (
                    <AppPanel ref={ref}>
                        {Ginkgo.createElement(module.module, props)}
                    </AppPanel>
                )
            }
        }

        return (
            <TabPanel
                ref={this.tabPanelRefObject}
                headerAlign={"top"}
                models={[...tabs]}
                onCloseClick={(e, model) => {
                    if (this.items) {
                        let i = 0;
                        for (let item of this.items) {
                            if (item.key == model.key) {
                                this.items.splice(i, 1);
                                break;
                            }
                            i++;
                        }
                    }
                    this.redrawing()
                }}
            />
        );
    }

    setItemsAndRedrawing(items: Array<TabContentModel>) {
        this.items = items;
        this.redrawing();
    }

    onSizeChange(width: number, height: number): void {
        if (this.tabPanelRefObject && this.tabPanelRefObject.instance) {
            this.tabPanelRefObject.instance.setSize(this.getWidth(), this.getHeight());
        }
    }
}
