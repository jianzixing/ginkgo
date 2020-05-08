import Ginkgo, {CSSProperties, GinkgoNode} from "../../carbon/Ginkgo";
import "./CascaderField.scss";
import ComboboxField, {ComboboxFieldProps} from "./ComboboxField";
import Loading from "../loading/Loading";
import DataEmpty from "../empty/DataEmpty";

export interface CascaderFieldProps extends ComboboxFieldProps {

}

/**
 * 级联选择
 * 例如省市区，公司层级，事物分类等
 */
export default class CascaderField<P extends CascaderFieldProps> extends ComboboxField<P> {

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);


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
}
