import {GinkgoComponent} from "./GinkgoComponent";
import {GinkgoElement} from "./Ginkgo";

export class TextComponent extends GinkgoComponent {
    protected readonly holder: { dom: Text };
    readonly text?: string | number;

    constructor(props?: GinkgoElement, holder?: { dom: Text }) {
        super(props);
        (this as any).props = props;
        this.holder = holder;
    }

    get dom(): Text {
        return this.holder ? this.holder.dom : undefined;
    }
}
