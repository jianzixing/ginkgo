import Ginkgo, {InputComponent} from "../../carbon/Ginkgo";
import FormField, {FormFieldProps} from "./FormField";
import CheckboxField from "./CheckboxField";
import "./CheckboxGroupField.scss";

export interface CheckboxGroupModel {
    value?: number | string;
    text: string;
    checked?: boolean;
    data?: any;
}

export interface CheckboxGroupFieldProps extends FormFieldProps {
    itemWidth?: number | string;
    models?: Array<CheckboxGroupModel>;
    direction?: "horizontal" | "vertical";
}

export default class CheckboxGroupField<P extends CheckboxGroupFieldProps> extends FormField<P> {
    protected static checkboxGroupFieldBodyCls;
    protected static checkboxGroupFieldItemCls;
    protected static checkboxGroupFieldItemBodyCls;

    protected models: Array<CheckboxGroupModel> = this.props.models;
    protected value: Array<CheckboxGroupModel> = [];

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        CheckboxGroupField.checkboxGroupFieldBodyCls = this.getThemeClass("checkboxgroup-body");
        CheckboxGroupField.checkboxGroupFieldItemCls = this.getThemeClass("checkboxgroup-item");
        CheckboxGroupField.checkboxGroupFieldItemBodyCls = this.getThemeClass("checkboxgroup-item-body");
    }

    protected drawingFieldBody() {
        let items = [];
        if (this.models) {
            for (let m of this.models) {
                if (m.checked) this.value.push(m);
                let style = {};
                if (this.props.direction == "vertical") style["width"] = "100%";
                items.push(
                    <div className={CheckboxGroupField.checkboxGroupFieldItemCls} style={style}>
                        <div className={CheckboxGroupField.checkboxGroupFieldItemBodyCls}>
                            <CheckboxField text={m.text || ""}
                                           checked={m.checked ? true : false}
                                           disabledFormChange={true}
                                           width={this.props.itemWidth > 0 ? this.props.itemWidth : undefined}
                                           onChange={e => {
                                               let oldValue = [];
                                               this.value.map(i => {
                                                   if (i.value) oldValue.push(i.value)
                                               });
                                               if (e.value) {
                                                   this.value.push(m);
                                               } else {
                                                   this.value = this.value.filter(value => value != m);
                                               }
                                               let newValues = [];
                                               this.value.map(i => {
                                                   if (i.value) newValues.push(i.value);
                                               })
                                               this.triggerOnChangeEvents(this,
                                                   newValues.length > 0 ? newValues : undefined,
                                                   oldValue.length > 0 ? oldValue : undefined);
                                           }}/>
                        </div>
                    </div>)
            }
        }
        return <div className={CheckboxGroupField.checkboxGroupFieldBodyCls}>{items}</div>;
    }


    setValue(value: any): void {
        if (this.props.models) {
            for (let m of this.props.models) {
                m.checked = false;
            }
            let isSetValue = false;
            if (value instanceof Array) {
                for (let v of value) {
                    let b = this.setValueSingle(v);
                    if (b) isSetValue = true;
                }
            } else {
                isSetValue = this.setValueSingle(value);
            }

            if (!isSetValue) {
                this.value = [];
            }
            this.redrawingFieldBody();
        }
    }

    private setValueSingle(value: any): boolean {
        let isSetValue = false;
        for (let m of this.props.models) {
            if (m.value == value || m.data == value) {
                m.checked = true;
                this.value.push(m);
                isSetValue = true;
            }
        }
        return isSetValue;
    }

    getValue(): any {
        return this.value.filter(value => value.value);
    }

    getRowValue(): any {
        if (this.value) {
            return this.value.filter(value => value.data);
        }
        return this.value;
    }
}
