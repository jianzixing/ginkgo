import Ginkgo, {HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import Button from "../button/Button";
import TabPanel, {TabModel} from "../tab/TabPanel";
import Panel, {PanelProps} from "../panel/Panel";
import Toolbar, {ToolbarSplit} from "../toolbar/Toolbar";
import {WindowPanel} from "../window/Window";
import {IconTypes} from "../icon/IconTypes";
import ViewPort from "../panel/ViewPort";
import BorderLayout, {BorderLayoutItem} from "../layout/BorderLayout";
import TreePanel from "../tree/TreePanel";
import TextField from "../form/TextField";
import NumberTextField from "../form/NumberTextField";
import DatePicker from "../datepicker/DatePicker";
import ComboboxField, {ComboboxModel} from "../form/ComboboxField";
import DateTimeField from "../form/DateTimeField";
import {FileUploadField} from "../form/FileUploadField";
import CheckboxField from "../form/CheckboxField";
import RadioField from "../form/RadioField";
import CheckboxGroupField from "../form/CheckboxGroupField";
import RadioGroupField from "../form/RadioGroupField";
import TagField from "../form/TagField";
import TextAreaField from "../form/TextAreaField";
import DisplayField from "../form/DisplayField";
import SliderField from "../form/SliderField";
import DataStore from "../store/DataStore";
import FormFieldSet from "../form/FormFieldSet";
import Tooltip from "../tooltips/Tooltip";
import PagingToolbar from "../toolbar/PagingToolbar";
import FormPanel from "../panel/FormPanel";
import TreeGrid from "../tree/TreeGrid";
import GridPanel from "../grid/GridPanel";

import "./App.scss";
import AppHeader from "./AppHeader";
import AppNavigation from "./AppNavigation";
import AppContent, {TabContentModel} from "./AppContent";
import TestManager from "./TestManager";

export default class App extends Ginkgo.Component {

    protected appContentRef: RefObject<AppContent<any>> = Ginkgo.createRef();
    protected contents: Array<TabContentModel> = [
        {
            key: "home",
            title: "主页",
            iconType: IconTypes.home,
            action: true,
            module: {module: TestManager},
            closable: false
        }
    ];

    private style: any = {color: '#999999', fontSize: 18};

    render() {
        return (
            <ViewPort>
                <BorderLayout>
                    <BorderLayoutItem type={"north"} height={52}>
                        <AppHeader/>
                    </BorderLayoutItem>
                    <BorderLayoutItem type={"west"} split={true} width={215}>
                        <Panel title={"工作台"} collapse={true} collapseType={"left"}>
                            <AppNavigation onModuleItemClick={model => {
                                let key = model.key;
                                for (let content of this.contents) {
                                    if (content.key == key) {
                                        return;
                                    }
                                }
                                this.contents.map(value => value.action = false);
                                this.contents.push({
                                    key: model.text,
                                    title: model.text,
                                    action: true,
                                    module: model,
                                    icon: model.icon,
                                    iconType: model.iconType
                                });
                                if (this.appContentRef.instance) {
                                    this.appContentRef.instance.setItemsAndRedrawing(this.contents);
                                }
                            }}/>
                        </Panel>
                    </BorderLayoutItem>
                    <BorderLayoutItem type={"center"}>
                        <AppContent ref={this.appContentRef} items={this.contents}/>
                        {/*<Panel*/}
                        {/*    ref={this.mainPanel}*/}
                        {/*    collapse={true}*/}
                        {/*    titleIconType={"cubes"}*/}
                        {/*    header={true}*/}
                        {/*>*/}
                        {/*    <div*/}
                        {/*        ref={this.mainPanelBody}*/}
                        {/*        style={{*/}
                        {/*            display: "flex",*/}
                        {/*            justifyContent: "center",*/}
                        {/*            alignItems: "center",*/}
                        {/*            width: "100%",*/}
                        {/*            height: "100%",*/}
                        {/*            backgroundColor: '#e9e9e9',*/}
                        {/*            backgroundImage: 'linear-gradient(0deg,#f4f4f4 1.1px, transparent 0), linear-gradient(90deg,#f4f4f4 1.1px, transparent 0)',*/}
                        {/*            backgroundSize: '20px 20px'*/}
                        {/*        }}>*/}
                        {/*        {this.buildDemos("Cell Editing")}*/}
                        {/*    </div>*/}
                        {/*</Panel>*/}
                    </BorderLayoutItem>
                </BorderLayout>
            </ViewPort>
        )
    }

    buildDemos(type) {
        let demo;
        if (type == "Buttons") {
            demo = this.buildButtons();
        } else if (type == "Forms") {
            demo = this.buildForms();
        } else if (type == "Date Picker") {
            demo = this.buildDatePicker();
        } else if (type == "Panels") {
            demo = this.buildPanels();
        } else if (type == "Tabs") {
            demo = this.buildTabPanel();
        } else if (type == "Tooltips") {
            demo = this.buildTooltips();
        } else if (type == "Toolbars") {
            demo = this.buildTools();
        } else if (type == "Windows") {
            demo = this.buildWindows();
        } else if (type == "Basic Grid") {
            demo = this.buildBasicGrid();
        } else if (type == "Paging Grid") {
            demo = this.buildPagingGrid();
        } else if (type == "Row Number") {
            demo = this.buildRowNumberGrid();
        } else if (type == "Cell Editing") {
            demo = this.buildCellEditingGrid();
        } else if (type == "Basic Trees") {
            demo = this.buildBasicTrees();
        } else if (type == "Tree Grid") {
            demo = this.buildTreeGrid();
        } else {
            demo = <span style={this.style}>没有当前组件例子</span>;
        }
        return demo;
    }


    buildButtons() {
        return (
            <div>
                <div>
                    <Button text={"Small"} style={{marginRight: 20}}/>
                    <Button text={"Image"} style={{marginRight: 20}}
                            icon={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574764507193&di=99ddf55d83ec47492efff2069b3f0ec7&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fdc54564e9258d1092f7663c9db58ccbf6c814d30.jpg"}/>
                    <Button text={"Small"} iconType={IconTypes.home} style={{marginRight: 20}}/>
                    <Button text={"Medium"} iconType={IconTypes.home} iconAlign={"left"} size={"medium"}
                            style={{marginRight: 20}}/>
                    <Button text={"Large"} iconType={IconTypes.home} iconAlign={"left"} size={"large"}
                            style={{marginRight: 20}}/>
                </div>
                <div>
                    <Button text={"Small"} iconType={IconTypes.home} toggle={true}
                            style={{marginRight: 20}}/>
                    <Button text={"Small"} menuType={"bottom"} style={{marginRight: 20}}
                            menuModels={[{text: 'Button Item 1'}, {text: 'Button Item 2'}, {text: 'Button Item 3'}]}/>
                    <Button text={"Small"} menuType={"bottom"} size={"medium"} style={{marginRight: 20}}/>
                    <Button text={"Small"} menuType={"bottom"} size={"large"} style={{marginRight: 20}}/>
                </div>
                <div>
                    <Button text={"Small"} iconType={IconTypes.home} toggle={true} menuType={"splitNormal"}
                            style={{marginRight: 20}}/>
                    <Button text={"Small"} menuType={"splitBottom"} style={{marginRight: 20}}
                            menuModels={[{text: 'Button Item 1'}, {text: 'Button Item 2'}, {text: 'Button Item 3'}]}/>
                    <Button text={"Small"} menuType={"bottom"} size={"medium"} style={{marginRight: 20}}/>
                    <Button text={"Small"} menuType={"bottom"} size={"large"} style={{marginRight: 20}}/>
                </div>
                <div>
                    <Button text={"Small"} style={{marginRight: 20}} width={100}
                            href={"http://www.baidu.com"}
                            contentAlign={"right"}/>
                </div>
            </div>
        )
    }

    buildForms() {
        let comboItems: Array<ComboboxModel> = [];
        comboItems.push({text: 'Alabama'});
        comboItems.push({text: 'Alaska'});
        comboItems.push({text: 'Arizona'});
        comboItems.push({text: 'Arkansas'});
        comboItems.push({text: 'California'});
        comboItems.push({text: 'Colorado'});
        comboItems.push({text: 'Connecticut'});
        comboItems.push({text: 'Delaware'});
        comboItems.push({text: 'District of Columbia'});
        comboItems.push({text: 'Florida'});
        comboItems.push({text: 'Georgia'});
        return (
            <FormPanel width={500} height={400}
                       border={true}
                       title={"Number fields"}
                       mask={false}
                       scroll={true}>
                <TextField disable={true} fieldLabel={"Login Field"} placeholder={"user id"}/>
                <TextField fieldLabel={"Password"} placeholder={"password"}/>
                <NumberTextField fieldLabel={"Number Field"} placeholder={"password"}/>
                <ComboboxField fieldLabel={"Combobox Field"} data={comboItems}/>
                <ComboboxField fieldLabel={"Remote Combobox"}
                               store={new DataStore({api: "https://www.baidu.com"})}/>
                <DateTimeField fieldLabel={"Date Field"} showTime={true}/>
                <FileUploadField fieldLabel={"File Upload"}/>
                <CheckboxField fieldLabel={"Check Field"} text={"Check"}/>
                <RadioField fieldLabel={"Radio Field"} text={"Radio"}/>
                <CheckboxGroupField fieldLabel={"Check Field Group"}
                                    models={[{text: 'S1'}, {text: 'S2'}, {text: 'S3'}]}
                                    itemWidth={60}/>
                <RadioGroupField fieldLabel={"Radio Field Group"}
                                 models={[{text: 'S1'}, {text: 'S2'}, {text: 'S3'}]}
                                 itemWidth={60}/>
                <TagField fieldLabel={"Tag Field"}
                          models={[{text: 'S1'}, {text: 'S2'}, {text: 'S3'}, {text: 'S4'}, {text: 'S5'}]}/>
                <TextAreaField fieldLabel={"Text Area Field"} placeholder={"Text Area Content..."}/>
                <DisplayField fieldLabel={"Display Field"}
                              emptyText={"Display Field <span style='color: #2b7fca'>Value</span>"}/>
                <SliderField fieldLabel={"Slider Field"}/>

                <FormFieldSet legend={"Individual Checkboxes"}>
                    <TextField type={"password"} fieldLabel={"Password"} placeholder={"password"}
                               style={{width: "100%"}}/>
                </FormFieldSet>
            </FormPanel>
        )
    }

    buildDatePicker() {
        return (
            <Panel width={310} height={386} title={"Date Picker"}>
                <DatePicker/>
            </Panel>
        )
    }

    buildPanels() {
        return (
            <Panel
                headerAlign={"left"}
                frame={true}
                scroll={"y"}
                width={500}
                height={300}
                collapse={true}
                title={"Panel"}
                titleIconType={IconTypes.home}
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
            </Panel>
        )
    }

    buildWindows() {
        return (
            <Ginkgo.Fragment>
                <WindowPanel
                    width={500}
                    height={300}
                    x={200}
                    y={100}
                    title={"Window Layer"}
                    restrict={true}
                >
                    <div/>
                </WindowPanel>

                <WindowPanel
                    mask={true}
                    width={500}
                    height={300}
                    x={200}
                    y={100}
                    title={"Window Layer"}
                    restrict={true}
                >
                    <div/>
                </WindowPanel>

                <WindowPanel
                    width={500}
                    height={300}
                    x={200}
                    y={100}
                    title={"Window Layer"}
                    restrict={true}
                    closable={true}
                >
                    <div/>
                </WindowPanel>
            </Ginkgo.Fragment>
        );
    }

    buildTools() {
        // return (
        //     <Toolbar width={500}>
        //         <Button text={"列出会员"}/>
        //         <Button text={"列出会员"}/>
        //         <ToolbarSplit split={"right"}/>
        //         <Button text={"添加等级"}/>
        //     </Toolbar>
        // )

        return (
            <div>
                <div>
                    <Toolbar direction={"horizontal"} width={500}>
                        <Button text={"列出会员1"}/>
                        <ToolbarSplit type={"split"}/>
                        <Button text={"列出会员2"}/>
                        <Button text={"列出会员3"}/>
                        <Button text={"列出会员4"}/>
                        {/*<Button text={"列出会员5"}/>*/}
                        {/*<Button text={"列出会员6"}/>*/}
                        {/*<Button text={"列出会员7"}/>*/}
                        {/*<Button text={"列出会员8"}/>*/}
                        {/*<Button text={"列出会员9"}/>*/}
                        {/*<Button text={"列出会员10"}/>*/}
                        {/*<Button text={"列出会员11"}/>*/}
                        {/*<Button text={"列出会员12"}/>*/}
                        {/*<Button text={"列出会员13"}/>*/}
                        {/*<ToolbarSplit type={"align"}/>*/}
                        {/*<Button text={"列出会员14"}/>*/}
                        {/*<ToolbarSplit type={"align"}/>*/}
                        {/*<Button text={"列出会员15"}/>*/}
                    </Toolbar>
                </div>
                <div style={{marginTop: 20}}>
                    <PagingToolbar width={600}></PagingToolbar>
                </div>
            </div>
        )
    }

    buildTabPanel() {
        return (
            <TabPanel
                width={500}
                height={300}
                headerAlign={"bottom"}
                border={true}
                // headerRotation={"deg270"}
            >
                <Panel key={"a"} title={"Tab 1"} titleIconType={"cog"}>
                    abc
                </Panel>
                <Panel key={"b"} title={"Tab 2"} titleIconType={"home"}>
                    def
                </Panel>
                <input/>
            </TabPanel>
        )
    }

    buildBasicGrid() {
        return (
            <GridPanel
                tableCellBorder={false}
                title={"Basic Grid"}
                columns={[
                    {type: "checkbox"},
                    {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                    {title: "Age Grid Column", width: 200, dataIndex: 'age'},
                    {title: "Name Grid Column", width: 100, dataIndex: 'name'},
                    {
                        type: "actioncolumn",
                        width: 50,
                        items: [
                            {iconType: IconTypes.check, color: "#81cb31"},
                            {iconType: IconTypes.ban, color: "#dd6550"}
                        ]
                    }
                ]}
                data={[
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"}
                ]}
                width={600} height={400}
                onItemClick={(e, data) => {
                    console.log(e, data)
                }}/>)
    }

    buildPagingGrid() {
        return (
            <GridPanel
                title={"Paging Grid"}
                paging={true}
                columns={[
                    {type: "rownumber"},
                    {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                    {title: "Age Grid Column", width: 200, dataIndex: 'age'},
                    {title: "Name Grid Column", width: 100, dataIndex: 'name'}
                ]}
                store={new DataStore({api: "http://localhost:3300/data.json", autoLoad: true})}
                width={600}
                height={400}/>)
    }

    buildRowNumberGrid() {
        return (
            <GridPanel
                fit={true}
                title={"Row Number Grid"}
                columns={[
                    {type: "rownumber"},
                    {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                    {title: "Age Grid Column", width: 200, dataIndex: 'age'},
                    {title: "Name Grid Column", width: 100, dataIndex: 'name'},
                    {title: "Flex=1", flex: 1, width: 100, dataIndex: 'name'}
                ]}
                data={[
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"}
                ]}
                width={700} height={400}/>)
    }

    buildCellEditingGrid() {
        return (
            <GridPanel
                fit={true}
                title={"Cell Editing Grid"}
                columns={[
                    {title: "Text Grid Column", width: 200, dataIndex: 'text'},
                    {
                        title: "Age Grid Column",
                        width: 200,
                        dataIndex: 'age',
                        editing: {field: <ComboboxField data={["A", "B", "C"]}/>}
                    },
                    {
                        title: "Name Grid Column",
                        width: 100,
                        dataIndex: 'name',
                        editing: {field: <TextField/>}
                    },
                    {
                        title: "Age Grid Column",
                        width: 60,
                        dataIndex: 'age',
                        editing: {field: <NumberTextField/>, showEvent: "dbclick"}
                    },
                    {
                        title: "Checkbox",
                        width: 60,
                        dataIndex: 'checked',
                        editing: {field: <CheckboxField/>, fieldType: "check", showEvent: "show"}
                    }
                ]}
                data={[
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"},
                    {text: "Table 1", age: "12", name: "Yang An Kang"}
                ]}
                width={700} height={400}/>)
    }

    tooltipsButton: RefObject<Button<any>> = Ginkgo.createRef();

    buildTooltips() {
        return (
            <Button text={"click show tooltips"}
                    ref={this.tooltipsButton}
                    height={90}
                    onClick={e => {
                        Tooltip.show(
                            <Tooltip align={"right"} indicator={true}>
                                <span>A simple tooltips</span>
                            </Tooltip>,
                            this.tooltipsButton.instance)
                    }}/>
        )
    }

    buildBasicTrees() {
        let data = [
            {
                text: 'Ext js',
                children: [
                    {text: 'app'},
                    {text: 'button'},
                    {text: 'container'},
                    {text: 'dashboard'},
                    {text: 'dd'},
                    {text: 'dom'},
                    {text: 'flash'},
                ]
            }
        ]
        return (
            <TreePanel title={"Basic Tree Panel"} data={data} width={300}/>
        )
    }

    buildTreeGrid() {
        let data = [
            {
                text: 'Ext js',
                name: 'E',
                children: [
                    {text: 'app', name: 'A'},
                    {text: 'button', name: 'B'},
                    {text: 'container', name: 'C'},
                    {text: 'dashboard', name: 'D'},
                    {text: 'dd', name: 'D'},
                    {text: 'dom', name: 'D'},
                    {text: 'flash', name: 'F'},
                ]
            }
        ]
        return (
            <TreeGrid columns={[
                {title: "Text", width: 200, dataIndex: 'text'},
                {title: "Name", width: 200, dataIndex: 'name'}
            ]} data={data} width={500} height={300}/>
        )
    }
}
