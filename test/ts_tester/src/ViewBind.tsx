import Ginkgo, {BindComponent, GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewBind extends Ginkgo.Component {
    private bind: BindComponent;
    private text = "abc";

    render(): GinkgoNode {
        return <div>
            <div onClick={e => {
                this.text = "EEE";
                this.bind.forceRender();
            }}>
                Ref View
            </div>
            <bind ref={c => this.bind = c} render={this.bindRender.bind(this)}/>
        </div>
    }

    bindRender() {
        return <span>{this.text}</span>
    }
}

