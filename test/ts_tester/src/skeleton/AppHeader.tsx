import Ginkgo, {GinkgoNode, HTMLComponent, RefObject} from "../../carbon/Ginkgo";
import Icon from "../icon/Icon";
import {IconTypes} from "../icon/IconTypes";
import "./AppHeader.scss";
import Tooltip, {TooltipManager} from "../tooltips/Tooltip";
import Component, {ComponentProps} from "../component/Component";
import MessageBox from "../window/MessageBox";
import {WindowPanel} from "../window/Window";
import FormPanel from "../panel/FormPanel";
import TextField from "../form/TextField";
import Toolbar, {ToolbarSplit} from "../toolbar/Toolbar";
import Button from "../button/Button";

export interface AppHeaderProps extends ComponentProps {

}

export default class AppHeader extends Component<AppHeaderProps> {
    protected headerMessageRef: RefObject<HTMLComponent> = Ginkgo.createRef();
    protected tooltipManager: TooltipManager;
    protected closeTooltipHandler;

    drawing(): GinkgoNode {
        return (
            <div className={"app-header-toolbars"}>
                <div ref={this.headerMessageRef}
                     className={["app-header-toolbar-item", "light"]}
                     onMouseEnter={this.onMessageEnter.bind(this)}
                     onMouseLeave={this.onMessageLeave.bind(this)}
                     style={{fontSize: 22}}>
                    <Icon icon={IconTypes.envelope}/>
                </div>
                <div className={["app-header-toolbar-item"]}
                     onClick={this.onUpdatePasswordClick.bind(this)}>
                    <Icon icon={IconTypes.key}/>
                </div>
                <div className={["app-header-toolbar-item"]}>
                    <Icon icon={IconTypes.cog}/>
                </div>
                <div className={["app-header-toolbar-item"]}
                     onClick={this.onLoginOutClick.bind(this)}>
                    <Icon icon={IconTypes.powerOff}/>
                </div>
                <div className={"app-header-toolbar-end"}>
                    <span>您好，Super管理员</span>
                    <img src={""}/>
                </div>
            </div>
        );
    }

    protected onMessageEnter(e) {
        if (this.headerMessageRef.instance) {
            if (this.tooltipManager) {
                this.tooltipManager.close();
            }
            this.tooltipManager = Tooltip.show(
                <Tooltip className={"app-header-tooltips"}
                         indicator={true}
                         onMouseEnter={e => {
                             if (this.closeTooltipHandler) {
                                 clearTimeout(this.closeTooltipHandler);
                                 this.closeTooltipHandler = undefined;
                             }
                         }}
                         onMouseLeave={this.onMessageLeave.bind(this)}>
                    <div className={"app-header-message"}>
                        <div className={"app-header-message-title"}>
                            <span>站内消息通知</span>
                            <div className={"app-header-message-close"}
                                 onClick={e => {
                                     if (this.tooltipManager) {
                                         this.tooltipManager.close();
                                         this.tooltipManager = null;
                                     }
                                 }}>
                                <Icon icon={IconTypes.times}/>
                            </div>
                        </div>
                        <div className={"app-header-message-content"}>
                            <div className={"app-empty"}>
                                <Icon icon={IconTypes.boxOpen}/>
                                <span>暂时没有消息通知！</span>
                            </div>
                        </div>
                    </div>
                </Tooltip>,
                this.headerMessageRef.instance)
        }
    }

    protected onMessageLeave(e) {
        if (this.tooltipManager) {
            if (this.closeTooltipHandler) {
                clearTimeout(this.closeTooltipHandler);
                this.closeTooltipHandler = undefined;
            }
            this.closeTooltipHandler = setTimeout(() => {
                this.tooltipManager.close();
                this.tooltipManager = null;
            }, 300);
        }
    }

    protected onUpdatePasswordClick(e) {
        WindowPanel.open(
            <WindowPanel width={380} height={240}
                         title={"修改密码"}
                         titleIconType={IconTypes.key}>
                <FormPanel
                    toolbars={[
                        <Toolbar align={"bottom"}>
                            <ToolbarSplit type={"align"}/>
                            <Button type={"submit"} iconType={IconTypes.save} iconColor={"#5fa2dd"} text={"确定修改"}/>
                            <Button type={"close"} iconType={IconTypes.times} iconColor={"#dd5f5f"} text={"取消关闭"}/>
                            <ToolbarSplit type={"align"}/>
                        </Toolbar>
                    ]}
                    onSubmit={(values, formData) => {
                        console.log(values);
                    }}>
                    <TextField name={"oldPassword"} allowBlank={false} type={"password"} fieldLabel={"旧密码"}/>
                    <TextField name={"password"} allowBlank={false} type={"password"} fieldLabel={"新密码"}/>
                    <TextField name={"repeatPassword"} allowBlank={false} type={"password"} fieldLabel={"重复新密码"}/>
                </FormPanel>
            </WindowPanel>)
    }

    protected onLoginOutClick(e) {
        MessageBox.show(<MessageBox type={"confirm"}
                                    title={"退出登录"}
                                    content={"确定退出登录吗？"}
                                    onOkClick={(e1, value) => {
                                        console.log(value)
                                    }}/>);
    }

    protected getRootClassName(): string[] {
        let arr = super.getRootClassName();
        arr.push("app-header");
        return arr;
    }
}
