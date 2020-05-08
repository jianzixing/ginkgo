import {GinkgoElement, HTMLComponent} from "./Ginkgo";

export class GinkgoTools {
    public static getWindowSize(): { width: number, height: number } {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        return {width: width, height: height};
    }

    public static componentOverlayProps<E extends GinkgoElement>(props?: E | E[] | string | null | undefined) {
        if (props) {
            let newChildArr: Array<E> | undefined = undefined;
            if (props instanceof Array) newChildArr = props;
            else if (props) {
                if (typeof props === "string") {
                    newChildArr = [props as any];
                } else {
                    newChildArr = [props];
                }
            }
            return newChildArr;
        }
        return null;
    }

    public static componentAppendProps<E extends GinkgoElement>(oldProps: E,
                                                                newProps: GinkgoElement | GinkgoElement[] | string) {
        if (oldProps && newProps) {
            let childArr: Array<GinkgoElement> = [];
            if (oldProps && oldProps.children) {
                childArr = oldProps.children;
            }

            let newChildArr = [...childArr];
            if (newProps instanceof Array) newChildArr = [...newProps];
            else {
                if (typeof newProps === "string") {
                    newChildArr.push(newProps as any);
                } else {
                    newChildArr.push(newProps);
                }
            }
            return newChildArr;
        }
        return null;
    }

    public static getBounds(component: HTMLComponent | HTMLElement):
        { x: number, y: number, w: number, h: number, cw: number, ch: number, parents: Element[] } {
        let el = null;
        if (component) {
            if (component instanceof HTMLComponent) {
                el = component.dom;
            } else {
                el = component;
            }
        }
        let size = GinkgoTools.getWindowSize();
        if (el && el instanceof HTMLElement) {
            let parent: HTMLElement | null = el,
                list = [],
                scrolls = [],
                parentEls = [];

            /**
             * 计算布局相关的值
             **/
            while (parent && parent != document.body.parentElement) {
                let xbw, ybw;
                //判断是否存在getComputedStyle方法
                if (window.getComputedStyle) {
                    let style = document.defaultView.getComputedStyle(parent, null);
                    xbw = style.borderLeftWidth;
                    ybw = style.borderTopWidth;
                } else if ((parent as any).currentStyle) {
                    //兼容低版本ie
                    let style = (parent as any).currentStyle;
                    xbw = style.borderLeftWidth;
                    ybw = style.borderTopWidth;
                }

                list.push({
                    left: parent.offsetLeft,
                    top: parent.offsetTop,
                    w: parent.offsetWidth,
                    h: parent.offsetHeight,
                    bx: parseInt(xbw) || 0,
                    by: parseInt(ybw) || 0
                });
                parent = parent.offsetParent as HTMLElement;
            }

            /**
             * 计算滚动条相关的值
             */
            parent = el;
            while (parent && parent != document.body.parentElement) {
                if (parent.scrollLeft || parent.scrollTop) {
                    scrolls.push({
                        scrollLeft: parent.scrollLeft,
                        scrollTop: parent.scrollTop
                    });
                }
                if (document.body != parent) {
                    parentEls.push(parent);
                }
                parent = parent.parentElement as HTMLElement;
            }


            let x = 0, y = 0, sx = 0, sy = 0;
            for (let l of list) {
                x += l.left;
                y += l.top;

                if (!isNaN(l.bx)) x += l.bx;
                if (!isNaN(l.by)) y += l.by;
            }
            for (let s of scrolls) {
                sx += s.scrollLeft;
                sy += s.scrollTop;
            }

            return {
                x: x - sx,
                y: y - sy,
                w: el.offsetWidth,
                h: el.offsetHeight,
                cw: size.width,
                ch: size.height,
                parents: parentEls
            };
        }
        return {x: 0, y: 0, w: 0, h: 0, cw: 0, ch: 0, parents: undefined};
    }
}
