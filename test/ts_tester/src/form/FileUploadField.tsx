import Ginkgo, {GinkgoNode, HTMLComponent, InputComponent, RefObject} from "../../carbon/Ginkgo";
import TextField, {TextFieldProps} from "./TextField";
import Button from "../button/Button";
import "./FileUploadField.scss";

export interface FileUploadFieldProps extends TextFieldProps {
    buttonText?: string;
    buttonIcon?: string;
    buttonIconType?: string;
    buttonIconAlign?: "left" | "right";
}

export class FileUploadField<P extends FileUploadFieldProps> extends TextField<P> {
    protected static fileUploadFieldRightCls;
    protected static fileUploadFieldInputCls;

    protected rightElRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected rightButtonRef: RefObject<Button<any>> = Ginkgo.createRef();
    protected fileInputRef: RefObject<InputComponent> = Ginkgo.createRef();

    protected readonly = true;
    protected value: FileList;

    protected buildClassNames(themePrefix: string): void {
        super.buildClassNames(themePrefix);

        FileUploadField.fileUploadFieldRightCls = this.getThemeClass("fileupload-right");
        FileUploadField.fileUploadFieldInputCls = this.getThemeClass("fileupload-input");
    }

    protected drawingFieldRight(): GinkgoNode {
        let text = this.props.buttonText;
        if (!this.props.buttonIcon && !this.props.buttonIconType
            && (!this.props.buttonText || this.props.buttonText.trim() == '')) {
            text = "Browse..."
        }
        return (
            <div ref={this.rightElRef}
                 className={FileUploadField.fileUploadFieldRightCls}>
                <Button ref={this.rightButtonRef}
                        text={text}
                        icon={this.props.buttonIcon}
                        iconType={this.props.buttonIconType}
                        onClick={this.onUploadButtonClick.bind(this)}/>
                <input ref={this.fileInputRef} type={"file"}
                       className={FileUploadField.fileUploadFieldInputCls}
                       onChange={this.onUploadFileChange.bind(this)}/>
            </div>
        )
    }

    protected onUploadButtonClick(e) {

    }

    protected onUploadFileChange(e) {
        let input = this.fileInputRef.instance.dom as HTMLInputElement;
        let fileList = input.files;
        this.value = fileList;
        if (fileList && fileList.length > 0) {
            let file = fileList[0];
            let name = file.name;
            let size = file.size;
            this.inputEl.value = name;
        }

        this.triggerOnChangeEvents(this, this.value);
    }

    setValue(value: string | FileList): void {
        if (typeof value === "string") {
            this.inputEl.value = value;
        }
        if (value instanceof FileList) {
            if (value && value.length > 0) {
                let file = value[0];
                let name = file.name;
                let size = file.size;
                this.inputEl.value = name;
            }
        }
    }

    getValue(): FileList {
        return this.value;
    }

    getRowValue(): FileList {
        return this.value;
    }

    protected onAfterDrawing() {
        super.onAfterDrawing();

        if (this.rightElRef && this.rightElRef.instance
            && this.rightButtonRef && this.rightButtonRef.instance) {
            let width = this.rightButtonRef.instance.getWidth();
            let el = this.rightElRef.instance.dom as HTMLElement;
            el.style.width = width + "px";
        }
    }
}
