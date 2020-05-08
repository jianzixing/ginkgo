import Ginkgo, {InputComponent, RefObject} from "../../carbon/Ginkgo";
import {AbstractFormField, AbstractFormFieldProps} from "./AbstractFormField";

export interface HiddenFieldProps extends AbstractFormFieldProps {

}

export default class HiddenField<P extends HiddenFieldProps> extends AbstractFormField<P> {
    protected inputRef: RefObject<InputComponent> = Ginkgo.createRef();
    protected isHidden = true;
    protected value;

    getHidden(): boolean {
        return true;
    }

    render(): any {
        return <input ref={this.inputRef} type={"hidden"}/>
    }


    setValue(value: any): void {
        this.value = value;
        if (this.inputRef && this.inputRef.instance) {
            this.inputRef.instance.value = value;
        }
    }

    getValue(): any {
        if (this.inputRef && this.inputRef.instance) {
            return this.inputRef.instance.value;
        }
    }

    getRowValue(): any {
        return this.getValue();
    }

    focus(): void {
        super.focus();
    }
}
