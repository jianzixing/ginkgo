import {HTMLAttributes} from "./HTMLComponent";
import {GinkgoComponent} from "./GinkgoComponent";
import {GinkgoElement} from "./Ginkgo";
import {HTMLInputAttributes} from "./InputComponent";
import {BindComponentElement} from "./BindComponent";
import {
    HTMLAnchorAttributes,
    HTMLAreaAttributes,
    HTMLAudioAttributes,
    HTMLBaseAttributes,
    HTMLBlockquoteAttributes,
    HTMLButtonAttributes,
    HTMLCanvasAttributes,
    HTMLColAttributes,
    HTMLColgroupAttributes,
    HTMLDataAttributes,
    HTMLDelAttributes,
    HTMLDetailsAttributes,
    HTMLDialogAttributes,
    HTMLEmbedAttributes,
    HTMLFieldSetAttributes,
    HTMLFormAttributes,
    HTMLHtmlAttributes,
    HTMLIFrameAttributes,
    HTMLImageAttributes,
    HTMLInsAttributes,
    HTMLKeygenAttributes,
    HTMLLabelAttributes,
    HTMLLIAttributes,
    HTMLLinkAttributes,
    HTMLMapAttributes,
    HTMLMenuAttributes,
    HTMLMetaAttributes,
    HTMLMeterAttributes,
    HTMLObjectAttributes,
    HTMLOlAttributes,
    HTMLOptgroupAttributes,
    HTMLOptionAttributes,
    HTMLOutputAttributes,
    HTMLParamAttributes,
    HTMLProgressAttributes,
    HTMLQuoteAttributes,
    HTMLScriptAttributes,
    HTMLSelectAttributes,
    HTMLSourceAttributes,
    HTMLStyleAttributes,
    HTMLTableAttributes,
    HTMLTdAttributes,
    HTMLTextareaAttributes,
    HTMLThAttributes,
    HTMLTimeAttributes,
    HTMLTrackAttributes,
    HTMLVideoAttributes,
    HTMLWebViewAttributes
} from "./HTMLDefinedAttribute";

declare namespace JSX {
    interface ElementClass extends GinkgoComponent<any> {
        render(): GinkgoElement | undefined | null;
    }

    interface IntrinsicElements {
        a: HTMLAnchorAttributes;
        abbr: HTMLAttributes;
        address: HTMLAttributes;
        applet: HTMLAttributes;
        area: HTMLAreaAttributes;
        article: HTMLAttributes;
        aside: HTMLAttributes;
        audio: HTMLAudioAttributes;
        b: HTMLAttributes;
        base: HTMLBaseAttributes;
        basefont: HTMLAttributes;
        bdi: HTMLAttributes;
        bdo: HTMLAttributes;
        big: HTMLAttributes;
        blockquote: HTMLBlockquoteAttributes;
        body: HTMLAttributes;
        br: HTMLAttributes;
        button: HTMLButtonAttributes;
        canvas: HTMLCanvasAttributes;
        caption: HTMLAttributes;
        cite: HTMLAttributes;
        code: HTMLAttributes;
        col: HTMLColAttributes;
        colgroup: HTMLColgroupAttributes;
        data: HTMLDataAttributes;
        datalist: HTMLAttributes;
        dd: HTMLAttributes;
        del: HTMLDelAttributes;
        details: HTMLDetailsAttributes;
        dfn: HTMLAttributes;
        dialog: HTMLDialogAttributes;
        dir: HTMLAttributes;
        div: HTMLAttributes;
        dl: HTMLAttributes;
        dt: HTMLAttributes;
        em: HTMLAttributes;
        embed: HTMLEmbedAttributes;
        fieldset: HTMLFieldSetAttributes;
        figcaption: HTMLAttributes;
        figure: HTMLAttributes;
        font: HTMLAttributes;
        footer: HTMLAttributes;
        form: HTMLFormAttributes;
        frame: HTMLAttributes;
        frameset: HTMLAttributes;
        h1: HTMLAttributes;
        h2: HTMLAttributes;
        h3: HTMLAttributes;
        h4: HTMLAttributes;
        h5: HTMLAttributes;
        h6: HTMLAttributes;
        head: HTMLAttributes;
        header: HTMLAttributes;
        hgroup: HTMLAttributes;
        hr: HTMLAttributes;
        html: HTMLHtmlAttributes;
        i: HTMLAttributes;
        iframe: HTMLIFrameAttributes;
        img: HTMLImageAttributes;
        input: HTMLInputAttributes;
        ins: HTMLInsAttributes;
        kbd: HTMLAttributes;
        keygen: HTMLKeygenAttributes,
        label: HTMLLabelAttributes;
        legend: HTMLAttributes;
        li: HTMLLIAttributes;
        link: HTMLLinkAttributes;
        main: HTMLAttributes;
        map: HTMLMapAttributes;
        mark: HTMLAttributes;
        menu: HTMLMenuAttributes;
        menuitem: HTMLAttributes;
        meta: HTMLMetaAttributes;
        meter: HTMLMeterAttributes;
        nav: HTMLAttributes;
        noindex: HTMLAttributes;
        noscript: HTMLAttributes;
        object: HTMLObjectAttributes;
        ol: HTMLOlAttributes;
        optgroup: HTMLOptgroupAttributes;
        option: HTMLOptionAttributes;
        output: HTMLOutputAttributes;
        p: HTMLAttributes;
        param: HTMLParamAttributes;
        picture: HTMLAttributes;
        pre: HTMLAttributes;
        progress: HTMLProgressAttributes;
        q: HTMLQuoteAttributes;
        rp: HTMLAttributes;
        rt: HTMLAttributes;
        ruby: HTMLAttributes;
        s: HTMLAttributes;
        samp: HTMLAttributes;
        script: HTMLScriptAttributes;
        section: HTMLAttributes;
        select: HTMLSelectAttributes;
        small: HTMLAttributes;
        source: HTMLSourceAttributes;
        span: HTMLAttributes;
        strong: HTMLAttributes;
        style: HTMLStyleAttributes;
        sub: HTMLAttributes;
        summary: HTMLAttributes;
        sup: HTMLAttributes;
        table: HTMLTableAttributes;
        tbody: HTMLAttributes;
        td: HTMLTdAttributes;
        template: HTMLAttributes;
        textarea: HTMLTextareaAttributes;
        tfoot: HTMLAttributes;
        th: HTMLThAttributes;
        thead: HTMLAttributes;
        time: HTMLTimeAttributes;
        title: HTMLAttributes;
        tr: HTMLAttributes;
        track: HTMLTrackAttributes;
        u: HTMLAttributes;
        ul: HTMLAttributes;
        var: HTMLAttributes;
        video: HTMLVideoAttributes;
        wbr: HTMLAttributes;
        webview: HTMLWebViewAttributes;


        bind: BindComponentElement;

        [elemName: string]: any;
    }
}
