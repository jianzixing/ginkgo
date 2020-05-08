import Ginkgo, {GinkgoElement, GinkgoNode} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import "./DataEmpty.scss";

export interface DataEmptyProps extends ComponentProps {
    text?: string;
}

export default class DataEmpty<P extends DataEmptyProps> extends Component<P> {
    protected static emptyCls;
    protected static emptyBodyCls;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        DataEmpty.emptyCls = this.getThemeClass("data-empty");
        DataEmpty.emptyBodyCls = this.getThemeClass("data-empty-body");
    }

    protected drawing(): GinkgoNode | GinkgoElement[] {
        return (
            <div className={DataEmpty.emptyBodyCls}>
                <Icon icon={IconTypes.boxOpen}/>
                <span>{this.props.text || "Empty Data"}</span>
            </div>
        );
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(DataEmpty.emptyCls)
        return arr;
    }
}
