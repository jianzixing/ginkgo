import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewChild extends Ginkgo.Component {

    render(): GinkgoNode {
        return <ViewChild1>
            <ViewChild2/>
            <ViewChild3/>
        </ViewChild1>
    }
}


class ViewChild1 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <div>{this.props.children}</div>;
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
