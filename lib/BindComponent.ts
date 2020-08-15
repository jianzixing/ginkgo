import {GinkgoElement} from "./Ginkgo";
import {ContextUpdate, GinkgoComponent} from "./GinkgoComponent";
import {GinkgoContainer} from "./GinkgoContainer";

export function callBindRender(props: BindComponentElement) {
    if (props && props.render) {
        let render = props.render;
        if (props.component && props['isBindThis'] != true) {
            render = render.bind(props.component);
            props.render = render;
            props['isBindThis'] = true;
        }
        let result;
        if (props.params) {
            result = render.apply(render, props.params);
        } else {
            result = render();
        }
        return result;
    }
}

export interface BindComponentElement extends GinkgoElement {
    render: Function;
    component?: new () => any;
    shouldUpdate?: boolean;
    params?: Array<any>;
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

    shouldComponentUpdate(nextProps?: P, context?: ContextUpdate<P, any>): boolean {
        if (this.props && this.props.shouldUpdate === false) return false;
        return true;
    }
}
