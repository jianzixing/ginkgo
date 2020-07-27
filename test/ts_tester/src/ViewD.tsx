import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";
import {ContextReceive} from "../carbon/GinkgoComponent";

export interface ViewDProps extends GinkgoElement {
    text?: string;
}

export default class ViewD extends Ginkgo.Component<ViewDProps> {
    render(): GinkgoNode {
        return <div>
            <span>D view {this.props.text}</span>
        </div>
    }

    componentReceiveProps(props: ViewDProps, context?: ContextReceive<ViewDProps>) {
        this.forceRender();
    }
}

