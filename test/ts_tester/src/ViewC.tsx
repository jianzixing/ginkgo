import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export interface ViewCProps extends GinkgoElement {

}

export default class ViewC extends Ginkgo.Component<ViewCProps> {
    render(): GinkgoNode {
        return <div>
            <span>C view</span>
            {this.props.children}
        </div>
    }
}

