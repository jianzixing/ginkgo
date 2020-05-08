import Ginkgo, {GinkgoTools, HTMLComponent} from "../../carbon/Ginkgo";
import Component from "../component/Component";
import "./ViewPort.scss";
import Container from "../component/Container";

export interface ViewPortProps {

}

export default class ViewPort extends Container<ViewPortProps> {
    protected static viewPortCls;
    protected isEnableWindowResize = true;
    protected layoutTimeoutHandler;

    constructor(props: ViewPortProps) {
        super(props);
    }

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        ViewPort.viewPortCls = this.getThemeClass("viewport");
    }

    componentWillMount(): void {
        document.body.style.padding = "0px";
        document.body.style.margin = "0px";
        document.body.style.overflow = "hidden";

        let size = GinkgoTools.getWindowSize();
        document.body.style.width = size.width + "px";
        document.body.style.height = size.height + "px";

        super.componentWillMount();
    }

    drawing() {
        return this.props.children;
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.setWindowSize();
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(ViewPort.viewPortCls);
        return arr;
    }

    private setWindowSize() {
        let size = GinkgoTools.getWindowSize();
        document.body.style.width = size.width + "px";
        document.body.style.height = size.height + "px";

        let children = this.children;
        if (children) {
            for (let child of children) {
                if (child instanceof Component) {
                    child.setSize(size.width, size.height);
                } else {
                    if (child instanceof HTMLComponent) {
                        let dom = child.dom;
                        if (dom instanceof HTMLElement) {
                            dom.style.width = size.width + "px";
                            dom.style.height = size.width + "px";
                        }
                    }
                }
            }

            if (this.layoutTimeoutHandler) {
                clearTimeout(this.layoutTimeoutHandler);
                this.layoutTimeoutHandler = undefined;
            }
            this.layoutTimeoutHandler = setTimeout(() => {
                this.layout();
                this.layoutTimeoutHandler = undefined;
            }, 100);
        }
    }

    onWindowResize() {
        this.setWindowSize();
    }
}
