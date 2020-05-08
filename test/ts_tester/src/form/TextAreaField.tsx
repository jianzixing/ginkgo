import Ginkgo, {GinkgoElement, GinkgoNode, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import TextField, {TextFieldProps} from "./TextField";
import "./TextAreaField.scss";

export interface TextAreaFieldProps extends TextFieldProps {
    rows?: number;
    cols?: number;
}

export default class TextAreaField<P extends TextAreaFieldProps> extends TextField<P> {
    protected static textAreaFieldInputCls;

    protected textAreaEl: RefObject<HTMLComponent> = Ginkgo.createRef();

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TextAreaField.textAreaFieldInputCls = this.getThemeClass("textarea-input");
    }

    protected drawingFieldBodyInner(): GinkgoNode | GinkgoElement[] {
        let readonly = !!(this.readonly ? this.readonly : this.props.editable);
        let attrs = {};
        if (readonly) attrs = {readonly: readonly};
        if (this.props.rows > 0) attrs['rows'] = this.props.rows;
        if (this.props.cols > 0) attrs['cols'] = this.props.cols;

        return (
            <textarea
                ref={this.textAreaEl}
                onKeyUp={this.onInputKeyUp.bind(this)}
                {...attrs}
                autocomplete="off"
                className={TextAreaField.textAreaFieldInputCls}
                placeholder={this.props.placeholder || ""}
                onChange={e => {
                    this.triggerOnChangeEvents(this, this.getValue())
                }}
            >{this.value || ""}</textarea>
        );
    }

    setValue(value: any): void {
        this.value = value;
        this.redrawingFieldBody();
    }

    getValue(): any {
        if (this.textAreaEl && this.textAreaEl.instance) {
            let area = this.textAreaEl.instance.dom as HTMLAreaElement;
            return (area as any).value;
        }
    }

    getRowValue(): any {
        return this.getValue();
    }

    focus(): void {
        if (this.textAreaEl.instance && this.textAreaEl.instance.dom) {
            (this.textAreaEl.instance.dom as HTMLTextAreaElement).focus();
        }
    }
}
