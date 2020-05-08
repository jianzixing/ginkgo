import Ginkgo, {HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import "./Loading.scss";

export interface LoadingProps extends ComponentProps {
    text?: string;
}

export default class Loading<P extends LoadingProps> extends Ginkgo.Component<P> {

    protected rootEl: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected loadingEl: RefObject<HTMLComponent> = Ginkgo.createRef();

    render() {
        return (
            <div ref={this.rootEl} className={["x-component", "x-loading"]}>
                <div ref={this.loadingEl} className={"x-loading-msg"}>
                    <span>{this.props.text || "Loading..."}</span>
                </div>
            </div>
        );
    }

    componentDidMount(): void {
        this.calcPosition();
    }

    calcPosition() {
        if (this.rootEl && this.loadingEl && this.loadingEl.instance) {
            let rootDom = this.rootEl.instance.dom as HTMLElement;
            let loadDom = this.loadingEl.instance.dom as HTMLElement;
            loadDom.style.left = (rootDom.offsetWidth - loadDom.offsetWidth) / 2 + "px";
            loadDom.style.top = (rootDom.offsetHeight - loadDom.offsetHeight) / 2 + "px";
        }
    }
}
