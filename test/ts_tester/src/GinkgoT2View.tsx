import Ginkgo, {HTMLComponent, RefObject} from "../carbon/Ginkgo";
import GinkgoT1View from "./GinkgoT1View";

Ginkgo.TakeParts.push("auth_1");

export default class GinkgoT2View extends Ginkgo.Component {
    private box?: RefObject<HTMLComponent> = Ginkgo.createRef();
    private span?: RefObject<HTMLComponent> = Ginkgo.createRef();
    private queryEl?: RefObject<HTMLComponent> = Ginkgo.createQuery(this, "div.ccc[dataid='c']");
    private i = 0;
    private url = "http://localhost:8080/valcode/image.jhtml";
    private url2 = "http://localhost:8080/valcode/image.jhtml";

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

                <div part={"auth_1"}>auth_1</div>
                <div part={"auth_2"}>auth_2</div>
                <img src={this.url2}
                     onClick={e => {
                         this.url2 = this.url + "?t=" + new Date().getTime();
                         this.forceRender();
                     }}/>
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
            console.log("query1 => ", this.query("div.ccc[dataid='c']"));
            console.log("query2 => ", this.queryEl.instance);
        });
    }
}
