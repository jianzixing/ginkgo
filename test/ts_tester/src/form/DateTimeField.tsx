import Ginkgo, {GinkgoNode, RefObject} from "../../carbon/Ginkgo";
import "./DateTimeField.scss";

import TextField, {TextFieldProps} from "./TextField";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import DatePicker from "../datepicker/DatePicker";

export interface DateFieldProps extends TextFieldProps {
    format?: string;
    showTime?: boolean;
}

export default class DateTimeField<P extends DateFieldProps> extends TextField<P> {
    protected static dateFieldSpinnerCls;
    protected static dateFieldSpinnerItemCls;

    protected pickerWidth = 310;
    protected datePicker: RefObject<DatePicker<any>> = Ginkgo.createRef();

    protected value: Date;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        DateTimeField.dateFieldSpinnerCls = this.getThemeClass("datefield-spinner");
        DateTimeField.dateFieldSpinnerItemCls = this.getThemeClass("datefield-spinner-item");
    }

    protected drawingFieldSpinner() {
        return (
            <div className={DateTimeField.dateFieldSpinnerCls}>
                <div className={DateTimeField.dateFieldSpinnerItemCls}
                     onClick={this.onSpinnerDownClick.bind(this)}>
                    <Icon icon={IconTypes.calendar}/>
                </div>
            </div>
        );
    }

    protected drawingFieldPicker(): GinkgoNode {
        return (
            <DatePicker
                border={false}
                ref={this.datePicker}
                date={this.value}
                showTime={this.props.showTime}
                onSelectedDate={date => {
                    this.value = date;
                    if (this.props.format) {
                        this.triggerOnChangeEvents(this, this.formatDate(this.value, this.props.format));
                    } else {
                        this.triggerOnChangeEvents(this, this.value);
                    }
                    this.closePicker();
                    this.fillInputValue();
                }}
            />);
    }

    protected resizeFieldPicker(from: number) {
        super.resizeFieldPicker(from);
    }

    protected onSpinnerDownClick(e) {
        if (this.isPickerShowing()) {
            this.closePicker();
        } else {
            this.showPicker();
        }
    }

    protected fillInputValue() {
        if (this.value) {
            this.inputEl.value = this.formatDate(this.value, this.props.format ? this.props.format : "yyyy-MM-dd HH:mm:ss");
        } else {
            this.inputEl.value = "";
        }
    }

    setValue(value: Date | string): void {
        super.setValue(value);

        if (value instanceof Date) {
            this.value = value;
        } else if (typeof value === "string") {
            let s = value.split(" ");
            let s1 = s[0], s2 = s.length > 1 ? s[1] : null;
            let year = "0", month = "0", day = "0", hour = "0", minute = "0", second = "0";
            let cache = "", type = 0;
            for (let i = 0; i < s1.length; i++) {
                if (s1.charAt(i) >= '0' && s1.charAt(i) <= '9') {
                    cache += parseInt(s1.charAt(i));
                } else {
                    if (type == 0) year = cache;
                    if (type == 1) month = cache;
                    if (type == 2) day = cache;
                    type++;
                    cache = "";
                }
            }
            if (type == 2) day = cache;
            type = 0;
            cache = "";
            for (let i = 0; i < s2.length; i++) {
                if (s2.charAt(i) >= '0' && s2.charAt(i) <= '9') {
                    cache += parseInt(s2.charAt(i));
                } else {
                    if (type == 0) hour = cache;
                    if (type == 1) minute = cache;
                    if (type == 2) second = cache;
                    type++;
                    cache = "";
                }
            }
            if (type == 2) second = cache;

            let date = new Date(parseInt(year), parseInt(month), parseInt(day),
                parseInt(hour), parseInt(minute), parseInt(second));
            this.value = date;
        } else {
            this.value = null;
        }

        this.fillInputValue();
    }

    getValue(): any {
        if (this.value) {
            if (this.props.format) {
                return this.formatDate(this.value, this.props.format);
            }
            return this.value;
        }
    }

    getRowValue(): any {
        return this.value;
    }

    protected formatDate(date: Date, fmt: string) {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "H+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1,
                    (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
}
