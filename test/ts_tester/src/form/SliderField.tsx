import Ginkgo, {GinkgoElement, GinkgoNode, HTMLComponent, InputComponent, RefObject} from "../../carbon/Ginkgo";
import FormField, {FormFieldProps} from "./FormField";
import Icon from "../icon/Icon";
import "./SliderField.scss";
import {IconTypes} from "../icon/IconTypes";
import Moving from "../dragdrop/Moving";

export interface SliderFieldProps extends FormFieldProps {

}

export default class SliderField<P extends SliderFieldProps> extends FormField<P> {
    protected static sliderFieldBodyCls;
    protected static sliderFieldBodyBgCls;
    protected static sliderFieldBodyRectCls;
    protected static sliderFieldRealCls;

    protected slidingBlockEl: RefObject<Moving<any>> = Ginkgo.createRef();
    protected slidingHorzEl: RefObject<HTMLComponent> = Ginkgo.createRef();

    protected slidingBlockLeft: number = 0;
    protected value: number = 0; // 0-100

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        SliderField.sliderFieldBodyCls = this.getThemeClass("sliderfield-body");
        SliderField.sliderFieldBodyBgCls = this.getThemeClass("sliderfield-body-bg");
        SliderField.sliderFieldBodyRectCls = this.getThemeClass("sliderfield-body-rect");
        SliderField.sliderFieldRealCls = this.getThemeClass("sliderfield-body-real");
    }

    protected drawingFieldBody() {
        let left: any = this.slidingBlockLeft;
        if (this.value > 0 && this.slidingBlockLeft == 0) {
            left = this.value + "%";
        }
        return (
            <div className={SliderField.sliderFieldBodyCls}>
                <div className={SliderField.sliderFieldBodyBgCls}
                     onClick={this.onSliderHorzClick.bind(this)}
                >
                </div>
                <div ref={this.slidingHorzEl}
                     className={SliderField.sliderFieldRealCls}
                     onClick={this.onSliderHorzClick.bind(this)}
                >
                    <Moving className={SliderField.sliderFieldBodyRectCls}
                            movingSelf={true}
                            ref={this.slidingBlockEl}
                            style={{left: left}}
                            fixY={true}
                            onClick={e => e.stopPropagation()}
                            onMoving={e => {
                                let left = e.originalX + e.moveX - e.startX;
                                let dom2 = this.slidingHorzEl.instance.dom as HTMLElement;
                                let width = dom2.offsetWidth;
                                this.slidingBlockLeft = left;
                                if (left >= 0 && left <= width) {
                                    return true;
                                } else {
                                    if (left < 0) {
                                        e.moving.setX(0);
                                    }
                                    if (left > width) {
                                        e.moving.setX(width);
                                    }
                                    return false;
                                }
                            }}
                            onFinishMoving={e => {
                                if (this.slidingHorzEl && this.slidingHorzEl.instance) {
                                    let dom = this.slidingHorzEl.instance.dom as HTMLElement;
                                    if (dom) {
                                        let width = dom.offsetWidth;
                                        this.value = this.slidingBlockLeft / width * 100;
                                        if (this.value > 100) this.value = 100;
                                        if (this.value < 0) this.value = 0;
                                        this.triggerOnChangeEvents(this, this.value);
                                    }
                                }
                            }}>
                        <Icon icon={IconTypes._sliderThumb}/>
                    </Moving>
                </div>
            </div>
        );
    }

    protected onSliderHorzClick(e) {
        e.stopPropagation();
        e.preventDefault();

        if (this.slidingBlockEl && this.slidingBlockEl.instance
            && this.slidingHorzEl && this.slidingHorzEl.instance) {
            let blockEl = this.slidingBlockEl.instance.getRootEl();
            let dom2 = this.slidingHorzEl.instance.dom as HTMLElement;
            let bounds = this.getBounds(this.slidingHorzEl.instance),
                x = bounds.x,
                cx = e.pageX,
                blockWidth = (blockEl.dom as HTMLElement).offsetWidth,
                left = cx - x - blockWidth / 2,
                width = dom2.offsetWidth,
                rate = left / width * 100;

            if (rate > 100) {
                left = width;
            }
            if (left < 0) left = 0;

            this.slidingBlockLeft = left;
            this.value = left / width * 100;
            blockEl.animation({
                easing: 'easeOutQuad',
                duration: 300,
                left: this.slidingBlockLeft,
                complete: (anim) => {

                }
            });

            this.triggerOnChangeEvents(this, this.value);
        }
    }


    setValue(value: number): void {
        if (value == null) value = 0;
        if (typeof value == "number") {
            if (value < 0) value = 0;
            if (value > 100) value = 100
        } else {
            value = 0;
        }
        this.value = value;

        if (this.slidingBlockEl && this.slidingBlockEl.instance
            && this.slidingHorzEl && this.slidingHorzEl.instance) {
            let sbc = this.slidingBlockEl.instance;
            let dom2 = this.slidingHorzEl.instance.dom as HTMLElement;
            let left = dom2.offsetWidth * value / 100;

            this.slidingBlockLeft = left;
            sbc.getRootEl().animation({
                easing: 'easeOutQuad',
                duration: 300,
                left: this.slidingBlockLeft,
                complete: (anim) => {

                }
            });
        } else {
            this.redrawingFieldBody();
        }
    }

    getValue(): any {
        return this.value;
    }

    getRowValue(): any {
        return this.value;
    }
}
