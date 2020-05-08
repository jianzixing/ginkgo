import Ginkgo, {CSSProperties, GinkgoNode, RefObject} from "../../carbon/Ginkgo";
import TreePanel from "../tree/TreePanel";
import FormLayout from "../layout/FormLayout";
import Button from "../button/Button";

import pic1 from "../assests/ms/userDefined.png";
import pic2 from "../assests/ms/htaccess_dark.png";
import pic3 from "../assests/ms/library.png";
import pic4 from "../assests/ms/settings.png";
import pic5 from "../assests/ms/shop.png";
import pic6 from "../assests/ms/wechat.png";
import BorderLayout, {BorderLayoutItem} from "../layout/BorderLayout";
import Component, {ComponentProps} from "../component/Component";
import {IconTypes} from "../icon/IconTypes";

export interface NavModuleModel {
    key?: string;
    text?: string;
    icon?: string;
    iconType?: string;
    name?: string;
    module?: any;
    props?: any;
}

export interface AppNavigationProps extends ComponentProps {
    onModuleItemClick?: (value: NavModuleModel) => void;
}

export default class AppNavigation extends Component<AppNavigationProps> {
    protected treePanelRef: RefObject<TreePanel<any>> = Ginkgo.createRef();

    drawing(): GinkgoNode {
        let buttonStyle = {
            width: "100%",
            height: 36,
            fontSize: 12
        }

        let buttons = [];
        for (let b of modules) {
            buttons.push(<Button style={buttonStyle}
                                 action={"none"}
                                 text={b.text}
                                 icon={b.icon}
                                 pressing={b.selected}
                                 outerStyle={{border: 0, color: "#000000"}}
                                 onClick={e => {
                                     for (let m of modules) {
                                         m.selected = false;
                                     }
                                     b.selected = true;
                                     this.redrawing();

                                     this.onModuleButtonClick(b);
                                 }}/>)
        }

        return (
            <BorderLayout>
                <BorderLayoutItem type={"north"}>
                    <FormLayout column={3}
                                spacingH={0}
                                spacingV={0}
                                padding={"0 0"}
                                style={{backgroundColor: "#ffffff"}}>
                        {buttons}
                    </FormLayout>
                </BorderLayoutItem>
                <BorderLayoutItem type={"center"}>
                    <TreePanel
                        key={"tree"}
                        ref={this.treePanelRef}
                        title={"Examples"}
                        titleIconType={"university"}
                        data={moduleTreeData['Components']}
                        onItemClick={(e, model) => {
                            if (this.props.onModuleItemClick) {
                                let data = model.data;
                                this.props.onModuleItemClick({
                                    text: data['text'],
                                    name: data['name'],
                                    icon: data['icon'],
                                    iconType: data['iconType'],
                                    module: data['module'],
                                    props: data['props']
                                });
                            }
                        }}
                    />
                </BorderLayoutItem>
            </BorderLayout>
        );
    }

    onModuleButtonClick(module) {
        let name = module.name;
        let data = moduleTreeData[name];
        if (this.treePanelRef && this.treePanelRef.instance) {
            this.treePanelRef.instance.update({data: data, title: module['text']});
        }
    }

    protected getRootStyle(): CSSProperties {
        let style = super.getRootStyle();
        style.width = "100%";
        style.height = "100%";
        return style;
    }
}

let modules = [
    {text: "会员", name: "Components", icon: pic1, selected: false},
    {text: "微信", name: "Grids", icon: pic2, selected: false},
    {text: "商城", name: "Trees", icon: pic3, selected: false},
    {text: "配置", name: "", icon: pic4, selected: false},
    {text: "统计", name: "", icon: pic5, selected: false},
    {text: "系统", name: "", icon: pic6, selected: false}
]

let moduleTreeData =
    {
        Components: [{
            text: 'Components',
            iconType: 'book',
            children: [
                {
                    text: 'Buttons',
                    iconType: 'bug',
                    leaf: true
                },
                {
                    text: 'Form Fields',
                    iconType: 'calculator',
                    leaf: true
                },
                {
                    text: 'Forms',
                    iconType: 'cloud',
                    leaf: true
                },
                {
                    text: 'Date Picker',
                    iconType: 'cloud',
                    leaf: true
                },
                {
                    text: 'Layouts',
                    iconType: 'certificate',
                    leaf: true
                },
                {
                    text: 'Panels',
                    iconType: 'cog',
                    leaf: true
                },
                {
                    text: 'Tabs',
                    iconType: 'car-crash',
                    leaf: true
                },
                {
                    text: 'Tooltips',
                    iconType: 'award',
                    leaf: true
                },
                {
                    text: 'Toolbars',
                    iconType: 'blind',
                    leaf: true
                },
                {
                    text: 'Windows',
                    iconType: 'calendar-alt',
                    leaf: true
                }
            ]
        }],
        Grids: [
            {
                text: 'Core Features',
                iconType: 'carrot',
                children: [
                    {
                        text: 'Basic Grid',
                        iconType: 'chalkboard',
                        leaf: true
                    },
                    {
                        text: 'Paging Grid',
                        iconType: 'church',
                        leaf: true
                    },
                    {
                        text: 'Grouped Grid',
                        iconType: 'church',
                        leaf: true
                    },
                    {
                        text: 'Checkbox Selection Model',
                        iconType: 'circle',
                        leaf: true
                    },
                    {
                        text: 'Row Number',
                        iconType: 'desktop',
                        leaf: true
                    },
                    {
                        text: 'Grouped Header Grid',
                        iconType: 'file-excel',
                        leaf: true
                    },
                    {
                        text: 'Multiple Sort Grid',
                        iconType: 'comment',
                        leaf: true
                    },
                    {
                        text: 'Locking Grid',
                        iconType: 'dolly',
                        leaf: true
                    },
                    {
                        text: 'Cell Editing',
                        iconType: 'comment-alt',
                        leaf: true
                    },
                    {
                        text: 'Row Editing',
                        iconType: 'copyright',
                        leaf: true
                    },
                    {
                        text: 'Row Expander',
                        iconType: 'crosshairs',
                        leaf: true
                    },
                    {
                        text: 'Property Grid',
                        iconType: 'deaf',
                        leaf: true
                    }
                ]
            }
        ],
        Trees: [{
            text: 'Trees',
            iconType: 'file-word',
            children: [
                {
                    text: 'Basic Trees',
                    iconType: 'flag',
                    leaf: true
                },
                {
                    text: 'Tree Reorder',
                    iconType: 'adjust',
                    leaf: true
                },
                {
                    text: 'Tree Grid',
                    iconType: 'angry',
                    leaf: true
                },
                {
                    text: 'Two Trees',
                    iconType: 'backward',
                    leaf: true
                },
                {
                    text: 'Check Tree',
                    iconType: 'bell',
                    leaf: true
                },
                {
                    text: 'Filtered Tree',
                    iconType: 'grimace',
                    leaf: true
                }
            ]
        }]
    };
