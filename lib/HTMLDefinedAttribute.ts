import {EventHandler, HTMLAttributes} from "./HTMLComponent";

export interface HTMLAnchorAttributes extends HTMLAttributes {
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    ping?: string;
    rel?: string;
    target?: "_blank" | "_self" | "_parent" | "_top" | string;
    type?: string;
    referrerPolicy?: string;
}

export interface HTMLAreaAttributes extends HTMLAttributes {
    alt?: string;
    coords?: string;
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    rel?: string;
    shape?: string;
    target?: string;
}

export interface HTMLMediaAttributes extends HTMLAttributes {
    autoPlay?: boolean;
    controls?: boolean;
    controlsList?: string;
    crossOrigin?: string;
    loop?: boolean;
    mediaGroup?: string;
    muted?: boolean;
    playsinline?: boolean;
    preload?: string;
    src?: string;
}

export interface HTMLAudioAttributes extends HTMLMediaAttributes {

}


export interface HTMLBaseAttributes extends HTMLAttributes {
    href?: string;
    target?: string;
}

export interface HTMLBlockquoteAttributes extends HTMLAttributes {
    cite?: string;
}

export interface HTMLButtonAttributes extends HTMLAttributes {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: 'submit' | 'reset' | 'button';
    value?: string | string[] | number;
}

export interface HTMLCanvasAttributes extends HTMLAttributes {
    height?: number | string;
    width?: number | string;
}

export interface HTMLColgroupAttributes extends HTMLAttributes {
    span?: number;
    width?: number | string;
}

export interface HTMLDataAttributes extends HTMLAttributes {
    value?: string | string[] | number;
}

export interface HTMLDelAttributes extends HTMLAttributes {
    cite?: string;
    dateTime?: string;
}

export interface HTMLDetailsAttributes extends HTMLAttributes {
    open?: boolean;
}

export interface HTMLDialogAttributes extends HTMLAttributes {
    open?: boolean;
}

export interface HTMLEmbedAttributes extends HTMLAttributes {
    height?: number | string;
    src?: string;
    type?: string;
    width?: number | string;
}

export interface HTMLFieldSetAttributes extends HTMLAttributes {
    disabled?: boolean;
    form?: string;
    name?: string;
}

export interface HTMLFormAttributes extends HTMLAttributes {
    acceptCharset?: string;
    action?: string;
    autoComplete?: string;
    encType?: string;
    method?: string;
    name?: string;
    noValidate?: boolean;
    target?: string;
}

export interface HTMLIFrameAttributes extends HTMLAttributes {
    allow?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    frameBorder?: number | string;
    height?: number | string;
    marginHeight?: number;
    marginWidth?: number;
    name?: string;
    referrerPolicy?: string;
    sandbox?: string;
    scrolling?: string;
    seamless?: boolean;
    src?: string;
    srcDoc?: string;
    width?: number | string;
}

export interface HTMLImageAttributes extends HTMLAttributes {
    alt?: string;
    crossOrigin?: "anonymous" | "use-credentials" | "";
    decoding?: "async" | "auto" | "sync";
    height?: number | string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    useMap?: string;
    width?: number | string;
}

export interface HTMLKeygenAttributes extends HTMLAttributes {
    autoFocus?: boolean;
    challenge?: string;
    disabled?: boolean;
    form?: string;
    keyType?: string;
    keyParams?: string;
    name?: string;
}

export interface HTMLLabelAttributes extends HTMLAttributes {
    form?: string;
    htmlFor?: string;
}

export interface HTMLLIAttributes extends HTMLAttributes {
    value?: string | string[] | number;
}

export interface HTMLLinkAttributes extends HTMLAttributes {
    as?: string;
    crossOrigin?: string;
    href?: string;
    hrefLang?: string;
    integrity?: string;
    media?: string;
    rel?: string;
    sizes?: string;
    type?: string;
}

export interface HTMLMapAttributes extends HTMLAttributes {
    name?: string;
}

export interface HTMLMenuAttributes extends HTMLAttributes {
    type?: string;
}

export interface HTMLMetaAttributes extends HTMLAttributes {
    charSet?: string;
    content?: string;
    httpEquiv?: string;
    name?: string;
}

export interface HTMLMeterAttributes extends HTMLAttributes {
    form?: string;
    high?: number;
    low?: number;
    max?: number | string;
    min?: number | string;
    optimum?: number;
    value?: string | string[] | number;
}

export interface HTMLObjectAttributes extends HTMLAttributes {
    classID?: string;
    data?: string;
    form?: string;
    height?: number | string;
    name?: string;
    type?: string;
    useMap?: string;
    width?: number | string;
    wmode?: string;
}

export interface HTMLOlAttributes extends HTMLAttributes {
    reversed?: boolean;
    start?: number;
    type?: '1' | 'a' | 'A' | 'i' | 'I';
}

export interface HTMLOptgroupAttributes extends HTMLAttributes {
    disabled?: boolean;
    label?: string;
}

export interface HTMLOptionAttributes extends HTMLAttributes {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string | string[] | number;
}

export interface HTMLOutputAttributes extends HTMLAttributes {
    form?: string;
    htmlFor?: string;
    name?: string;
}

export interface HTMLParamAttributes extends HTMLAttributes {
    name?: string;
    value?: string | string[] | number;
}

export interface HTMLProgressAttributes extends HTMLAttributes {
    max?: number | string;
    value?: string | string[] | number;
}

export interface HTMLQuoteAttributes extends HTMLAttributes {
    cite?: string;
}

export interface HTMLScriptAttributes extends HTMLAttributes {
    async?: boolean;
    charSet?: string;
    crossOrigin?: string;
    defer?: boolean;
    integrity?: string;
    noModule?: boolean;
    nonce?: string;
    src?: string;
    type?: string;
}

export interface HTMLSelectAttributes extends HTMLAttributes {
    autoComplete?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
    value?: string | string[] | number;
    onChange?: EventHandler;
}

export interface HTMLSourceAttributes extends HTMLAttributes {
    media?: string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    type?: string;
}

export interface HTMLStyleAttributes extends HTMLAttributes {
    media?: string;
    nonce?: string;
    scoped?: boolean;
    type?: string;
}

export interface HTMLColAttributes extends HTMLAttributes {
    span?: number;
    width?: number | string;
}

export interface HTMLTableAttributes extends HTMLAttributes {
    cellPadding?: number | string;
    cellSpacing?: number | string;
    summary?: string;
}

export interface HTMLTdAttributes extends HTMLAttributes {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
    valign?: "top" | "middle" | "bottom" | "baseline";
}

export interface HTMLThAttributes extends HTMLAttributes {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
}

export interface HTMLTextareaAttributes extends HTMLAttributes {
    autoComplete?: string;
    autoFocus?: boolean;
    cols?: number;
    dirName?: string;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    value?: string | string[] | number;
    wrap?: string;

    onChange?: EventHandler;
}

export interface HTMLTimeAttributes extends HTMLAttributes {
    dateTime?: string;
}

export interface HTMLTrackAttributes extends HTMLAttributes {
    default?: boolean;
    kind?: string;
    label?: string;
    src?: string;
    srcLang?: string;
}

export interface HTMLVideoAttributes extends HTMLMediaAttributes {
    height?: number | string;
    playsInline?: boolean;
    poster?: string;
    width?: number | string;
    disablePictureInPicture?: boolean;
}

export interface HTMLWebViewAttributes extends HTMLAttributes {
    allowFullScreen?: boolean;
    allowpopups?: boolean;
    autoFocus?: boolean;
    autosize?: boolean;
    blinkfeatures?: string;
    disableblinkfeatures?: string;
    disableguestresize?: boolean;
    disablewebsecurity?: boolean;
    guestinstance?: string;
    httpreferrer?: string;
    nodeintegration?: boolean;
    partition?: string;
    plugins?: boolean;
    preload?: string;
    src?: string;
    useragent?: string;
    webpreferences?: string;
}

export interface HTMLInsAttributes extends HTMLAttributes {
    cite?: string;
    dateTime?: string;
}

export interface HTMLHtmlAttributes extends HTMLAttributes {
    manifest?: string;
}
