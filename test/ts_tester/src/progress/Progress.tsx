import Ginkgo, {CSSProperties, GinkgoElement, GinkgoNode, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import "./Progress.scss";

export interface ProgressProps extends ComponentProps {
    percent?: number;
    text?: string;
    onTextRender?: (percent?: number) => string;
}

export default class Progress<P extends ProgressProps> extends Component<P> {
    protected static progressCls;
    protected static progressBarCls;
    protected static progressBarTextCls;
    protected static progressTextCls;

    protected progressBarTextRef?: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected percent?: number = this.props.percent;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);
        Progress.progressCls = this.getThemeClass("progress");
        Progress.progressBarCls = this.getThemeClass("progress-bar");
        Progress.progressTextCls = this.getThemeClass("progress-text");
        Progress.progressBarTextCls = this.getThemeClass("progress-bar-text");
    }

    protected drawing(): GinkgoNode | GinkgoElement[] {
        let style = {width: "0%"};
        if (this.percent) {
            style.width = this.percent + "%";
        }


        let text;
        if (this.props.text) {
            text = this.percent + "% " + (this.props.text || "completed");
        }
        if (this.props.onTextRender) {
            text = this.props.onTextRender(this.percent);
        }
        let text1Els, text2Els;
        if (text) {
            text1Els = (
                <div ref={this.progressBarTextRef} className={Progress.progressBarTextCls}>
                    <span className={Progress.progressTextCls}>{text}</span>
                </div>
            )
            text2Els = (
                <span className={Progress.progressTextCls}>{text}</span>
            )
        }
        return [
            <div className={Progress.progressBarCls} style={style}>
                {text1Els}
            </div>,
            text2Els
        ];
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();

        if (this.progressBarTextRef && this.progressBarTextRef.instance) {
            let dom = this.progressBarTextRef.instance.dom as HTMLElement;
            dom.style.width = this.getWidth() + "px";
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(Progress.progressCls);
        return arr;
    }

    protected getRootStyle(): CSSProperties {
        let style = super.getRootStyle();
        return style;
    }

    setPercent(percent?: number) {
        this.percent = percent;
        this.redrawing();
    }
}
