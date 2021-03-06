import Ginkgo, {GinkgoContainer, GinkgoElement, GinkgoNode} from "../carbon/Ginkgo";

export interface ViewNProps extends GinkgoElement {
    text?: string;
}

export default class ViewN extends Ginkgo.Component<ViewNProps> {
    private boxDom;
    state = {
        name: "1",
        style: {width: 50, marginLeft: 30, float: "left"}
    }

    render(): GinkgoNode {
        let els = [];
        for (let i = 0; i < 1000; i++) {
            if (i <= 1) {
                els.push(<span style={this.state.style} key={"" + i}>{i + ""}</span>);
            } else {
                els.push(<span style={this.state.style}>{i + ""}</span>);
            }
        }
        return <div style={{overflow: "hidden"}}>
            <div ref={"boxDom"} style={{width: 100, height: 20, backgroundColor: "#D0D0D0"}} onClick={e => {
                console.log(this.boxDom)
                let time = new Date().getTime();
                this.setState({name: "2", style: {width: 80, marginLeft: 30, float: "left"}}, () => {
                    console.log(new Date().getTime() - time + "ms");
                    console.log(GinkgoContainer.getCountContext());
                })
            }}></div>
            {els}
        </div>
    }
}

