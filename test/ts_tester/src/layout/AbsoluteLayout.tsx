import Ginkgo, {CSSProperties, GinkgoElement, GinkgoNode, HTMLComponent} from "../../carbon/Ginkgo";
import "./AbsoluteLayout.scss";
import Component, {ComponentProps} from "../component/Component";
import Container from "../component/Container";


export interface AbsoluteLayoutProps extends ComponentProps {

}

export default class AbsoluteLayout extends Container<AbsoluteLayoutProps> {
    protected static absoluteLayoutCls;
    protected static absoluteLayoutClsBody;
    protected absBodyRef: HTMLComponent;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        AbsoluteLayout.absoluteLayoutCls = this.getThemeClass("abs-layout");
        AbsoluteLayout.absoluteLayoutClsBody = this.getThemeClass("abs-layout-body");
    }

    drawing(): GinkgoNode {
        return (
            <div
                ref={c => this.absBodyRef = c}
                className={AbsoluteLayout.absoluteLayoutClsBody}
            >
                {this.props.children}
            </div>
        );
    }

    componentDidMount(): void {
        super.componentDidMount();
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(AbsoluteLayout.absoluteLayoutCls);
        return arr;
    }
}

export interface AbsoluteLayoutItemProps extends ComponentProps {
    x: number;
    y: number;
    zIndex?: number;
}

export class AbsoluteLayoutItem<P extends AbsoluteLayoutItemProps> extends Component<P> {
    protected static absoluteLayoutClsItem;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        AbsoluteLayoutItem.absoluteLayoutClsItem = "abs-layout-item";
    }

    protected drawing(): GinkgoElement | undefined | null | GinkgoElement[] {
        if (this.props.children.length > 1) {
            throw Error("AbsoluteLayoutItem children only one Component");
        }
        return this.props.children;
    }

    protected getRootStyle(): CSSProperties {
        let style = super.getRootStyle();
        if (this.props.x != undefined) {
            style.left = this.props.x;
        }
        if (this.props.y != undefined) {
            style.top = this.props.y;
        }
        if (this.props.zIndex != undefined) {
            style.zIndex = this.props.zIndex;
        }
        return style;
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(AbsoluteLayoutItem.absoluteLayoutClsItem);
        return arr;
    }
}
