import Ginkgo, {GinkgoElement, GinkgoNode, HTMLComponent} from "../carbon/Ginkgo";
import {ContextUpdate} from "../carbon/GinkgoComponent";

export default class ViewUnauto extends Ginkgo.Component {
    state = {
        text: "auto"
    }

    render(): GinkgoNode {
        return <div onClick={e => {
            this.setState({text: "auto2"})
        }}>
            <ViewUnauto2 text={this.state.text}/>
        </div>
    }


}

interface ViewUnauto2Props extends GinkgoElement {
    text?: string;
}

class ViewUnauto2 extends Ginkgo.Component<ViewUnauto2Props> {
    render(): GinkgoNode {
        return <div>
            <span>{this.props.text}</span>
        </div>
    }

    componentUpdateProps(props: ViewUnauto2Props, context?: ContextUpdate<ViewUnauto2Props>) {
        console.log("receive text ", props.text);
        let el = this.query("div") as HTMLComponent;
        el.overlap(<span>auto 3</span>)
    }

    shouldComponentUpdate(nextProps?: ViewUnauto2Props, nextState?: {}): boolean {
        return false;
    }
}
