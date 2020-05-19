import Ginkgo, {HTMLComponent, RefObject} from "../carbon/Ginkgo";
import GinkgoT1View from "./GinkgoT1View";

export default class GinkgoT2View extends Ginkgo.Component {
    private box?: RefObject<HTMLComponent> = Ginkgo.createRef();
    private span?: RefObject<HTMLComponent> = Ginkgo.createRef();
    private i = 0;

    render() {
        let testkeys = [];
        if (this.i == 0) {
            testkeys.push(<span key={1}>span1</span>);
            testkeys.push(<span key={2}>span2</span>);
        } else {
            testkeys.push(<span key={2}>span2</span>);
            testkeys.push(<span key={1}>span1</span>);
        }

        let el1 = [];
        if (this.i == 0) {
            el1.push(<span>T1</span>)
            el1.push(<span>T2</span>)
        } else {
            el1.push(<span className={"b"}>T1</span>)
            el1.push(<span>T2</span>)
        }
        return (
            <GinkgoT1View>
                <div>这是T2组件内容，T1组件子</div>
                <div id={"box-id"} ref={this.box}>
                    <span ref={this.span}>第一个文字</span>
                </div>
                <Ginkgo.Fragment>
                    <div>
                        <span>Hello Ginkgo!</span>
                    </div>
                </Ginkgo.Fragment>
                <div setInnerHTML={"<span>html字符串</span>"}></div>

                <div className={"ccc"}
                     style={{display: "block", width: 300, height: 80}}
                     dataid={"c"}>
                    {testkeys}
                </div>

                <div style={{display: "block", width: 300, height: 80}}>
                    {el1}
                </div>
            </GinkgoT1View>)
    }

    componentDidMount() {
        this.box.instance.overlap(<span ref={this.span}>第二个文字</span>);
        if (this.span.instance.dom) {
            setTimeout(() => {
                // this.span.instance.dom.innerHTML = "第三个文字";
            }, 1000);
        }

        Ginkgo.get("https://www.baidu.com").then(data => {
            console.log(data)
        });

        // setTimeout(() => {
        //     this.forceRender();
        //     console.log("force render ...")
        // }, 6000);

        setTimeout(() => {
            this.i = 1;
            this.forceRender();
            console.log("force render ...")
        }, 6000);

        setTimeout(() => {
            console.log("query => ", this.query("div.ccc[dataid='c']"));
        });
    }
}
