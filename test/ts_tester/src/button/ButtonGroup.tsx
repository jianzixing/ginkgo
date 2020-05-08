import Ginkgo, {GinkgoElement} from "../../carbon/Ginkgo";
import "./ButtonGroup.scss";
import Component, {ComponentProps} from "../component/Component";
import Button, {ButtonProps} from "./Button";

export interface ButtonModel extends ButtonProps {
    data?: any;
}

export interface ButtonGroupProps extends ComponentProps {
    buttons?: Array<ButtonModel>;
    onButtonClick?: (e: Event, data: any) => void;
    toggle?: "none" | "single" | "multiple";
    direction?: "horizontal" | "vertical" | "wrap";
    // if set width , set every button width / rowCount
    rowCount?: number;
}


export default class ButtonGroup<P extends ButtonGroupProps> extends Component<P> {
    protected static buttonGroupCls;
    protected static buttonGroupClsVertical;
    protected static buttonGroupClsWrap;
    protected static buttonGroupClsItem;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        ButtonGroup.buttonGroupCls = this.getThemeClass("button-group");
        ButtonGroup.buttonGroupClsVertical = this.getThemeClass("button-group-vertical");
        ButtonGroup.buttonGroupClsWrap = this.getThemeClass("button-group-wrap");
        ButtonGroup.buttonGroupClsItem = this.getThemeClass("button-group-item");
    }

    protected drawing(): GinkgoElement<any> | string | undefined | null | GinkgoElement[] {
        let buttons = this.props.buttons,
            els: Array<GinkgoElement> = [],
            rootCls = [ButtonGroup.buttonGroupCls];

        if (this.props.direction == "vertical") {
            rootCls.push(ButtonGroup.buttonGroupClsVertical);
        }
        if (this.props.direction == "wrap") {
            rootCls.push(ButtonGroup.buttonGroupClsWrap);
        }
        if (buttons && this.props.rowCount && this.props.width) {
            buttons.map((value, index) => {
                if (this.props.rowCount && this.props.width) {
                    value.width = this.props.width / this.props.rowCount;
                }
            });
        }

        if (buttons) {
            buttons.map((value, index) => {
                value.style = {...value.style};
                if (this.props.direction == "wrap") {
                    value.style['border'] = "0";
                } else {
                    if (buttons && index != buttons.length - 1) {
                        if (this.props.direction != "vertical") {
                            value.style['borderBottomWidth'] = "auto";
                            value.style['borderRightWidth'] = "0";
                        } else {
                            value.style['borderBottomWidth'] = "0";
                            value.style['borderRightWidth'] = "auto";
                        }
                    }
                }

                value.onClick = (e) => {
                    this.onButtonClick(e, value);
                };
                let buttonEl = Ginkgo.createElement(Button, value);
                els.push(
                    <div key={index} className={ButtonGroup.buttonGroupClsItem}>{buttonEl}</div>
                );
            })
        }
        return (
            <div className={rootCls.join(" ")}>
                {els}
            </div>
        );
    }

    private onButtonClick(e: Event, model: ButtonModel) {
        let buttons = this.props.buttons;
        if (this.props.toggle != "none" && buttons) {
            if (this.props.toggle == "single") {
                buttons.map(value => value.pressing = false);
            }

            if (this.props.toggle == "multiple" && model.pressing == true) {
                model.pressing = false;
            } else {
                model.pressing = true;
            }
            this.redrawing();
        }


        if (this.props.onButtonClick) {
            this.props.onButtonClick(e, model);
        }
    }
}
