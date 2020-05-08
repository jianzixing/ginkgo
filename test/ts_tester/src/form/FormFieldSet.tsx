import Ginkgo, {GinkgoElement, GinkgoNode} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import "./FormFieldSet.scss";

export interface FormFieldSetProps extends ComponentProps {
    legend?: string;
}

export default class FormFieldSet<P extends FormFieldSetProps> extends Component<P> {
    protected static fieldSetCls;
    protected static fieldSetBodyCls;
    protected static fieldSetHeaderTextCls;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        FormFieldSet.fieldSetCls = this.getThemeClass("fieldset");
        FormFieldSet.fieldSetBodyCls = this.getThemeClass("fieldset-body");
        FormFieldSet.fieldSetHeaderTextCls = this.getThemeClass("fieldset-header-text");
    }

    render(): any {
        return (
            <fieldset
                ref={component => this.rootEl = component}
                className={this.getRootClassName.bind(this)}
                style={this.getRootStyle.bind(this)}>
                <legend>
                    <div className={FormFieldSet.fieldSetHeaderTextCls}>{this.props.legend}</div>
                </legend>
                <div className={FormFieldSet.fieldSetBodyCls}>
                    {this.props.children}
                </div>
            </fieldset>
        );
    }

    redrawing() {
        this.forceRender();
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(FormFieldSet.fieldSetCls);
        return arr;
    }
}
