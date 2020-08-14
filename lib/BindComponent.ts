import {GinkgoElement, GinkgoNode} from "./Ginkgo";
import {GinkgoComponent} from "./GinkgoComponent";
import {GinkgoContainer} from "./GinkgoContainer";

export function callBindRender(props: BindComponentElement) {
    if (props && props['attrs']) {
        let render = props['attrs'].render;
        if (props.component && props['isBindThis'] != true) {
            render = render.bind(props.component);
            props['attrs'].render = render;
            props['isBindThis'] = true;
        }
        let result = render();
        return result;
    }
}

export interface BindComponentElement extends GinkgoElement {
    render: Function;
    component?: new () => any;
}

export class BindComponent<P extends BindComponentElement = any> extends GinkgoComponent<P> {
    constructor(props?: P, holder?: {}) {
        super(props);
    }

    append(props: GinkgoElement | GinkgoElement[] | string) {
        throw Error("BindComponent can't append children.");
    }

    overlap<E extends GinkgoElement>(props?: E[] | E | string | null | undefined) {
        throw Error("BindComponent can't overlay children.");
    }

    forceRender() {
        let link = GinkgoContainer.getLinkByComponent(this);
        if (link) {
            GinkgoContainer.forceComponent(link);
        }
    }
}
