import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewInsert extends Ginkgo.Component {

    state = {
        type: 0
    }

    render(): GinkgoNode {
        return <div>
            <div onClick={e => {
                this.setState({type: this.state.type + 1})
            }}>
                <div key={1}>A</div>
                <div key={2}>B</div>
                {this.state.type == 1 ? <div key={5}>Insert</div> : undefined}
                {this.state.type == 2 ? <ViewInsert2/> : undefined}
                {this.state.type == 3 ? <ViewInsert3 key={5}/> : undefined}
                <div key={3}>C</div>
                <div key={4}>D</div>
            </div>
        </div>
    }
}

class ViewInsert2 extends Ginkgo.Component {
    render(): GinkgoNode {
        return <div>Insert By Component</div>
    }
}

interface ViewInsert3Props extends GinkgoElement {

}

class ViewInsert3 extends Ginkgo.Component<ViewInsert3Props> {
    render(): GinkgoNode {
        return <div>Insert By Key</div>
    }
}

