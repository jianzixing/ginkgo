import Ginkgo, {GinkgoElement} from "../../carbon/Ginkgo";
import "./MonthPicker.scss";
import Component, {ComponentProps} from "../component/Component";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";

export interface MonthPickerProps extends ComponentProps {
    onCancelClick?: () => void;
    onOkClick?: (data: { year: number, month: number }) => void;
}

export default class MonthPicker<P extends MonthPickerProps> extends Component<P> {
    protected static monthPickerCls;
    protected static monthPickerBodyCls;
    protected static monthPickerMonthsCls;
    protected static monthPickerYearsCls;
    protected static monthPickerBtnCls;
    protected static monthPickerItemCls;
    protected static monthPickerItemInnerCls;
    protected static monthPickerNavCls;
    protected static monthPickerNavBtnCls;
    protected static monthPickerSplitCls;
    protected static monthPickerSelectCls;

    protected currentYear: number;
    protected currentMonth: number;
    protected currentMonthStr: string;
    protected startYear: number;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        MonthPicker.monthPickerCls = this.getThemeClass("monthpicker");
        MonthPicker.monthPickerBodyCls = this.getThemeClass("monthpicker-body");
        MonthPicker.monthPickerMonthsCls = this.getThemeClass("monthpicker-months");
        MonthPicker.monthPickerYearsCls = this.getThemeClass("monthpicker-years");
        MonthPicker.monthPickerBtnCls = this.getThemeClass("monthpicker-btn");
        MonthPicker.monthPickerItemCls = this.getThemeClass("monthpicker-item");
        MonthPicker.monthPickerItemInnerCls = this.getThemeClass("monthpicker-item-inner");
        MonthPicker.monthPickerNavCls = this.getThemeClass("monthpicker-nav");
        MonthPicker.monthPickerNavBtnCls = this.getThemeClass("monthpicker-nav-btn");
        MonthPicker.monthPickerSplitCls = this.getThemeClass("monthpicker-split");

        MonthPicker.monthPickerSelectCls = this.getThemeClass("monthpicker-select");
    }

    protected drawing(): GinkgoElement<any> | string | undefined | null | GinkgoElement[] {
        let info = this.getMonthPickerInfo(),
            months = info.months,
            years = info.years,
            monthEls = [],
            yearEls = [],
            buttons, monthIndex = 0;

        for (let m of months) {
            let cls = [MonthPicker.monthPickerItemInnerCls];
            if (m == this.currentMonthStr) {
                cls.push(MonthPicker.monthPickerSelectCls);
            }
            monthEls.push(
                <div className={MonthPicker.monthPickerItemCls}
                     onClick={this.onMonthClick.bind(this, m, monthIndex)}>
                    <span className={cls}>{m}</span>
                </div>
            );
            monthIndex++;
        }

        for (let y of years) {
            let cls = [MonthPicker.monthPickerItemInnerCls];
            if (y == this.currentYear) {
                cls.push(MonthPicker.monthPickerSelectCls);
            }
            yearEls.push(
                <div className={MonthPicker.monthPickerItemCls}
                     onClick={this.onYearClick.bind(this, y)}>
                    <span className={cls}>{y}</span>
                </div>
            )
        }

        buttons = [
            <Button isAction={false} text={"Ok"} onClick={() => {
                let month = this.currentMonth % 2 == 0 ? this.currentMonth / 2 : (
                    (this.currentMonth - 1) / 2 + 6
                );
                this.props && this.props.onOkClick && this.props.onOkClick({
                    year: this.currentYear,
                    month: month
                });
            }}/>,
            <div className={MonthPicker.monthPickerSplitCls}></div>,
            <Button isAction={false} text={"Cancel"} onClick={() => {
                this.props && this.props.onCancelClick && this.props.onCancelClick();
            }}/>
        ];

        return [
            <div className={MonthPicker.monthPickerMonthsCls}>
                {monthEls}
            </div>,
            <div className={MonthPicker.monthPickerYearsCls}>
                <div className={MonthPicker.monthPickerNavCls}>
                    <div className={MonthPicker.monthPickerNavBtnCls}
                         onClick={this.onPreYearClick.bind(this)}>
                        <Icon icon={IconTypes.angleDoubleLeft}/>
                    </div>
                    <div className={MonthPicker.monthPickerNavBtnCls}
                         onClick={this.onNextYearClick.bind(this)}>
                        <Icon icon={IconTypes.angleDoubleRight}/>
                    </div>
                </div>
                {yearEls}
            </div>,
            <div className={MonthPicker.monthPickerBtnCls}>
                {buttons}
            </div>
        ];
    }

    protected onMonthClick(month: string, monthIndex: number) {
        this.currentMonthStr = month;
        this.currentMonth = monthIndex;
        this.redrawing();
    }

    protected onYearClick(year: number) {
        this.currentYear = year;
        this.redrawing();
    }

    protected onPreYearClick() {
        this.startYear = this.startYear - 10;
        this.redrawing();
    }

    protected onNextYearClick() {
        this.startYear = this.startYear + 10;
        this.redrawing();
    }

    protected getMonthPickerInfo(): { months: Array<string>, years: Array<number> } {
        if (!this.startYear) {
            let year = new Date().getFullYear();
            this.startYear = year - 4;
        }
        let years = [];
        for (let i = this.startYear; i < this.startYear + 5; i++) {
            years.push(i);
            years.push(i + 5);
        }
        return {
            months: ["Jan", "Jul", "Feb", "Aug", "Mar", "Sep", "Apr", "Oct", "May", "Nov", "Jun", "Dec"],
            years: years
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(MonthPicker.monthPickerCls);
        return arr;
    }
}
