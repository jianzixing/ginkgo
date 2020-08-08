import Ginkgo, {BindComponent, GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewFragment extends Ginkgo.Component {
    private text = "100";

    render(): GinkgoNode {
        return <div>
            <div onClick={e => {
                this.text = "101";
                this.setState();
            }}>
                Ref View
            </div>
            <Ginkgo.Fragment>
                <span>FA{this.text}</span>
                <span>FB{this.text}</span>
            </Ginkgo.Fragment>
        </div>
    }
}

