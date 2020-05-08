import Ginkgo, {InputComponent} from "../../carbon/Ginkgo";
import FormField, {FormFieldProps} from "./FormField";
import "./RadioField.scss";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";

export interface RadioFieldProps extends FormFieldProps {
    text?: string;
    selected?: boolean;
}

export default class RadioField<P extends RadioFieldProps> extends FormField<P> {
    protected static radioItemCls;
    protected static radioItemIconCls;
    protected static radioItemTextCls;

    protected value: boolean = this.props.selected;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        RadioField.radioItemCls = this.getThemeClass("radio-item");
        RadioField.radioItemIconCls = this.getThemeClass("radio-icon");
        RadioField.radioItemTextCls = this.getThemeClass("radio-text");
    }

    protected drawingFieldBody() {
        return (
            <div className={RadioField.radioItemCls} onClick={this.onFieldClick.bind(this)}>
                <Icon className={RadioField.radioItemIconCls}
                      icon={this.value ? IconTypes.dotCircle : IconTypes.circle}/>
                <label className={RadioField.radioItemTextCls}>{this.props.text || ""}</label>
            </div>
        );
    }

    compareUpdate(key: string, newValue: any, oldValue: any): boolean {
        if (key == 'selected' && this.value != newValue) {
            this.value = newValue;
            this.redrawingFieldBody();
            return false;
        }
    }

    protected onFieldClick(e) {
        if (this.value) {
            this.value = false;
        } else {
            this.value = true;
        }
        this.redrawingFieldBody();
        this.triggerOnChangeEvents(this, this.value);
    }


    setValue(value: any): void {
        if (value) {
            this.value = true;
        } else {
            this.value = false;
        }
        this.redrawingFieldBody();
    }

    getValue(): any {
        return !!this.value;
    }

    getRowValue(): any {
        return !!this.value;
    }
}
