import Ginkgo, {
    BindComponent,
    CSSProperties,
    GinkgoElement,
    GinkgoNode,
    InputComponent,
    RefObject
} from "../../carbon/Ginkgo";
import "./ComboboxField.scss";
import TextField, {TextFieldProps} from "./TextField";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import {StoreProcessor} from "../store/DataStore";
import Loading from "../loading/Loading";
import DataEmpty from "../empty/DataEmpty";

export interface ComboboxModel {
    value?: number | string;
    text: string;
    selected?: boolean;
    data?: any;
}

export interface ComboboxFieldProps extends TextFieldProps {
    placeholder?: string;
    models?: Array<ComboboxModel>;
    data?: Array<any>;
    valueField?: string;
    displayField?: string;
    selectData?: any;
}

export default class ComboboxField<P extends ComboboxFieldProps> extends TextField<P>
    implements StoreProcessor {
    protected static comboboxFieldSpinnerCls;
    protected static comboboxFieldSpinnerItemCls;
    protected static comboboxFieldPicker;
    protected static comboboxFieldPickerCnt;
    protected static comboboxFieldPickerList;
    protected static comboboxFieldPickerItem;
    protected static comboboxFieldPickerSelected;
    protected static comboboxFieldEmpty;

    protected value: ComboboxModel;
    protected models?: Array<ComboboxModel> = this.props.models;
    protected pickerBindRef: RefObject<BindComponent> = Ginkgo.createRef();
    protected isLoading?: boolean = false;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        ComboboxField.comboboxFieldSpinnerCls = this.getThemeClass("comboboxfield-spinner");
        ComboboxField.comboboxFieldSpinnerItemCls = this.getThemeClass("comboboxfield-spinner-item");
        ComboboxField.comboboxFieldPicker = this.getThemeClass("comboboxfield-picker");
        ComboboxField.comboboxFieldPickerCnt = this.getThemeClass("comboboxfield-picker-cnt");
        ComboboxField.comboboxFieldPickerList = this.getThemeClass("comboboxfield-picker-list");
        ComboboxField.comboboxFieldPickerItem = this.getThemeClass("comboboxfield-picker-item");
        ComboboxField.comboboxFieldPickerSelected = this.getThemeClass("picker-item-selected");
        ComboboxField.comboboxFieldEmpty = this.getThemeClass("comboboxfield-empty");
    }

    protected drawingFieldSpinner() {
        return (
            <div className={ComboboxField.comboboxFieldSpinnerCls}>
                <div className={ComboboxField.comboboxFieldSpinnerItemCls}
                     onClick={this.onSpinnerDownClick.bind(this)}>
                    <Icon icon={IconTypes.caretDown}/>
                </div>
            </div>
        );
    }

    protected onSpinnerDownClick(e) {
        if (this.isPickerShowing()) {
            this.closePicker();
        } else {
            this.showPicker({pickerCls: [ComboboxField.comboboxFieldPickerCnt]});
            if (this.props.store) {
                this.props.store.load();
            }
        }
    }

    protected drawingFieldPicker(): GinkgoNode {
        return <bind ref={this.pickerBindRef} render={this.buildFieldPicker.bind(this)}/>;
    }

    protected buildFieldPicker(): GinkgoNode {
        if (this.props.data && !this.props.models) {
            this.models = this.data2Models(this.props.data);
        }

        let list = null, style: CSSProperties = {};

        if (this.isLoading) {
            list = (
                <Loading/>
            );
            style.height = 80;
        } else {
            let items = [];
            if (this.models) {
                for (let dt of this.models) {
                    let cls = [ComboboxField.comboboxFieldPickerItem];
                    if (dt.selected) {
                        cls.push(ComboboxField.comboboxFieldPickerSelected);
                        if (this.inputEl) this.inputEl.value = dt.text;
                    }
                    items.push(<li className={cls} onClick={(e) => {
                        this.onItemClick(e, dt);
                    }}>{dt.text}</li>);
                }
            }

            if (items && items.length > 0) {
                list = (
                    <ul className={ComboboxField.comboboxFieldPickerList}>
                        {items}
                    </ul>
                );
            } else {
                list = (
                    <DataEmpty/>
                )
            }
        }

        return (
            <div
                className={ComboboxField.comboboxFieldPicker}
                style={style}>
                {list}
            </div>)
    }

    protected onItemClick(e, sel: ComboboxModel) {
        this.value = sel;
        if (this.inputEl) {
            this.inputEl.value = this.value.text;
            this.triggerOnChangeEvents(this, this.getValue());
        }
        this.closePicker();
    }

    protected data2Models(data) {
        let models: Array<ComboboxModel> = [];
        for (let dt of data) {
            models.push({
                value: dt[this.props.valueField || 'id'],
                text: typeof dt == "object" ? dt[this.props.displayField || 'text'] : dt,
                selected: this.props.selectData ? this.props.selectData == dt : false,
                data: dt
            })
        }
        return models;
    }

    storeBeforeLoad(): void {
        if (this.pickerBindRef && this.pickerBindRef.instance) {
            this.isLoading = true;
            this.pickerBindRef.instance.forceRender();
        }
    }

    storeLoaded(data: Object | Array<Object>, total?: number, originData?: any): void {
        this.isLoading = false;
        if (data && data instanceof Array) {
            this.models = this.data2Models(data);
            if (this.pickerBindRef && this.pickerBindRef.instance) {
                this.pickerBindRef.instance.forceRender();
            }
        } else {
            if (this.pickerBindRef && this.pickerBindRef.instance) {
                this.pickerBindRef.instance.forceRender();
            }
        }
    }

    setValue(value: any): void {
        if (this.props.data && !this.props.models) {
            this.models = this.data2Models(this.props.data);
        }

        if (typeof value == "object") {
            let v = value[this.props.valueField || "id"];
            let isSetValue = false;
            if (this.models) {
                for (let model of this.models) {
                    if (model.value == v) {
                        this.value = model;
                        isSetValue = true;
                    }
                }
            }

            if (!isSetValue) {
                let text = value[this.props.displayField || "text"];
                let cv: ComboboxModel = {
                    value: v,
                    text: text,
                    selected: true,
                    data: value
                }
                this.value = cv;
            }
            this.redrawingFieldBody();
        } else {
            let isSetValue = false;
            if (this.models) {
                for (let model of this.models) {
                    if (model.value == value) {
                        this.value = model;
                        isSetValue = true;
                    }
                }
            }

            if (!isSetValue) {
                if (value) {
                    this.value = {
                        text: value
                    }
                }
            } else {
                this.redrawingFieldBody();
            }
        }
        if (this.value) {
            this.inputEl.value = this.value.text || "";
        }
    }

    getValue(): any {
        if (this.value && this.value.value != undefined) {
            return this.value.value;
        }
        if (this.value && this.value.text) {
            return this.value.text;
        }
        if (this.value && this.value.data) {
            return this.value.data;
        }
        return super.getValue();
    }

    getRowValue(): any {
        if (this.value && this.value.data) {
            return this.value.data;
        }
        return this.value;
    }
}
