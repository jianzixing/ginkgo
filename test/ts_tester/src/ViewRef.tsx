import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";
import ViewRefChild from "./ViewRefChild";

export default class ViewRef extends Ginkgo.Component {
    private refObj;

    render(): GinkgoNode {
        console.log("ref")
        return <div>
            <div onClick={e => {
                console.log(this.refObj);
            }}>
                Ref View
            </div>
            <ViewRefChild>
                <div ref={"refObj"}>ref object</div>
            </ViewRefChild>
        </div>
    }
}

