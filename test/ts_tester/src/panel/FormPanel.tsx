import Ginkgo, {GinkgoElement, GinkgoNode, RefObject} from "../../carbon/Ginkgo";
import Panel, {PanelProps} from "./Panel";
import FormLayout, {FormLayoutProps} from "../layout/FormLayout";
import {AbstractFormField, AbstractFormFieldProps} from "../form/AbstractFormField";
import Button, {ButtonProps} from "../button/Button";

export interface FormPanelProps extends PanelProps {
    layout?: FormLayoutProps;
    values?: { [key: string]: any };
    formValues?: { [key: string]: any };
    onSubmit?: (values: { [key: string]: any }, formData?: FormData) => void;
}

export default class FormPanel<P extends FormPanelProps> extends Panel<P> {
    protected formLayoutRef: RefObject<FormLayout> = Ginkgo.createRef();
    protected formValues = this.props.formValues || {};

    constructor(props: P) {
        super(props);
        this.onFormFieldsChange = this.onFormFieldsChange.bind(this);
        this.onFormSubmitClick = this.onFormSubmitClick.bind(this);
    }

    protected drawing(): GinkgoElement | undefined | null {
        return super.drawing();
    }

    protected drawingPanelChild(): GinkgoNode | GinkgoElement[] {
        return (
            <FormLayout {...this.props.layout || {}}
                        ref={this.formLayoutRef}>
                {this.props.children}
            </FormLayout>
        );
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();

        if (this.formLayoutRef && this.formLayoutRef.instance) {
            Ginkgo.forEachContent(component => {
                if (component instanceof AbstractFormField) {
                    component.addOnChange(this.onFormFieldsChange);
                }
            }, this.formLayoutRef.instance);

            Ginkgo.forEachContent(component => {
                if (component instanceof Button) {
                    let props = component.props as ButtonProps;
                    if (props.type == "submit") {
                        component.setTypeEvent(this.onFormSubmitClick);
                    }
                }
            }, this.wrapperEl);
        }

        if (this.props.values) {
            this.setValues(this.props.values);
        }
    }

    protected lockScroll(): boolean {
        return true;
    }

    protected onFormFieldsChange(field: AbstractFormField<AbstractFormFieldProps>, value: any, oldValue: any) {
        if (this.formValues && field.props && field.props.name) {
            (this.formValues as any)[field.props.name] = value;
        }
    }

    protected onFormSubmitClick(e) {
        this.validate();
        if (this.props.onSubmit) {
            this.props.onSubmit(this.getValues(), this.getFormData());
        }
    }

    getValues(): any {
        return this.formValues;
    }

    getFormData(): FormData {
        let formData = new FormData();
        if (this.formValues) {
            for (let key in this.formValues) {
                formData.append(key, this.formValues[key]);
            }
        }
        return formData;
    }

    validate(): boolean {
        let isValid = true;
        Ginkgo.forEachContent(component => {
            if (component instanceof AbstractFormField) {
                let validate = component.validate();
                if (!validate) {
                    isValid = false;
                    return false;
                }
            }
        }, this);

        return isValid;
    }

    setValues(values: any): void {
        Ginkgo.forEachContent(component => {
            if (component instanceof AbstractFormField) {
                let name = component.getFieldName();
                if (name) {
                    let value = values[name];
                    component.setValue(value);

                    let cv = component.getValue();
                    let cn = component.getFieldName();
                    if (cn) {
                        (this.formValues as any)[cn] = cv;
                    }
                }
            }
        }, this);
    }
}


