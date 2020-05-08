import Ginkgo, {GinkgoNode, GinkgoElement, HTMLComponent, InputComponent, RefObject} from "../carbon/Ginkgo";

export default class GinkgoT1View extends Ginkgo.Component {
    private bodyEl?: RefObject<HTMLComponent> = Ginkgo.createRef();
    private inputEl?: RefObject<InputComponent> = Ginkgo.createRef();
    private animEl?: RefObject<HTMLComponent> = Ginkgo.createRef();

    state = {
        color: '#ffffff'
    };

    render(): GinkgoNode {
        return (
            <div ref={this.bodyEl}>
                {this.props.children}
                <input ref={this.inputEl} onChange={(e) => {
                    console.log(this.inputEl.instance.value)
                }}/>
                <div
                    ref={this.animEl}
                    style={{width: 100, height: 100, backgroundColor: "#000"}}>
                    <bind render={this.buildChildren} bind={"color"} component={this}/>
                </div>
            </div>
        );
    }

    buildChildren(): GinkgoNode {
        return <span style={{color: this.state.color}}>children node</span>
    }

    componentDidMount(): void {
        console.log("=", this.bodyEl);
        setTimeout(() => {
            this.animEl.instance.animation({width: 200, height: 200});
        }, 3000);

        setTimeout(() => {
            this.setState({color: '#aaffcc'});
        }, 5000);
    }
}
