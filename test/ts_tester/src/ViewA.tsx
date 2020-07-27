import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";
import ViewB from "./ViewB";
import ViewC from "./ViewC";
import ViewD from "./ViewD";

export interface ViewAProps extends GinkgoElement {

}

export default class ViewA extends Ginkgo.Component<ViewAProps> {
    private text;

    render(): GinkgoNode {
        return <div>
            <span onClick={e => {
                this.text = "DDD";
                this.forceRender()
                alert('')
            }}>A view</span>
            <ViewB>
                <ViewC>
                    <ViewD text={this.text}></ViewD>
                </ViewC>
            </ViewB>
        </div>
    }
}

