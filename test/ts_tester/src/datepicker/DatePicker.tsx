import Ginkgo, {GinkgoElement, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import "./DatePicker.scss";
import Component, {ComponentProps} from "../component/Component";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import Button from "../button/Button";
import MonthPicker from "./MonthPicker";
import NumberTextField from "../form/NumberTextField";

export interface DatePickerProps extends ComponentProps {
    border?: boolean;
    onSelectedDate?: (date: Date) => boolean | any;
    date?: Date;
    showTime?: boolean;
}

export default class DatePicker<P extends DatePickerProps> extends Component<P> {
    protected static datePickerCls;
    protected static datePickerBorderCls;
    protected static datePickerInnerCls;
    protected static datePickerHeaderCls;
    protected static datePickerHeaderSwitchCls;
    protected static datePickerHeaderPreCls;
    protected static datePickerHeaderMonthCls;
    protected static datePickerHeaderNextCls;
    protected static datePickerHeaderBtnCls;

    protected static datePickerBodyCls;
    protected static datePickerTheadCls;
    protected static datePickerTbodyCls;
    protected static datePickerThCls;
    protected static datePickerTdCls;
    protected static datePickerTdInnerCls;
    protected static datePickerSelectCls;
    protected static datePickerActiveCls;
    protected static datePickerTodayCls;
    protected static datePickerDisabledCls;

    protected static datePickerTimeCls;
    protected static datePickerTimeItemCls;

    protected static datePickerFooterCls;
    protected static datePickerMonthPickerCls;

    protected monthPickerEl: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected hoursField: RefObject<NumberTextField<any>> = Ginkgo.createRef();
    protected minutesField: RefObject<NumberTextField<any>> = Ginkgo.createRef();
    protected secondsField: RefObject<NumberTextField<any>> = Ginkgo.createRef();
    protected date: Date = this.props.date;
    protected currDayIndex: number = -1;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        DatePicker.datePickerCls = this.getThemeClass("datepicker");
        DatePicker.datePickerBorderCls = this.getThemeClass("datepicker-border");
        DatePicker.datePickerInnerCls = this.getThemeClass("datepicker-inner");
        DatePicker.datePickerHeaderCls = this.getThemeClass("datepicker-header");
        DatePicker.datePickerHeaderMonthCls = this.getThemeClass("datepicker-month");
        DatePicker.datePickerHeaderSwitchCls = this.getThemeClass("datepicker-switch");
        DatePicker.datePickerHeaderPreCls = this.getThemeClass("datepicker-pre");
        DatePicker.datePickerHeaderNextCls = this.getThemeClass("datepicker-next");
        DatePicker.datePickerHeaderBtnCls = this.getThemeClass("datepicker-month-btn");


        DatePicker.datePickerBodyCls = this.getThemeClass("datepicker-body");
        DatePicker.datePickerTheadCls = this.getThemeClass("datepicker-thead");
        DatePicker.datePickerTbodyCls = this.getThemeClass("datepicker-tbody");
        DatePicker.datePickerThCls = this.getThemeClass("datepicker-th");
        DatePicker.datePickerTdCls = this.getThemeClass("datepicker-td");
        DatePicker.datePickerTdInnerCls = this.getThemeClass("datepicker-td-inner");
        DatePicker.datePickerSelectCls = this.getThemeClass("datepicker-select");
        DatePicker.datePickerActiveCls = this.getThemeClass("datepicker-active");
        DatePicker.datePickerTodayCls = this.getThemeClass("datepicker-today");
        DatePicker.datePickerDisabledCls = this.getThemeClass("datepicker-disabled");

        DatePicker.datePickerTimeCls = this.getThemeClass("datepicker-time");
        DatePicker.datePickerTimeItemCls = this.getThemeClass("datepicker-time-item");

        DatePicker.datePickerFooterCls = this.getThemeClass("datepicker-footer");
        DatePicker.datePickerMonthPickerCls = this.getThemeClass("datepicker-mp");
    }

    protected drawing(): GinkgoElement<any> | string | undefined | null | GinkgoElement[] {
        let table, thead = [], tbody = [], timeEls,
            infos = this.getPickerInfoByTime(this.date),
            monthText = infos.monthText,
            yearText = infos.yearText,
            headTexts = infos.headTexts,
            bodyTexts = infos.bodyTexts,
            preCount = infos.preCount,
            lastCount = infos.lastCount,
            currDayIndex = this.currDayIndex != -1 ? this.currDayIndex : infos.currDayIndex,
            buttons,
            monthPickerEl;

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth();
        let day = today.getDate();


        for (let ht of headTexts) {
            thead.push(
                <th className={DatePicker.datePickerTdCls}>
                    <div className={DatePicker.datePickerTdInnerCls}>{ht}</div>
                </th>
            )
        }

        let index = 0, total = 6 * 7;
        for (let bt of bodyTexts) {
            let trows = [];
            for (let item of bt) {
                let cls = [DatePicker.datePickerTdCls],
                    currElDate = {year: infos.date.year, month: infos.date.month, day: item};
                if (index < preCount || total - lastCount <= index) {
                    cls.push(DatePicker.datePickerDisabledCls);
                    if (index < preCount) {
                        currElDate.year = infos.preDate.year;
                        currElDate.month = infos.preDate.month;
                    }
                    if (total - lastCount <= index) {
                        currElDate.year = infos.nextDate.year;
                        currElDate.month = infos.nextDate.month;
                    }
                } else {
                    if (infos.date.year == year
                        && infos.date.month == month
                        && day == item) {
                        cls.push(DatePicker.datePickerTodayCls);
                    }
                }
                if (index == currDayIndex) {
                    cls.push(DatePicker.datePickerSelectCls);
                }


                trows.push(
                    <th className={cls}>
                        <div className={DatePicker.datePickerTdInnerCls}
                             onClick={() => this.onDayClick(currElDate)}>
                            {item}
                        </div>
                    </th>
                );
                index++;
            }
            tbody.push(
                <tr className={DatePicker.datePickerThCls}>{trows}</tr>
            )
        }

        table = (
            <table className={DatePicker.datePickerBodyCls}>
                <thead className={DatePicker.datePickerTheadCls}>
                <tr className={DatePicker.datePickerThCls}>
                    {thead}
                </tr>
                </thead>
                <tbody className={DatePicker.datePickerTbodyCls}>
                {tbody}
                </tbody>
            </table>
        );

        if (this.props.showTime) {
            timeEls = (
                <div className={DatePicker.datePickerTimeCls}>
                    <div className={DatePicker.datePickerTimeItemCls}>
                        <NumberTextField ref={this.hoursField} width={90} value={infos.date.hour}/>
                    </div>
                    <div className={DatePicker.datePickerTimeItemCls}>
                        <NumberTextField ref={this.minutesField} width={90} value={infos.date.minute}/>
                    </div>
                    <div className={DatePicker.datePickerTimeItemCls}>
                        <NumberTextField ref={this.secondsField} width={90} value={infos.date.second}/>
                    </div>
                </div>);
        }

        buttons = (
            <div className={DatePicker.datePickerFooterCls}>
                {this.props.showTime ?
                    <Button text={"Ok"}
                            isAction={false}
                            onClick={this.onOkClick.bind(this)}
                            style={{marginRight: 10}}
                    /> : undefined}
                <Button text={"Today"} isAction={false} onClick={this.onTodayClick.bind(this)}/>
            </div>
        );

        monthPickerEl = (
            <MonthPicker
                onCancelClick={this.onMonthPickerCancel.bind(this)}
                onOkClick={this.onMonthPickerOk.bind(this)}
            />
        );

        return (
            <div className={DatePicker.datePickerInnerCls}>
                <div className={DatePicker.datePickerHeaderCls}>
                    <div className={[DatePicker.datePickerHeaderSwitchCls, DatePicker.datePickerHeaderPreCls]}
                         onClick={this.onLeftClick.bind(this)}>
                        <Icon icon={IconTypes.angleDoubleLeft}/>
                    </div>
                    <div className={DatePicker.datePickerHeaderMonthCls}>
                        <div className={DatePicker.datePickerHeaderBtnCls}
                             onClick={this.onMonthPickerSelect.bind(this)}>
                            <span>{monthText}&nbsp;{yearText}</span>
                            <Icon icon={IconTypes.caretDown}/>
                        </div>
                    </div>
                    <div className={[DatePicker.datePickerHeaderSwitchCls, DatePicker.datePickerHeaderNextCls]}
                         onClick={this.onRightClick.bind(this)}>
                        <Icon icon={IconTypes.angleDoubleRight}/>
                    </div>
                </div>
                {table}
                {timeEls}
                {buttons}

                <div ref={this.monthPickerEl}
                     className={DatePicker.datePickerMonthPickerCls}>
                    {monthPickerEl}
                </div>
            </div>
        );
    }

    protected onLeftClick() {
        if (!this.date) this.date = new Date();
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        let day = this.date.getDate();

        let preYear = year, preMonth = month - 1;
        if (preMonth == -1) {
            preYear = year - 1;
            preMonth = 11;
        }

        this.date = new Date(preYear, preMonth, day);
        this.redrawing();
    }

    protected onRightClick() {
        if (!this.date) this.date = new Date();
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        let day = this.date.getDate();

        let preYear = year, preMonth = month + 1;
        if (preMonth == 12) {
            preYear = year + 1;
            preMonth = 0;
        }

        this.date = new Date(preYear, preMonth, day);
        this.redrawing();
    }

    protected onDayClick(currElDate: { year: number, month: number, day: number }) {
        this.date = new Date(currElDate.year, currElDate.month, currElDate.day);
        if (this.props.onSelectedDate && !this.props.showTime) {
            // let hours = this.hoursField.instance ? this.hoursField.instance.getValue() : 0;
            // let minutes = this.minutesField.instance ? this.minutesField.instance.getValue() : 0;
            // let seconds = this.secondsField.instance ? this.secondsField.instance.getValue() : 0;
            // this.date.setHours(hours, minutes, seconds);
            if (this.props.onSelectedDate(this.date)) {
                this.redrawing();
            }
        } else {
            this.redrawing();
        }
    }

    protected onTodayClick() {
        this.date = new Date();
        if (this.props.onSelectedDate) {
            if (this.props.onSelectedDate(this.date)) {
                this.redrawing();
            }
        } else {
            this.redrawing();
        }
    }

    protected onOkClick() {
        if (!this.date) this.date = new Date();
        if (this.props.onSelectedDate && this.props.showTime && this.date) {
            let hours = this.hoursField.instance ? this.hoursField.instance.getValue() : 0;
            let minutes = this.minutesField.instance ? this.minutesField.instance.getValue() : 0;
            let seconds = this.secondsField.instance ? this.secondsField.instance.getValue() : 0;
            this.date.setHours(hours, minutes, seconds);
            this.props.onSelectedDate(this.date);
        }
    }

    protected onMonthPickerSelect() {
        if (this.monthPickerEl
            && this.monthPickerEl.instance
            && this.monthPickerEl.instance.dom) {
            let dom = this.monthPickerEl.instance.dom as HTMLElement;
            dom.style.transform = "translateY(" + -(this.getHeight()) + "px)";
            dom.style.display = "block";

            this.monthPickerEl.instance.animation({
                translateY: 0,
                easing: 'easeOutQuad',
                duration: 200,
            });
        }
    }

    protected onMonthPickerCancel() {
        if (this.monthPickerEl
            && this.monthPickerEl.instance
            && this.monthPickerEl.instance.dom) {
            let dom = this.monthPickerEl.instance.dom as HTMLElement;

            this.monthPickerEl.instance.animation({
                translateY: -this.getHeight(),
                easing: 'easeOutQuad',
                duration: 200,
                complete: (anim) => {
                    dom.style.display = "none";
                }
            });
        }
    }

    protected onMonthPickerOk(time: { year: number, month: number }) {
        this.onMonthPickerCancel();
        if (!this.date) this.date = new Date();
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        let day = this.date.getDate();
        let week = this.date.getDay();
        let hour = this.date.getHours();
        let minute = this.date.getMinutes();
        let second = this.date.getSeconds();

        this.date = new Date(time.year || year, time.month >= 0 ? time.month : month, day, hour, minute, second);
        this.redrawing();
    }

    protected getPickerInfoByTime(date: Date): {
        monthText: string,
        yearText: string,
        headTexts: Array<string>,
        bodyTexts: Array<Array<number>>,
        date: { year: number, month: number, day: number, hour: number, minute: number, second: number, week: number },
        preCount: number,
        lastCount: number,
        preDate: { year: number, month: number },
        nextDate: { year: number, month: number },
        currDayIndex: number
    } {
        if (!date) date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let week = date.getDay();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        let monthDayDate = new Date(year, month + 1, 0);
        let monthDayCount = monthDayDate.getDate();

        let preMonthDayDate = new Date(year, month, 0);
        let preMonthDayCount = preMonthDayDate.getDate();

        let nextYear = year, nextMonth = month + 1;
        if (nextMonth == 12) {
            nextYear += 1;
            nextMonth = 0;
        }
        let nextMonthDayDate = new Date(nextYear, nextMonth, 1);

        let monthOneWeek = new Date(year, month, 1).getDay();

        let monthNames = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

        let count = 1,
            preMonthStart = preMonthDayCount - monthOneWeek + 1,
            bodyTexts = [],
            days = [],
            preCount = 0,
            lastCount = 0,
            currDayIndex = 0;

        while (preMonthStart <= preMonthDayCount) {
            days.push(preMonthStart);
            preMonthStart++;
            preCount++;
        }

        currDayIndex = currDayIndex + preCount;

        while (count <= monthDayCount) {
            days.push(count);
            count++;
            if (count == day) {
                currDayIndex += count;
            }
        }

        count = 1;
        while (days.length < 6 * 7) {
            days.push(count);
            count++;
            lastCount++;
        }

        for (let i = 0; i < 6; i++) {
            let arr = days.splice(0, 7);
            bodyTexts.push(arr);
        }

        return {
            monthText: monthNames[month],
            yearText: year + "",
            headTexts: ["S", "M", "T", "W", "T", "F", "S"],
            bodyTexts: bodyTexts,
            preCount: preCount,
            lastCount: lastCount,
            currDayIndex: currDayIndex - 1,
            preDate: {year: preMonthDayDate.getFullYear(), month: preMonthDayDate.getMonth()},
            nextDate: {year: nextMonthDayDate.getFullYear(), month: nextMonthDayDate.getMonth()},
            date: {
                year: year,
                month: month,
                day: day,
                hour: hour,
                minute: minute,
                second: second,
                week: week
            }
        };
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(DatePicker.datePickerCls);
        if (this.props.border == undefined || this.props.border == true) {
            arr.push(DatePicker.datePickerBorderCls);
        }
        return arr;
    }
}
