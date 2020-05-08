import Ginkgo, {GinkgoElement, GinkgoNode} from "../../carbon/Ginkgo";
import "./TagField.scss";
import ComboboxField, {ComboboxFieldProps, ComboboxModel} from "./ComboboxField";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";

export interface TagFieldProps extends ComboboxFieldProps {

}

export default class TagField<P extends TagFieldProps> extends ComboboxField<P> {
    protected static tagFieldTagsCls;
    protected static tagFieldTagCls;
    protected static tagFieldTagNameCls;
    protected static tagFieldTagIconCls;

    protected values: Array<ComboboxModel> = [];

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        TagField.tagFieldTagsCls = this.getThemeClass("tagfield-tags");
        TagField.tagFieldTagCls = this.getThemeClass("tagfield-tag");
        TagField.tagFieldTagNameCls = this.getThemeClass("tagfield-tag-name");
        TagField.tagFieldTagIconCls = this.getThemeClass("tagfield-tag-icon");
    }

    protected onItemClick(e, sel: ComboboxModel) {
        this.values.push(sel);
        this.redrawingFieldBody();

        this.triggerOnChangeEvents(this, this.getValue());
    }

    protected drawingFieldBodyInner(): GinkgoNode | GinkgoElement[] {
        let items = [];
        if (this.values) {
            for (let v of this.values) {
                items.push(
                    <li className={TagField.tagFieldTagCls}>
                        <div className={TagField.tagFieldTagNameCls}>{v.text}</div>
                        <Icon className={TagField.tagFieldTagIconCls}
                              icon={IconTypes.close}
                              onClick={e => {
                                  this.values = this.values.filter(value => value != v);
                                  this.redrawingFieldBody();
                                  this.triggerOnChangeEvents(this, this.getValue());
                              }}/>
                    </li>
                );
            }
        }
        return <ul className={TagField.tagFieldTagsCls}>{items}</ul>;
    }

    setValue(value: any): void {
        this.values = [];
        if (value instanceof Array) {
            for (let v of value) {
                this.setValueSingle(v);
            }
            this.redrawingFieldBody();
        } else if (typeof value == "object") {
            this.setValueSingle(value);
            this.redrawingFieldBody();
        } else if (typeof value == "string") {
            let cv: ComboboxModel = {
                text: value
            }
            this.values.push(cv);
            this.redrawingFieldBody();
        } else {
            this.redrawingFieldBody();
        }
    }

    protected setValueSingle(value: any) {
        if (typeof value == "object") {
            let v = value[this.props.valueField || "id"];
            let isSetValue = false;
            if (this.models) {
                for (let model of this.models) {
                    if (model.value == v) {
                        this.values.push(model);
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
                this.values.push(cv);
            }
        } else {
            let isSetValue = false;
            if (this.models) {
                for (let model of this.models) {
                    if (model.value == value) {
                        this.values.push(model);
                        isSetValue = true;
                    }
                }
            }

            if (!isSetValue) {
                let cv: ComboboxModel = {
                    text: value
                }
                this.values.push(cv);
            }
        }
    }

    getValue(): any {
        let values = [];
        if (this.values) {
            this.values.map(value => {
                if (value.value) values.push(value.value);
            });
        }
        if (values.length == 0) {
            this.values.map(value => {
                if (value.text) values.push(value.text);
            });
        }
        return values.length > 0 ? values : undefined;
    }

    getRowValue(): any {
        if (this.values) {
            return this.values.filter(value => value.data);
        }
        return this.values;
    }
}
