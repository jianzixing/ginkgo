import Ginkgo, {GinkgoNode} from "../../carbon/Ginkgo";
import {AppManagerProps, AppManager} from "./AppPanel";
import Toolbar from "../toolbar/Toolbar";
import Button from "../button/Button";
import GridPanel from "../grid/GridPanel";
import TestBuilder from "./TestBuilder";

export interface TestManagerProps extends AppManagerProps {
}

export default class TestManager extends AppManager<TestManagerProps> {
    render(): GinkgoNode {
        return (
            <GridPanel key={"ddd"}
                       paging={true}
                       fillParent={true}
                       columns={[
                           {type: "checkbox"},
                           {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                           {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                           {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                           {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                           {title: "Text Grid Column", width: 200, dataIndex: 'text'}
                       ]}
                       data={[
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                           {text: "Text"},
                       ]}
                       header={false}
                       toolbars={
                           [
                               <Toolbar>
                                   <Button iconType={"plus"}
                                           text={"添加会员"}
                                           onClick={e => {
                                               this.forward(<TestBuilder/>)
                                           }}/>
                               </Toolbar>
                           ]
                       }>

            </GridPanel>
        );
    }
}
