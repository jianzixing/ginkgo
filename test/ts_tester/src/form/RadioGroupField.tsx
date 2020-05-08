import Ginkgo, {InputComponent} from "../../carbon/Ginkgo";
import FormField, {FormFieldProps} from "./FormField";
import RadioField from "./RadioField";
import "./RadioGroupField.scss";

export interface RadioGroupModel {
    value?: number | string;
    text: string;
    selected?: boolean;
    data?: any;
}

export interface RadioGroupFieldProps extends FormFieldProps {
    itemWidth?: number | string;
    models?: Array<RadioGroupModel>;
    direction?: "horizontal" | "vertical";
}

export default class RadioGroupField<P extends RadioGroupFieldProps> extends FormField<P> {
    protected static radioGroupFieldBodyCls;
    protected static radioGroupFieldItemCls;
    protected static radioGroupFieldItemBodyCls;

    protected models: Array<RadioGroupModel> = this.props.models;
    protected value: RadioGroupModel;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        RadioGroupField.radioGroupFieldBodyCls = this.getThemeClass("radiogroup-body");
        RadioGroupField.radioGroupFieldItemCls = this.getThemeClass("radiogroup-item");
        RadioGroupField.radioGroupFieldItemBodyCls = this.getThemeClass("radiogroup-item-body");
    }

    protected drawingFieldBody() {
        let items = [];
        if (this.models) {
            for (let m of this.models) {
                if (m.selected) this.value = m;
                let style = {};
                if (this.props.direction == "vertical") style["width"] = "100%";
                items.push(
                    <div className={RadioGroupField.radioGroupFieldItemCls} style={style}>
                        <div className={RadioGroupField.radioGroupFieldItemBodyCls}>
                            <RadioField text={m.text || ""}
                                        selected={m.selected ? true : false}
                                        disabledFormChange={true}
                                        width={this.props.itemWidth > 0 ? this.props.itemWidth : undefined}
                                        onChange={e => {
                                            let oldValue = this.value ? this.value.value : undefined;
                                            for (let m2 of this.models) {
                                                m2.selected = false;
                                            }
                                            if (e.value) {
                                                m.selected = true;
                                                this.value = m;
                                            } else {
                                                this.value = this.value = null;
                                            }

                                            this.triggerOnChangeEvents(this, this.value.value, oldValue);
                                            this.redrawingFieldBody();
                                        }}/>
                        </div>
                    </div>)
            }
        }
        return <div className={RadioGroupField.radioGroupFieldBodyCls}>{items}</div>;
    }


    setValue(value: any): void {
        if (this.props.models) {
            for (let m of this.props.models) {
                m.selected = false;
            }

            let isSetValue = false;
            for (let m of this.props.models) {
                if (m.value == value || m.data == value) {
                    m.selected = true;
                    this.value = m;
                    isSetValue = true;
                    break;
                }
            }
            if (!isSetValue) {
                this.value = null;
            }
            this.redrawingFieldBody();
        }
    }

    getValue(): any {
        return this.value.value;
    }

    getRowValue(): any {
        if (this.value && this.value.data) {
            return this.value.data;
        }
        return this.value;
    }
}
