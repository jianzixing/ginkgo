import Ginkgo, {CSSProperties, GinkgoNode, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import "./CascaderField.scss";
import ComboboxField, {ComboboxFieldProps, ComboboxModel} from "./ComboboxField";
import Loading from "../loading/Loading";
import DataEmpty from "../empty/DataEmpty";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";

export interface CascaderModel extends ComboboxModel {
    parent?: CascaderModel;
    children?: Array<CascaderModel>;
}

export interface CascaderFieldProps extends ComboboxFieldProps {
    models?: Array<CascaderModel>;
    onShowText?: (cms: Array<CascaderModel>) => string;
    childrenField?: string;
}

/**
 * 级联选择
 * 例如省市区，公司层级，事物分类等
 */
export default class CascaderField<P extends CascaderFieldProps> extends ComboboxField<P> {
    protected static cascaderFieldPickerCls;
    protected static cascaderFieldPickerUlCls;
    protected static cascaderFieldPickerLiCls;
    protected static cascaderFieldPickerSelectedCls;
    protected static cascaderFieldPickerIconCls;
    protected static cascaderFieldPickerTextCls;
    protected static cascaderFieldPickerListBorderCls;

    protected cascaderFieldPickerRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected pickerAlign: "right" | "left" = "left";
    protected isAutoPickerWidth = false;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        CascaderField.cascaderFieldPickerCls = this.getThemeClass("cascader-field-picker");
        CascaderField.cascaderFieldPickerUlCls = this.getThemeClass("cascader-field-ul");
        CascaderField.cascaderFieldPickerLiCls = this.getThemeClass("cascader-field-li");
        CascaderField.cascaderFieldPickerSelectedCls = this.getThemeClass("cascader-field-selected");
        CascaderField.cascaderFieldPickerIconCls = this.getThemeClass("cascader-field-icon");
        CascaderField.cascaderFieldPickerTextCls = this.getThemeClass("cascader-field-text");
        CascaderField.cascaderFieldPickerListBorderCls = this.getThemeClass("cascader-field-list-border");
    }

    componentWillMount(): void {
        super.componentWillMount();
        debugger
    }

    protected buildFieldPicker(): GinkgoNode {
        if (this.props.data && !this.props.models) {
            this.models = this.data2Models(this.props.data);
        } else if (this.models) {
            this.convertModels(this.models);
        }

        let modelList: Array<Array<CascaderModel>> = this.getShowModelList();

        let list = [], style: CSSProperties = {};
        if (this.isLoading) {
            list = (
                <Loading/>
            );
            style.height = 80;
        } else {
            if (modelList && modelList.length > 0) {
                let i = 0;
                for (let models of modelList) {
                    let items = [];
                    for (let dt of models) {
                        let cls = [CascaderField.cascaderFieldPickerLiCls];
                        if (dt.selected) {
                            cls.push(CascaderField.cascaderFieldPickerSelectedCls);
                            if (this.inputEl) this.inputEl.value = dt.text;
                        }
                        let hasCaretRight = dt.children && dt.children.length > 0;
                        let icon;
                        if (hasCaretRight) {
                            icon = (<div className={CascaderField.cascaderFieldPickerIconCls}>
                                <Icon icon={IconTypes.caretRight}/>
                            </div>)
                        }

                        items.push(
                            <li className={cls} onClick={(e) => {
                                if (dt.children && dt.children.length > 0) {
                                    this.value = dt;
                                    this.redrawingPickerBody();
                                } else {
                                    this.onItemClick(e, dt);
                                }
                            }}>
                                <span className={CascaderField.cascaderFieldPickerTextCls}>{dt.text}</span>
                                {icon}
                            </li>);
                    }

                    let listCls = [CascaderField.cascaderFieldPickerUlCls];
                    if (i != modelList.length - 1) listCls.push(CascaderField.cascaderFieldPickerListBorderCls);
                    list.push(
                        <ul className={listCls}>
                            {items}
                        </ul>
                    );
                    i++;
                }
            } else {
                list = (
                    <DataEmpty/>
                )
            }
        }

        if (this.isAutoPickerWidth) {
            style.float = "none";
        }

        return (
            <div
                ref={this.cascaderFieldPickerRef}
                className={CascaderField.cascaderFieldPickerCls}
                style={style}>
                {list}
            </div>)
    }

    protected onItemClick(e, sel: ComboboxModel) {
        this.value = sel;
        if (this.inputEl) {
            let cm = sel as CascaderModel;
            let cms = this.model2Array(cm);
            let text = cm.text;
            if (this.props.onShowText) {
                text = this.props.onShowText(cms);
            } else {
                text = this.showCascaderModels(cms);
            }
            this.inputEl.value = text;
            this.triggerOnChangeEvents(this, this.getValue());
        }
        this.closePicker();
    }

    protected getShowModelList(): Array<Array<CascaderModel>> {
        if (this.value) {
            let r = [];
            let cm = this.value as CascaderModel;
            this.getShowModelListParent(cm, r);
            if (cm.children) {
                r.push(cm.children);
            }
            return r;
        } else {
            if (this.models) {
                return [this.models];
            }
        }
    }

    protected getShowModelListParent(model: CascaderModel, arr: Array<Array<CascaderModel>>) {
        if (model.parent) {
            this.getShowModelListParent(model.parent, arr);
            arr.push(model.parent.children);
        } else {
            arr.push(this.models);
        }
    }

    protected convertModels(models: Array<CascaderModel>) {
        if (models) {
            for (let m of models) {
                let cm: CascaderModel = m;
                let child = cm.children;
                if (child) {
                    for (let c of child) {
                        c.parent = m;
                    }
                }
                this.convertModels(child);
            }
        }
    }

    protected data2Models(data) {
        let models: Array<CascaderModel> = [];
        for (let dt of data) {
            let item: CascaderModel = {
                value: dt[this.props.valueField || 'id'],
                text: typeof dt == "object" ? dt[this.props.displayField || 'text'] : dt,
                selected: this.props.selectData ? this.props.selectData == dt : false,
                data: dt
            };
            if (!item.value) {
                item.value = item.text;
            }
            models.push(item);

            let children = dt.children;
            if (this.props.childrenField) {
                children = dt[this.props.childrenField];
            }
            if (children) {
                let child = this.data2Models(children);
                if (child) {
                    for (let c of child) {
                        c.parent = item;
                    }
                    item.children = child;
                }
            }
        }
        return models;
    }

    protected redrawingPickerBody() {
        super.redrawingPickerBody();
        if (this.models) {
            this.isAutoPickerWidth = false;
        } else {
            this.isAutoPickerWidth = true;
        }
        this.resizeFieldPicker(2);
    }

    protected resizeFieldPicker(from: number) {
        super.resizeFieldPicker(from);
        this.resizePickerWidthByContent();
    }

    protected resizePickerWidthByContent() {
        if (this.cascaderFieldPickerRef && this.cascaderFieldPickerRef.instance) {
            let dom = this.cascaderFieldPickerRef.instance.dom as HTMLElement;

            let list = dom.children;
            let height = 0;
            if (list && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    let el = list.item(i) as HTMLElement;
                    if (height < el.offsetHeight) {
                        height = el.offsetHeight;
                    }
                }
            }
            if (list && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    let el = list.item(i) as HTMLElement;
                    el.style.height = height + "px";
                }
            }
        }
    }

    protected model2Array(cm: CascaderModel): Array<CascaderModel> {
        let parent = cm.parent;
        if (parent) {
            let arr = this.model2Array(parent);
            arr.push(cm);
            return arr;
        } else {
            let arr = [];
            arr.push(cm);
            return arr;
        }
    }

    protected showCascaderModels(cms: Array<CascaderModel>): string {
        if (cms) {
            let text = "";
            let i = 0;
            for (let cmi of cms) {
                text += cmi.text;
                i++;
                if (i != cms.length) text += " / ";
            }
            return text;
        }
    }

    setValue(value: any): void {
        if (!this.models || this.models.length == 0) {
            if (this.props.data && !this.props.models) {
                this.models = this.data2Models(this.props.data);
            }
            if (this.props.store && !this.props.models) {
                this.cacheSetValue = value;
                this.props.store.load();
                return;
            }
        } else {
            this.convertModels(this.models);
        }

        if (this.models) {
            if (value instanceof Array) {
                let arr = [];
                for (let v of value) {
                    let m = this.getModelByCascaderValue(v, this.models, 1);
                    if (m) arr.push(m);
                }
                let text = this.showCascaderModels(arr);
                this.inputEl.value = text;

                this.value = arr[arr.length - 1];
            } else if (typeof value == "object") {
                let m = this.getModelByCascaderValue(value, this.models, 2);
                let arr = this.model2Array(m);
                let text = this.showCascaderModels(arr);
                this.inputEl.value = text;

                this.value = m;
            } else {
                let m = this.getModelByCascaderValue(value, this.models, 1);
                let arr = this.model2Array(m);
                let text = this.showCascaderModels(arr);
                this.inputEl.value = text;

                this.value = m;
            }
        }
    }

    protected getModelByCascaderValue(value: any, models: Array<CascaderModel>, type: number): CascaderModel {
        if (models && models.length > 0) {
            for (let model of models) {
                if (model) {
                    if (type == 1 && model.value == value) {
                        return model;
                    } else if (type == 2 && (model.data == value || model == value)) {
                        return model;
                    } else {
                        let m = this.getModelByCascaderValue(value, model.children, type);
                        if (m) return m;
                    }
                }
            }
        }
    }

    getValue(): any {
        let cms: Array<CascaderModel> = this.model2Array(this.value);

        if (cms && cms.length > 0) {
            let arr = [];
            for (let cm of cms) {
                arr.push(cm.value);
            }

            return arr;
        }
    }

    getRowValue(): any {
        let cms: Array<CascaderModel> = this.model2Array(this.value);

        if (cms && cms.length > 0) {
            let arr = [];
            for (let cm of cms) {
                arr.push(cm.data);
            }

            return arr;
        }
        return cms;
    }
}
