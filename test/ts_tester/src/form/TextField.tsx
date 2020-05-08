import Ginkgo, {GinkgoElement, GinkgoNode, InputComponent} from "../../carbon/Ginkgo";
import "./TextField.scss";
import FormField, {FormFieldProps} from "./FormField";

export interface TextFieldProps extends FormFieldProps {
    placeholder?: string;
    value?: number | string;
    editable?: boolean;
    type?: "text" | "password";
    focusSelection?: boolean;
}

export default class TextField<P extends TextFieldProps> extends FormField<P> {
    protected static textFieldCls;
    protected static textFieldBodyCls;
    protected static textFieldInputCls;

    protected fieldBorder = true;
    protected readonly = false;
    protected inputEl: InputComponent;
    protected value?: any = this.props.value;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TextField.textFieldCls = this.getThemeClass("textfield");
        TextField.textFieldBodyCls = this.getThemeClass("textfield-body");
        TextField.textFieldInputCls = this.getThemeClass("textfield-input");
    }

    componentReceiveProps(props: P, context?: { oldProps: P; type: "new" | "mounted" }) {
        super.componentReceiveProps(props, context);
    }

    protected drawingFieldBody() {
        let spinner = this.drawingFieldSpinner();
        let inputEl = this.drawingFieldBodyInner();

        return (
            <div className={TextField.textFieldCls}>
                <div className={TextField.textFieldBodyCls}>
                    {inputEl}
                </div>
                {spinner}
            </div>
        );
    }

    protected compareUpdate(key: string, newValue: any, oldValue: any): boolean {
        if (key == "value" && this.value != newValue) {
            this.value = newValue;
            return true;
        }
        return false;
    }

    protected drawingFieldSpinner(): GinkgoNode {
        return null;
    }

    protected drawingFieldBodyInner(): GinkgoNode | GinkgoElement[] {
        let readonly = !!(this.readonly ? this.readonly : this.props.editable);
        let attrs = {};
        if (readonly) attrs = {readonly: readonly};
        if (this.props.type) attrs['type'] = this.props.type;

        return (
            <input
                ref={c => this.inputEl = c}
                onKeyUp={this.onInputKeyUp.bind(this)}
                className={TextField.textFieldInputCls}
                value={this.value || ""}
                type={"text"}
                {...attrs}
                autocomplete="off"
                placeholder={this.props.placeholder || ""}
                onChange={e => {
                    this.value = "" + this.inputEl.value;
                    this.triggerOnChangeEvents(this, this.value);
                }}
                onFocus={e => {
                    if (this.props.focusSelection) {
                        this.fieldFocusBorder = true;
                        this.redrawing();
                        let input = this.inputEl.dom as HTMLInputElement;
                        input.setSelectionRange(0, 0);
                        input.setSelectionRange(0, ("" + this.value).length);
                    }
                }}
                onBlur={e => {
                    if (this.props.focusSelection) {
                        this.fieldFocusBorder = false;
                        this.redrawing();
                    }
                }}/>
        );
    }

    protected onInputKeyUp(e) {
        this.validate();
    }

    setValue(value: any): void {
        if (this.inputEl) {
            if (value) {
                if (typeof value === "object") {
                    value = JSON.stringify(value);
                }
                this.inputEl.value = value;
                this.value = value;
            } else {
                this.inputEl.value = "";
                this.value = "";
            }
        }
    }

    getValue(): any {
        return this.inputEl.value;
    }

    getRowValue(): any {
        return this.getValue();
    }

    focus(): void {
        if (this.inputEl.dom) {
            (this.inputEl.dom as HTMLInputElement).focus();
        }
    }
}
