import Ginkgo, {GinkgoElement, GinkgoNode, HTMLComponent} from "../carbon/Ginkgo";

export default class ViewAppend extends Ginkgo.Component {
    private dom: HTMLComponent;

    render(): GinkgoNode {
        return <div style={{width: 100, height: 100, backgroundColor: '#F0F0F0'}}
                    ref={c => this.dom = c}
                    onClick={e => {

                    }}></div>
    }

    componentDidMount() {
        this.dom.append(<span>abc</span>);
    }
}

