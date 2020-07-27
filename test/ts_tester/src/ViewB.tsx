import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export interface ViewBProps extends GinkgoElement {

}

export default class ViewB extends Ginkgo.Component<ViewBProps> {
    render(): GinkgoNode {
        return <div>
            <span>B view</span>
            {this.props.children}
        </div>
    }
}

