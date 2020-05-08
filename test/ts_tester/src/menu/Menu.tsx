import Ginkgo, {GinkgoElement, GinkgoNode, CSSProperties, HTMLComponent} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import "./Menu.scss";

export class MenuShowing {
    private readonly link;

    constructor(link) {
        this.link = link;
    }

    close() {
        Menu.close(this.link.props as MenuProps);
    }

    redrawing() {
        if (this.component instanceof Component) {
            this.component.redrawing();
        }
    }

    get component() {
        return this.link.component;
    }
}

export interface MenuModel {
    text: string;
    /* custom field */
    type?: string;
    iconType?: string;
    selected?: boolean;
    /* custom field */
    data?: any,
    disabled?: boolean;
    children?: Array<MenuModel>;
}

export interface MenuProps extends ComponentProps {
    x: number;
    y: number;
    items: Array<MenuModel>;
    onMenuItemClick?: (e: Event, value: MenuModel, menu: Menu<MenuProps>) => void;
    clickCloseMenu?: boolean;
    onMenuClose?: (menu: MenuProps) => void;
}

let AllMenus: Array<Menu<any>> = [];

export default class Menu<P extends MenuProps> extends Component<P> {
    protected menuItemRefs: Array<HTMLComponent> = [];
    protected childrenMenus: { showing: MenuShowing, value: MenuModel, index: number };
    protected static menuClsRoot;
    protected static menuClsBody;
    protected static menuClsItem;
    protected static menuClsIcon;
    protected static menuClsText;
    protected static menuClsSelected;
    protected static menuClsMore;
    protected static menuClsDisabled;

    static show(menu: MenuProps) {
        let link = Ginkgo.render(menu, document.body);
        let showing = new MenuShowing(link);
        return showing;
    }

    static close(menu: MenuProps) {
        if (menu.onMenuClose) {
            menu.onMenuClose(menu);
        }
        Ginkgo.unmountByElement(menu, document.body);
    }

    static closeAllMenus() {
        if (AllMenus) {
            for (let menu of AllMenus) {
                Menu.close(menu.props as MenuProps);
            }
        }
    }

    protected isEnableDocumentClick: boolean = true;

    constructor(props: P) {
        super(props);
    }

    componentDidMount(): void {
        super.componentDidMount();
        AllMenus.push(this);
    }

    componentWillUnmount(): void {
        super.componentWillUnmount();
        AllMenus = AllMenus.filter(value => value != this);
    }

    protected onDocumentMouseDown(e: MouseEvent) {
        Menu.close(this.props);
    }

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        Menu.menuClsRoot = this.getThemeClass("menu");
        Menu.menuClsBody = this.getThemeClass("menu-body");
        Menu.menuClsItem = this.getThemeClass("menu-item");
        Menu.menuClsIcon = this.getThemeClass("menu-icon");
        Menu.menuClsText = this.getThemeClass("menu-text");
        Menu.menuClsSelected = this.getThemeClass("menu-selected");
        Menu.menuClsMore = this.getThemeClass("menu-more");
        Menu.menuClsDisabled = this.getThemeClass("menu-item-disabled");
    }

    drawing(): GinkgoElement | undefined | null {
        let items: Array<MenuModel> | undefined = this.props.items,
            itemNodes: Array<GinkgoNode> = [];

        this.menuItemRefs = [];
        if (items) {
            items.map((value, index) => {
                let css = [Menu.menuClsItem];
                if (value.selected) css.push(Menu.menuClsSelected);

                let childIcon, iconType;
                if (value.children) {
                    childIcon = (
                        <div className={Menu.menuClsMore}>
                            <Icon icon={IconTypes.caretRight}/>
                        </div>);
                }
                if (value.iconType) {
                    iconType = <Icon icon={value.iconType}/>
                }
                if (value.disabled) {
                    css.push(Menu.menuClsDisabled);
                }

                itemNodes.push(
                    <div
                        ref={(ref) => {
                            this.menuItemRefs[index] = ref;
                        }}
                        key={index}
                        className={css.join(" ")}
                        onMouseEnter={() => {
                            this.onMenuSelect(value, index);
                        }}
                        onClick={(e: any) => {
                            if (this.props.clickCloseMenu != false) {
                                if (!value.children) {
                                    Menu.close(this.props);
                                }
                            }
                            if (this.props.onMenuItemClick && !value.disabled) {
                                this.props.onMenuItemClick(e, value, this);
                            }
                        }}
                    >
                        <div className={Menu.menuClsIcon}>
                            {iconType}
                        </div>
                        <div className={Menu.menuClsText}>
                            {value.text}
                        </div>
                        {childIcon}
                    </div>
                )
            });
        }

        return (
            <div className={Menu.menuClsBody}>
                {itemNodes}
            </div>
        );
    }

    redrawing() {
        super.redrawing();
        if (this.childrenMenus && this.childrenMenus.showing) {
            this.childrenMenus.showing.redrawing();
        }
    }

    protected onMouseDown(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        super.onMouseDown(e);
    }

    onMenuSelect(value: MenuModel, index: number) {
        let items: Array<MenuModel> | undefined = this.props.items;
        if (items) {
            items.map(v => v.selected = false);
            this.closeChildrenMenus();
            this.showMenuChildren(value, index);

            value.selected = true;
            this.redrawing();
        }
    }

    private showMenuChildren(value: MenuModel, index: number) {
        if (value.children) {
            let ref = this.menuItemRefs[index];
            let el = ref.dom;
            if (el && this.rootEl && this.rootEl.dom instanceof HTMLElement
                && el instanceof HTMLElement) {
                let x = this.rootEl.dom.offsetLeft,
                    y = this.rootEl.dom.offsetTop,
                    itemY = el.offsetTop,
                    w = this.rootEl.dom.offsetWidth;

                let oldModal = this.childrenMenus;
                if (oldModal && oldModal.showing) {
                    oldModal.showing.close();
                }

                let modal = Menu.show(
                    <Menu
                        x={x + w}
                        y={y + itemY}
                        items={value.children}
                        clickCloseMenu={this.props.clickCloseMenu}
                        onMenuItemClick={this.props.onMenuItemClick}
                    />);
                this.childrenMenus = {showing: modal, value: value, index: index};
            }
        }
    }

    private closeChildrenMenus() {
        if (this.childrenMenus && this.childrenMenus.showing) {
            this.childrenMenus.showing.close();
            this.childrenMenus = undefined;
        }
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push(Menu.menuClsRoot);
        return arr;
    }

    getRootStyle(): CSSProperties {
        let style = super.getRootStyle();
        style.zIndex = 100000;
        style.left = this.props.x || 0;
        style.top = this.props.y || 0;
        return style;
    }
}
