import {ContextLink, GinkgoContainer} from "./GinkgoContainer";
import {HTMLComponent} from "./HTMLComponent";
import {TextComponent} from "./TextComponent";
import {FragmentComponent} from "./FragmentComponent";

export class GinkgoMountElement {

    private goAfterDomLife(lifecycleComponents) {
        if (lifecycleComponents && lifecycleComponents.length > 0) {
            for (let link of lifecycleComponents) {
                let component = link.component;
                let props = link.props;
                component.componentReceiveProps && component.componentReceiveProps(props, {
                    oldProps: {},
                    type: "new"
                });
            }

            for (let link of lifecycleComponents) {
                let component = link.component;
                component.componentDidMount && component.componentDidMount();
            }
        }
    }

    public syncVirtualDom(mountLink: ContextLink, skips) {
        let component = mountLink.component;
        let lifecycleComponents = [];
        let shouldEl = mountLink.shouldEl;
        if (component instanceof HTMLComponent
            || component instanceof TextComponent
            || component instanceof FragmentComponent) {
            // 遍历children
            this.mountElementChildren(mountLink, shouldEl, lifecycleComponents, skips);
        } else {
            // 遍历content
            let content = mountLink.content;
            if (content) {
                if (content.status == "new") {
                    content.shouldEl = mountLink.shouldEl;
                }
                this.mountElementChildren(content, shouldEl, lifecycleComponents, skips);
            }
        }
        this.goAfterDomLife(lifecycleComponents);
        // let lifecycleComponents = [];
        // this.mountElements2Dom(mountLink, mountLink.shouldEl, false, lifecycleComponents, skips);
        // this.goAfterDomLife(lifecycleComponents);
    }

    private mountElementChildren(mountLink: ContextLink, shouldEl: Element, lifecycleComponents, skips) {
        // 跳过排除的,节约遍历时间
        if (skips && skips.indexOf(mountLink) >= 0) {
            return;
        }

        let component = mountLink.component;
        let isShouldLife = true;
        if (mountLink.status == "mount" || mountLink.status == "remount") {
            isShouldLife = false;
        }
        if (mountLink.status == "mount") {
            shouldEl = mountLink.shouldEl;
        } else {
            mountLink.shouldEl = shouldEl;
        }

        if (component instanceof HTMLComponent || component instanceof TextComponent) {
            let component = mountLink.component,
                props = mountLink.props;

            if (isShouldLife) {
                component.componentWillMount && component.componentWillMount();
                lifecycleComponents.push(mountLink);

                if (component instanceof HTMLComponent && typeof props === "object") {
                    let type = props.module;
                    if (typeof type == "string") {
                        let el = document.createElement(type);
                        if (shouldEl) {
                            shouldEl.append(el);
                            mountLink.status = "mount";
                        }
                        mountLink.holder.dom = el;
                        shouldEl = el;
                    } else {
                        throw Error("not support html tag " + type + ".");
                    }
                }

                if (component instanceof TextComponent && GinkgoContainer.isBaseType(props)) {
                    if (shouldEl && component.text != null && component.text != undefined) {
                        let text = document.createTextNode("" + component.text);
                        shouldEl.append(text);
                        mountLink.status = "mount";
                        if (mountLink) {
                            if (!mountLink.holder) {
                                mountLink.holder = {dom: text};
                            } else {
                                mountLink.holder.dom = text;
                            }
                        }
                    }
                }

                mountLink.shouldEl = shouldEl;
            } else {
                // 假如第一次content已经挂载children元素，之后多次重新挂载状态不变，element重新添加
                let el = mountLink && mountLink.holder ? mountLink.holder.dom : undefined;
                if (mountLink.status == "remount") {
                    if (el && component instanceof TextComponent && GinkgoContainer.isBaseType(mountLink.props)) {
                        el.textContent = "" + mountLink.props;
                    }
                    if (el && component instanceof HTMLComponent) {
                        shouldEl.append(el);
                    }
                }
            }

            let children = mountLink.children;
            if (children && children.length > 0) {
                for (let c of children) {
                    this.mountElementChildren(c, shouldEl, lifecycleComponents, skips);
                }

                // 按照列表顺序重新排序
                if (!isShouldLife) {
                    this.setChildDomSort(shouldEl, children);
                }
            }

            if (isShouldLife) {
                if (!lifecycleComponents) {
                    component.componentReceiveProps && component.componentReceiveProps(props, {
                        oldProps: {},
                        type: "new"
                    });
                    component.componentDidMount && component.componentDidMount();
                }
            }
        } else {
            if (shouldEl && mountLink) {
                let component = mountLink.component;
                let props = mountLink.props;

                if (component instanceof FragmentComponent) {
                    let children = mountLink.children;

                    if (isShouldLife) {
                        component.componentWillMount && component.componentWillMount();
                        lifecycleComponents.push(mountLink);
                    }

                    for (let c of children) {
                        this.mountElementChildren(c, shouldEl, lifecycleComponents, skips);
                    }

                    // 按照列表顺序重新排序 => FragmentComponent的子元素可以有多个所以必须判断重新排序
                    if (!isShouldLife) {
                        this.setChildDomSort(shouldEl, children);
                    }

                    mountLink.status = "mount";

                    if (isShouldLife) {
                        if (!lifecycleComponents) {
                            component.componentReceiveProps && component.componentReceiveProps(props, {
                                oldProps: {},
                                type: "new"
                            });
                            component.componentDidMount && component.componentDidMount();
                        }
                    }
                } else {
                    if (isShouldLife) {
                        component.componentWillMount && component.componentWillMount();
                        lifecycleComponents.push(mountLink);
                    }

                    if (mountLink.content) {
                        let content = mountLink.content;

                        if (content.status == "new" || content.status == "remount") {
                            this.mountElementChildren(content, shouldEl, lifecycleComponents, skips);
                        } else {
                            // let nextDom = this.getComponentFirstRealDom(content);
                            // if (nextDom) shouldEl.append(nextDom);
                        }
                        mountLink.status = "mount";
                    } else {
                        mountLink.status = "mount";
                    }

                    if (isShouldLife) {
                        if (!lifecycleComponents) {
                            component.componentReceiveProps && component.componentReceiveProps(props, {
                                oldProps: {},
                                type: "new"
                            });
                            component.componentDidMount && component.componentDidMount();
                        }
                    }
                }
            }
        }
    }


    /**
     * componentReceiveProps 和 componentDidMount 后发执行,顺序改为先添加好所有dom然后再走生命周期
     * 这样就可以避免componentReceiveProps内重新绘制时样式或者一些其他问题,所以参数lifecycleComponents
     * 用来存放这些组件
     *
     * @param mountLink
     * @param shouldEl
     * @param isShouldLife
     */
    private mountElements2Dom(mountLink: ContextLink,
                              shouldEl: Element,
                              isShouldLife,
                              lifecycleComponents,
                              skips) {
        // 跳过排除的,节约遍历时间
        if (skips && skips.indexOf(mountLink) >= 0) {
            return;
        }
        let parentComponent = mountLink.component;
        if (mountLink.status == "mount") {
            // 假如当前mountLink是已经挂载状态则不需要重新挂载
            // 并且当前mountLink的子元素应该添加到的元素也需要变为mountLink.shouldEl
            isShouldLife = false;
            shouldEl = mountLink.shouldEl;
        } else {
            mountLink.shouldEl = shouldEl;
            if (mountLink.status == "remount") isShouldLife = false;
        }

        if (parentComponent instanceof HTMLComponent || parentComponent instanceof TextComponent) {
            let component = mountLink.component,
                props = mountLink.props;

            if (isShouldLife) {
                component.componentWillMount && component.componentWillMount();
                lifecycleComponents.push(mountLink);

                if (component instanceof HTMLComponent && typeof props === "object") {
                    let type = props.module;
                    if (typeof type == "string") {
                        let el = document.createElement(type);
                        if (shouldEl) {
                            shouldEl.append(el);
                            mountLink.status = "mount";
                        }
                        mountLink.holder.dom = el;
                        shouldEl = el;
                    }
                }

                if (component instanceof TextComponent && GinkgoContainer.isBaseType(props)) {
                    if (shouldEl && component.text != null && component.text != undefined) {
                        let text = document.createTextNode("" + component.text);
                        shouldEl.append(text);
                        mountLink.status = "mount";
                        if (mountLink) {
                            if (!mountLink.holder) {
                                mountLink.holder = {dom: text};
                            } else {
                                mountLink.holder.dom = text;
                            }
                        }
                    }
                }
                mountLink.shouldEl = shouldEl;
            } else {

                // 假如第一次content已经挂载children元素，之后多次重新挂载状态不变，element重新添加

                let el = mountLink && mountLink.holder ? mountLink.holder.dom : undefined;
                if (mountLink.status == "remount") {
                    if (el && parentComponent instanceof TextComponent && GinkgoContainer.isBaseType(mountLink.props)) {
                        el.textContent = "" + mountLink.props;
                    }
                }
            }

            let children = mountLink.children;
            if (children && children.length > 0) {
                for (let c of children) {
                    this.mountElements2Dom(c, shouldEl, true, lifecycleComponents, skips);
                }

                // 按照列表顺序重新排序
                if (!isShouldLife) {
                    this.setChildDomSort(shouldEl, children);
                }
            }

            if (isShouldLife) {
                if (!lifecycleComponents) {
                    component.componentReceiveProps && component.componentReceiveProps(props, {
                        oldProps: {},
                        type: "new"
                    });
                    component.componentDidMount && component.componentDidMount();
                }
            }
        } else {
            /**
             * 之前的做法是每次更新都会讲当前组件的左右子组件全部更新一遍，由于设计理念问题，
             * 这种做法效率过低
             *
             * 自定义组件在挂载之后会绑定一个真实dom元素，每次自定义组件的父更新后只会通知自定义子更新props
             * 自定义子根据自己在componentReceiveProps或者componentUpdateProps中判断更新自定义组件内容
             *
             * 当自定义组件改变时自定义组件的所有自定义子不会在重新判断挂载调用mountElements2Dom方法而是将
             * 已经绑定过的dom元素重新添加
             */
            if (shouldEl && mountLink) {
                let component = mountLink.component;
                let props = mountLink.props;

                if (component instanceof FragmentComponent) {
                    let children = mountLink.children;

                    if (isShouldLife) {
                        component.componentWillMount && component.componentWillMount();
                        lifecycleComponents.push(mountLink);
                    }

                    for (let c of children) {
                        this.mountElements2Dom(c, shouldEl, true, lifecycleComponents, skips);
                    }

                    // 按照列表顺序重新排序 => FragmentComponent的子元素可以有多个所以必须判断重新排序
                    if (!isShouldLife) {
                        this.setChildDomSort(shouldEl, children);
                    }

                    mountLink.status = "mount";

                    if (isShouldLife) {
                        if (!lifecycleComponents) {
                            component.componentReceiveProps && component.componentReceiveProps(props, {
                                oldProps: {},
                                type: "new"
                            });
                            component.componentDidMount && component.componentDidMount();
                        }
                    }
                } else {
                    if (mountLink.content) {
                        let content = mountLink.content;

                        if (isShouldLife) {
                            component.componentWillMount && component.componentWillMount();
                            lifecycleComponents.push(mountLink);
                        }

                        this.mountElements2Dom(content, shouldEl, true, lifecycleComponents, skips);
                        mountLink.status = "mount";

                        if (isShouldLife) {
                            if (!lifecycleComponents) {
                                component.componentReceiveProps && component.componentReceiveProps(props, {
                                    oldProps: {},
                                    type: "new"
                                });
                                component.componentDidMount && component.componentDidMount();
                            }
                        }
                    } else {
                        mountLink.status = "mount";
                    }
                }
            }
        }
    }

    private setChildDomSort(shouldEl: Element, children: Array<ContextLink>) {
        // 如果是自定义组件则子元素顺序无所谓
        // 但是如果是dom元素组件则需要判断一下对象顺序是否和dom顺序一致
        // 如果不一致则修改状态为remount

        // PS : 如果当前组件是自定义组件且顺序不一致这时候计算要更复杂一些

        if (children.length == 1) {
            return false;
        }

        let domChild = shouldEl.childNodes;
        let domIndex = {int: -1, old: -1};
        let setRemount = false;
        for (let c of children) {
            setRemount = this.isChildrenRemountOrder(c, domChild, domIndex);
            if (setRemount) break;
        }
        if (setRemount) {
            for (let c of children) {
                if (c.component instanceof HTMLComponent || c.component instanceof TextComponent) {
                    if (c.holder.dom) shouldEl.append(c.holder.dom);
                } else {
                    let dom = this.getComponentFirstRealDom(c);
                    if (dom) shouldEl.append(dom);
                }
            }
        }
    }

    private isChildrenRemountOrder(c: ContextLink, domChild, domIndex: { int: number, old: number }) {
        let setRemount = false;
        if (c.component instanceof HTMLComponent || c.component instanceof TextComponent) {
            if (c.holder && c.holder.dom) this.isChildrenOrderIndex(domIndex, c.holder.dom, domChild);
            if (domIndex.int != -1 && domIndex.old != -1 && domIndex.int <= domIndex.old) {
                return true;
            }
        } else {
            if (c.component instanceof FragmentComponent) {
                let fragmentChild = c.children;
                if (fragmentChild && fragmentChild.length > 0) {
                    for (let fc of fragmentChild) {
                        setRemount = this.isChildrenRemountOrder(fc, domChild, domIndex);
                        if (setRemount == true) return setRemount;
                    }
                }
            } else {
                let dom = this.getComponentFirstRealDom(c);
                // if (dom != domChild[domIndex.int]) {
                //     setRemount = true;
                //     return setRemount;
                // }
                if (dom) this.isChildrenOrderIndex(domIndex, dom, domChild);
                if (domIndex.int != -1 && domIndex.old != -1 && domIndex.int <= domIndex.old) {
                    return true;
                }
            }
        }
        return setRemount;
    }

    private isChildrenOrderIndex(domIndex: { int: number, old: number },
                                 dom,
                                 domChild) {
        for (let i = 0; i < domChild.length; i++) {
            if (domChild[i] == dom) {
                domIndex.old = domIndex.int
                domIndex.int = i;
                break;
            }
        }
    }

    private getComponentFirstRealDom(child: ContextLink) {
        if (child) {
            let link = child.content;
            if (link) {
                if (link.component instanceof HTMLComponent || link.component instanceof TextComponent) {
                    return link.holder.dom;
                } else {
                    return this.getComponentFirstRealDom(link);
                }
            }
        }
        return null;
    }
}
