import {GinkgoComponent} from "./GinkgoComponent";
import {GinkgoElement} from "./Ginkgo";

export class TextComponent extends GinkgoComponent {
    readonly text?: string | number;

    constructor(props?: GinkgoElement, text?: string | number) {
        super(props);
        (this as any).props = text;
        this.text = text;
    }
}
