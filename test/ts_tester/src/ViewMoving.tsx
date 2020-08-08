import Ginkgo, {GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export default class ViewMoving extends Ginkgo.Component {

    state = {
        type: 0
    }

    render(): GinkgoNode {
        return <div>
            {this.state.type == 0 ?
                <div onClick={e => {
                    this.setState({type: this.state.type + 1})
                }}>
                    <div key={1}>A</div>
                    <div key={2}>B</div>
                    <ViewMoving2 key={6}/>
                    <ViewMoving3 key={5}/>
                    <div key={3}>C</div>
                    <div key={4}>D</div>
                </div> : undefined}
            {this.state.type == 1 ?
                <div onClick={e => {
                    this.setState({type: this.state.type + 1})
                }}>
                    <div key={1}>A</div>
                    <div key={2}>B</div>
                    <div key={3}>C</div>
                    <div key={4}>D</div>
                    <ViewMoving2 key={6}/>
                    <ViewMoving3 key={5}/>
                </div> : undefined}
            {this.state.type == 2 ?
                <div onClick={e => {
                    this.setState({type: this.state.type + 1})
                }}>
                    <div key={1}>A</div>
                    <ViewMoving2 key={6}/>
                    <div key={3}>C</div>
                    <div key={4}>D</div>
                    <ViewMoving3 key={5}/>
                    <div key={2}>B</div>
                </div> : undefined}
        </div>
    }
}

interface ViewMoving2Props extends GinkgoElement {

}

class ViewMoving2 extends Ginkgo.Component<ViewMoving2Props> {
    render(): GinkgoNode {
        console.log("--2")
        return <div>Insert By Component</div>
    }
}

interface ViewMoving3Props extends GinkgoElement {

}

class ViewMoving3 extends Ginkgo.Component<ViewMoving3Props> {
    render(): GinkgoNode {
        console.log("--3")
        return <div>Insert By Key</div>
    }
}

