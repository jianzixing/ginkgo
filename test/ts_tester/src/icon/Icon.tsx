import Ginkgo, {GinkgoElement, HTMLComponent, CSSProperties} from "../../carbon/Ginkgo";
import "./fontawesome.scss";
import "./solid.scss";
import "./regular.scss";
import "./brands.scss";
import "./Icon.scss";

export interface IconProps extends GinkgoElement {
    icon?: string;
    style?: CSSProperties;
    className?: string;
    onClick?: (e) => void;
}


export default class Icon extends Ginkgo.Component<IconProps> {
    protected static extCls = "x-icon-ext";
    protected static fixExtNames: { [key: string]: string } = {
        "ext-sort-alpha-asc": "x-icon-ext-sort-alpha-asc",
        "ext-sort-alpha-desc": "x-icon-ext-sort-alpha-desc",
        "ext-columns": "x-icon-ext-columns",
        "ext-checked-sel": "x-ext-checked-sel",
        "ext-checked-unset": "x-ext-checked-unset",
        "slider-thumb": "x-slider-thumb",
        "tbar-page-first": "x-tbar-page-first",
        "tbar-page-prev": "x-tbar-page-prev",
        "tbar-page-next": "x-tbar-page-next",
        "tbar-page-last": "x-tbar-page-last",
        "grid-cell-modify": "x-grid-cell-modify"
    };

    protected iconEl?: HTMLComponent;

    render() {
        return (
            <i onClick={e => {
                this.props && this.props.onClick && this.props.onClick(e);
            }} ref={instance => this.iconEl = instance}></i>)
    }

    componentReceiveProps(props: IconProps) {
        if (props.icon) {
            let arr;
            if (Icon.fixExtNames[this.props.icon]) {
                arr = [Icon.extCls, Icon.fixExtNames[this.props.icon]];
            } else {
                arr = ["fa", "fa-" + props.icon];
            }
            if (props.className) arr.push(props.className);
            this.iconEl && this.iconEl.update({style: props.style, className: arr.join(" ")});
        }
    }
}
