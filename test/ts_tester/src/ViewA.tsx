import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";
import ViewB from "./ViewB";
import ViewC from "./ViewC";
import ViewD from "./ViewD";

export interface ViewAProps extends GinkgoElement {

}

export default class ViewA extends Ginkgo.Component<ViewAProps> {
    private view: ViewD
    state = {
        text: null
    };

    render(): GinkgoNode {
        return <div>
            <span onClick={e => {
                this.setState({text: "DDD"})
                this.setState({text: "AAA"})
                this.setState({text: "BBB"})
                this.view.setState({name: "1"})
                this.view.setState({name: "2"})
                this.view.setState({name: "3"})
            }}>A view</span>
            <ViewB>
                <ViewC>
                    <ViewD ref={c => this.view = c} text={this.state.text}></ViewD>
                </ViewC>
            </ViewB>
        </div>
    }

    componentDidUpdate(props?: ViewAProps, state?: {}) {
        console.log("---")
    }
}

