import {EventHandler, HTMLComponent, HTMLAttributes} from "./HTMLComponent";
import {GinkgoContainer, GinkgoElement, GinkgoTools} from "./Ginkgo";

export interface HTMLInputAttributes extends HTMLAttributes {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    capture?: boolean | string; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    checked?: boolean;
    crossOrigin?: string;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: "text" | "button" | "checkbox" | "file" | "hidden" | "image" | "password" | "radio" | "reset" | "submit" | string;
    value?: string | string[] | number;
    width?: number | string;

    onChange?: EventHandler;
}

export class InputComponent<P extends HTMLInputAttributes = any> extends HTMLComponent<P> {

    set value(value: string | number) {
        if (this.holder && this.holder.dom && this.holder.dom instanceof HTMLInputElement) {
            this.holder.dom.value = value + "";
        }
    }

    get value() {
        if (this.holder && this.holder.dom && this.holder.dom instanceof HTMLInputElement) {
            return this.holder.dom.value;
        }
    }

    /**
     * 添加元素到子元素
     * @param props
     */
    append(props: GinkgoElement | GinkgoElement[] | string): void {
        if (console && console.warn) {
            console.warn("input element can't append children element")
        }
    }

    overlap<E extends GinkgoElement>(props?: E | E[] | string | null | undefined): void {
        if (console && console.warn) {
            console.warn("input element can't overlay children element")
        }
    }

    componentWillReceiveProps(props: P, context?): void {
        super.componentWillReceiveProps(props, context);
    }
}
