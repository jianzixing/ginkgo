import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewLifecycle extends Ginkgo.Component {
    state = {
        type: 0
    }

    render(): GinkgoNode {
        return <div onClick={e => {
            this.setState({type: this.state.type + 1});
        }}>
            {this.state.type > 3 ? undefined : <ViewLifecycle2 text={"" + this.state.type}/>}
        </div>
    }

    componentWillUpdate?(nextProps?, nextState?): void {
        console.log("parent will update", nextProps, nextState);
    }

    componentDidUpdate?(props?, state?): void {
        console.log("parent did update", props, state);
    }
}

class ViewLifecycle2 extends Ginkgo.Component<{ text: string }> {
    render(): GinkgoNode {
        console.log("render");
        return <span>lifecycle</span>
    }

    componentWillMount?(): void {
        console.log("will mount");
    }

    componentWillUnmount?(): void {
        console.log("will unmount");
    }

    componentDidMount?(): void {
        console.log("did mount");
    }

    componentChildChange?(children: Array<GinkgoElement>, old: Array<GinkgoElement>): void {
        console.log("children change");
    }

    componentWillReceiveProps?(props, context?) {
        console.log("will receive props", props, context.oldProps);
        this.setState()
        return {};
    }

    componentReceiveProps?(props, context?): void {
        console.log("did receive props", props, context.oldProps);
    }

    componentWillCompareProps?(props, context?) {
        console.log("will compare props", props, context.oldProps);
        return {};
    }

    componentCompareProps?(props, context?): void {
        console.log("did compare props", props, context.oldProps);
    }

    componentWillUpdate?(nextProps?, nextState?): void {
        console.log("will update", nextProps, nextState);
    }

    componentDidUpdate?(props?, state?): void {
        console.log("did update", props, state);
    }

    componentRenderUpdate?(props?, state?): void {
        console.log("render update", props, state);
    }

    shouldComponentUpdate?(nextProps?, nextState?): boolean {
        console.log("should update");
        return true;
    }
}

