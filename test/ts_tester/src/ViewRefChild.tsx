import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewRefChild extends Ginkgo.Component {
    render(): GinkgoNode {
        console.log("ref child")
        return <span>Ref View {this.props.children}</span>
    }
}

