import Ginkgo, {GinkgoNode, RefObject} from "../../carbon/Ginkgo";
import {AppManager, AppManagerProps} from "./AppPanel";
import FormPanel from "../panel/FormPanel";
import FormLayout, {FormLayoutTitle} from "../layout/FormLayout";
import TextField from "../form/TextField";
import NumberTextField from "../form/NumberTextField";
import ComboboxField, {ComboboxModel} from "../form/ComboboxField";
import DataStore from "../store/DataStore";
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
import FormFieldSet from "../form/FormFieldSet";
import Toolbar from "../toolbar/Toolbar";
import Button from "../button/Button";
import {IconTypes} from "../icon/IconTypes";
import HiddenField from "../form/HiddenField";

export interface TestBuilderProps extends AppManagerProps {

}

export default class TestBuilder<P extends TestBuilderProps> extends AppManager<P> {
    protected formPanelRef: RefObject<FormPanel<any>> = Ginkgo.createRef();

    render(): GinkgoNode {
        let comboItems = [];
        comboItems.push({id: 1, text: 'Alabama'});
        comboItems.push({id: 2, text: 'Alaska'});
        comboItems.push({id: 3, text: 'Arizona'});
        comboItems.push({id: 4, text: 'Arkansas'});
        comboItems.push({id: 5, text: 'California'});
        comboItems.push({id: 6, text: 'Colorado'});
        comboItems.push({id: 7, text: 'Connecticut'});
        comboItems.push({id: 8, text: 'Delaware'});
        comboItems.push({id: 9, text: 'District of Columbia'});
        comboItems.push({id: 10, text: 'Florida'});
        comboItems.push({id: 11, text: 'Georgia'});

        return (
            <FormPanel ref={this.formPanelRef}
                       layout={{bodyWidth: 820, padding: "20 30"}}
                       toolbars={[
                           <Toolbar>
                               <Button iconType={"reply"}
                                       iconColor={"#b8288a"}
                                       text={"返回"}
                                       onClick={e => {
                                           this.back();
                                       }}/>
                               <Button iconType={"save"}
                                       iconColor={"#30c461"}
                                       text={"保存"}
                                       onClick={e => {
                                           this.formPanelRef.instance.validate();
                                       }}/>
                           </Toolbar>
                       ]}
                       values={{
                           login_field: "Value - Login Field",
                           password: "Value - Password Field",
                           number_field: 25,
                           combobox_field: 3,
                           date_field: new Date(),
                           check: true,
                           radio: true,
                           check_field_group: [1, 2],
                           radio_field_group: 3,
                           tag_field: [2, 3, 5],
                           text_area_field: "Text Area Field +++",
                           display_field: "DF",
                           slider_field: 35
                       }}>
                <FormLayoutTitle text={"基本信息 - (属性模板关联SKU信息)"} iconType={IconTypes.boxOpen}/>
                <HiddenField/>
                <TextField name={"login_field"} fieldLabel={"Login Field"} placeholder={"user id"}/>
                <TextField name={"password"} type={"password"} fieldLabel={"Password"} placeholder={"password"}/>
                <NumberTextField name={"number_field"} fieldLabel={"Number Field"} placeholder={"password"}/>
                <ComboboxField name={"combobox_field"} fieldLabel={"Combobox Field"} data={comboItems}/>
                <ComboboxField name={"remote_combobox"} fieldLabel={"Remote Combobox"}
                               allowBlank={false}
                               store={new DataStore({api: "https://www.baidu.com"})}/>
                <FormLayoutTitle text={"其它信息 - (信息参数自定义)"} iconType={IconTypes.cog}/>
                <DateTimeField name={"date_field"} fieldLabel={"Date Field"} showTime={true}/>
                <FileUploadField name={"field_upload"} fieldLabel={"File Upload"}/>
                <CheckboxField name={"check"} fieldLabel={"Check Field"} text={"Check"}/>
                <RadioField name={"radio"} fieldLabel={"Radio Field"} text={"Radio"}/>
                <CheckboxGroupField name={"check_field_group"} fieldLabel={"Check Field Group"}
                                    models={[{value: 1, text: 'S1'}, {value: 2, text: 'S2'}, {value: 3, text: 'S3'}]}
                                    itemWidth={60}/>
                <RadioGroupField name={"radio_field_group"} fieldLabel={"Radio Field Group"}
                                 models={[{value: 1, text: 'S1'}, {value: 2, text: 'S2'}, {value: 3, text: 'S3'}]}
                                 itemWidth={60}/>
                <TagField name={"tag_field"} fieldLabel={"Tag Field"}
                          models={[{id: 1, text: 'S1'}, {id: 2, text: 'S2'}, {id: 3, text: 'S3'},
                              {id: 4, text: 'S4'}, {id: 5, text: 'S5'}]}/>
                <TextAreaField name={"text_area_field"} fieldLabel={"Text Area Field"}
                               placeholder={"Text Area Content..."}/>
                <DisplayField name={"display_field"} fieldLabel={"Display Field"}
                              emptyText={"Display Field <span style='color: #2b7fca'>Value</span>"}/>
                <SliderField name={"slider_field"} fieldLabel={"Slider Field"}/>

                <FormFieldSet legend={"Individual Checkboxes"}>
                    <TextField type={"password"} fieldLabel={"Password"} placeholder={"password"}
                               style={{width: "100%"}}/>
                </FormFieldSet>
            </FormPanel>
        );
    }
}
