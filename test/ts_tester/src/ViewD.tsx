import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";
import {ContextReceive} from "../carbon/GinkgoComponent";

export interface ViewDProps extends GinkgoElement {
    text?: string;
}

export default class ViewD extends Ginkgo.Component<ViewDProps> {
    state = {
        name:null
    }

    render(): GinkgoNode {
        console.log(this.props.text)
        return <div>
            <span>D view {this.props.text} + {this.state.name}</span>
        </div>
    }

    componentReceiveProps(props: ViewDProps, context?: ContextReceive<ViewDProps>) {
        this.forceRender();
    }
}

