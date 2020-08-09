import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewChild extends Ginkgo.Component {

    state = {
        type: 0
    }

    render(): GinkgoNode {
        return <div onClick={e => {
            this.setState({type: this.state.type + 1})
        }}>
            <ViewChild3 key={1}/>
            <ViewChild4 key={5}/>
            <span key={2}>(2)</span>
            <span key={3}>(3)</span>
            <ViewChild4 key={5}/>
            {/*<ViewChild1>*/}
            {/*    <ViewChild2 key={"1"}/>*/}
            {/*    <ViewChild3/>*/}
            {/*    {this.state.type > 1 ? <ViewChild4/> : undefined}*/}
            {/*</ViewChild1>*/}
        </div>
    }
}


class ViewChild1 extends Ginkgo.Component {
    render(): GinkgoNode {
        console.log("children2", this.children);
        return <div>{this.props.children}</div>;
    }

    componentRenderUpdate(props?: any, state?: {}) {
        console.log("children", this.children, this);
    }
}

class ViewChild2 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <span>2</span>;
    }
}

class ViewChild3 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <Ginkgo.Fragment>
            <span>
                <span>(3.1)</span>
                <span>(3.2)</span>
            </span>
            <span>(3.5)</span>
            <span>(3.6)</span>
        </Ginkgo.Fragment>;
    }
}

class ViewChild4 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <Ginkgo.Fragment>
            <span>
                <span>(4.1)</span>
                <span>(4.2)</span>
            </span>
            <span>(4.5)</span>
            <span>(4.6)</span>
        </Ginkgo.Fragment>;
    }
}
