import Ginkgo from "../../carbon/Ginkgo";
import "./NumberTextField.scss";
import TextField, {TextFieldProps} from "./TextField";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";

export interface NumberTextFieldProps extends TextFieldProps {

}

export default class NumberTextField<P extends NumberTextFieldProps> extends TextField<P> {
    protected static numberTextFieldSpinnerCls;
    protected static numberTextFieldSpinnerItemCls;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        NumberTextField.numberTextFieldSpinnerCls = this.getThemeClass("numberfield-spinner");
        NumberTextField.numberTextFieldSpinnerItemCls = this.getThemeClass("numberfield-spinner-item");
    }

    protected drawingFieldSpinner() {
        return (
            <div className={NumberTextField.numberTextFieldSpinnerCls}>
                <div className={NumberTextField.numberTextFieldSpinnerItemCls}
                     onClick={this.onSpinnerUpClick.bind(this)}>
                    <Icon icon={IconTypes.caretUp}/>
                </div>
                <div className={NumberTextField.numberTextFieldSpinnerItemCls}
                     onClick={this.onSpinnerDownClick.bind(this)}>
                    <Icon icon={IconTypes.caretDown}/>
                </div>
            </div>
        )
    }

    protected onSpinnerUpClick() {
        let value: any = this.inputEl.value;
        let v = parseFloat(value);
        if (isNaN(v)) {
            value = 1
        } else {
            v = v + 1;
            value = v;
        }
        this.value = value;
        this.inputEl.value = value;
    }

    protected onSpinnerDownClick() {
        let value: any = this.inputEl.value;
        let v = parseFloat(value);
        if (isNaN(v)) {
            value = 0
        } else {
            v = v - 1;
            value = v;
        }

        this.value = value;
        this.inputEl.value = value;
    }

    protected onInputKeyUp(e) {
        let value: any = this.inputEl.value;
        let number = [], str = "" + value;
        for (let i = 0; i < str.length; i++) {
            let char = str.charAt(i);
            if ((char >= '0' && char <= '9')) {
                number.push(char);
            }
            if (char == '.' && number.indexOf(".") == -1 && number.length > 0) {
                number.push(char);
            }
        }

        this.inputEl.value = number.join("");
        super.onInputKeyUp(e);
    }
}
