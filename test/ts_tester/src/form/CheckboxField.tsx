import Ginkgo, {CSSProperties, InputComponent} from "../../carbon/Ginkgo";
import FormField, {FormFieldProps} from "./FormField";
import "./CheckboxField.scss";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";

export interface CheckboxFieldProps extends FormFieldProps {
    text?: string;
    checked?: boolean;
    checkAlign?: "left" | "center" | "right";
    itemStyle?: CSSProperties;
}

export default class CheckboxField<P extends CheckboxFieldProps> extends FormField<P> {
    protected static checkboxItemCls;
    protected static checkboxItemIconCls;
    protected static checkboxItemTextCls;
    protected static checkboxItemTextCenterCls;
    protected static checkboxItemTextLeftCls;
    protected static checkboxItemTextRightCls;

    protected value: boolean = this.props.checked;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        CheckboxField.checkboxItemCls = this.getThemeClass("checkbox-item");
        CheckboxField.checkboxItemIconCls = this.getThemeClass("checkbox-icon");
        CheckboxField.checkboxItemTextCls = this.getThemeClass("checkbox-text");
        CheckboxField.checkboxItemTextCenterCls = this.getThemeClass("checkbox-center");
        CheckboxField.checkboxItemTextLeftCls = this.getThemeClass("checkbox-left");
        CheckboxField.checkboxItemTextRightCls = this.getThemeClass("checkbox-right");
    }

    protected drawingFieldBody() {
        let cls = [CheckboxField.checkboxItemCls];
        let label;
        if (this.props.text) {
            label = <label className={CheckboxField.checkboxItemTextCls}>{this.props.text || ""}</label>;
        }

        return (
            <div className={cls} onClick={this.onFieldClick.bind(this)} style={this.props.itemStyle}>
                <Icon className={CheckboxField.checkboxItemIconCls}
                      icon={this.value ? IconTypes._extCheckedSel : IconTypes._extCheckedUnset}/>
                {label}
            </div>
        );
    }

    protected getFieldBodyClassName(): string[] | undefined {
        let arr = super.getFieldBodyClassName() || [];
        if (this.props.checkAlign == "left") arr.push(CheckboxField.checkboxItemTextLeftCls);
        if (this.props.checkAlign == "center") arr.push(CheckboxField.checkboxItemTextCenterCls);
        if (this.props.checkAlign == "right") arr.push(CheckboxField.checkboxItemTextRightCls);
        return arr;
    }


    compareUpdate(key: string, newValue: any, oldValue: any): boolean {
        if (key == 'checked' && this.value != newValue) {
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
