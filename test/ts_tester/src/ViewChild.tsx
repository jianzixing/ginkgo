import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewChild extends Ginkgo.Component {

    state = {
        type: 0
    }

    render(): GinkgoNode {
        return <div onClick={e => {
            this.setState({type: this.state.type + 1})
        }}>
            <ViewChild1>
                <ViewChild2 key={"1"}/>
                <ViewChild3/>
                {this.state.type > 1 ? <ViewChild4/> : undefined}
            </ViewChild1>
        </div>
    }
}


class ViewChild1 extends Ginkgo.Component {
    render(): GinkgoNode {
        console.log("children2", this.children);
        return <div>{this.props.children}</div>;
    }

    componentRenderUpdate(props?: any, state?: {}) {
        console.log("children", this.children);
    }

    shouldComponentChildren() {
        return true;
    }
}

class ViewChild2 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <span>2</span>;
    }
}

class ViewChild3 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <span>3</span>;
    }
}

class ViewChild4 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <span>4</span>;
    }
}
