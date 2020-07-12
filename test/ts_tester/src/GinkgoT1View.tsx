import Ginkgo, {GinkgoNode, GinkgoElement, HTMLComponent, InputComponent, RefObject} from "../carbon/Ginkgo";

export default class GinkgoT1View extends Ginkgo.Component {
    private bodyEl?: RefObject<HTMLComponent> = Ginkgo.createRef();
    private inputEl?: RefObject<InputComponent> = Ginkgo.createRef();
    private animEl?: RefObject<HTMLComponent> = Ginkgo.createRef();

    state = {
        color: '#ffffff',
        count: 0
    };

    render(): GinkgoNode {
        console.log("......")
        return (
            <div ref={this.bodyEl} name={'a'}>
                {this.props.children}
                <input ref={this.inputEl} onChange={(e) => {
                    console.log(this.inputEl.instance.value)
                }}/>
                <div
                    ref={this.animEl}
                    style={{width: 100, height: 100, backgroundColor: "#000"}}>
                    <bind render={this.buildChildren} component={this}/>
                </div>
            </div>
        );
    }

    buildChildren(): GinkgoNode {
        console.log(this.state)
        return <span style={{color: this.state.color}}>children node</span>
    }

    componentDidMount(): void {
        console.log("=", this.bodyEl);
        setTimeout(() => {
            this.animEl.instance.animation({width: 200, height: 200});
        }, 3000);

        setTimeout(() => {
            this.setState({color: '#aaffcc'}, () => {
                console.log("state end")
            });
            this.setState({count: 1});
            this.setState({count: 2});
            this.setState({count: 3});
            this.setState({count: 4});
            this.setState({count: 5});

            console.log(this.query("div[name='a']"));
        }, 5000);
    }
}
