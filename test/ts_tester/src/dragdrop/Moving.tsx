import Ginkgo, {CSSProperties, HTMLComponent} from "../../carbon/Ginkgo";
import Component, {ComponentProps} from "../component/Component";

export interface MovingPoint {
    startX: number;
    startY: number;
    moveX: number;
    moveY: number;
    x?: number;
    y?: number;
    originalX?: number;
    originalY?: number;
    moving: Moving<any>;
    component?: HTMLComponent;
    event?: any;
}

export interface MovingProps extends ComponentProps {
    movingClassName?: string;
    movingSelf?: boolean;
    fixX?: boolean;
    fixY?: boolean;
    data?: any;
    onStartMoving?: (point: MovingPoint, data?: any) => void;
    onFinishMoving?: (point: MovingPoint, data?: any) => void;
    onMoving?: (point: MovingPoint, data?: any) => boolean | any;
    onClick?: (e: Event) => void;
}


export default class Moving<P extends MovingProps> extends Component<P> {
    private disabled = false;
    private cursor = "";
    private startX: number = 0;
    private startY: number = 0;
    private moveX: number = 0;
    private moveY: number = 0;

    private originalX: number = 0;
    private originalY: number = 0;


    constructor(props: P) {
        super(props);

        this.onSelfMouseMove = this.onSelfMouseMove.bind(this);
        this.onSelfMouseUp = this.onSelfMouseUp.bind(this);
    }

    componentWillUnmount(): void {
        super.componentWillUnmount();

        document.removeEventListener("mousemove", this.onSelfMouseMove);
        document.removeEventListener("mouseup", this.onSelfMouseUp);
    }

    getRootEl(): HTMLComponent {
        return this.rootEl;
    }

    protected onMouseDown(e: MouseEvent) {
        super.onMouseDown(e);

        let dom = this.rootEl.dom as HTMLElement;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.originalX = dom ? dom.offsetLeft : 0;
        this.originalY = dom ? dom.offsetTop : 0;

        if (!this.disabled) {
            if (this.props.movingClassName && dom) {
                let className = dom.className;
                className = className.replace(/\s{2,}/g, ' ');
                let arr = className.split(" ");
                if (arr.indexOf(this.props.movingClassName) < 0) {
                    arr.push(this.props.movingClassName);
                }
                dom.className = arr.join(" ");
            }

            document.addEventListener("mousemove", this.onSelfMouseMove, false);
            document.addEventListener("mouseup", this.onSelfMouseUp, false);
            if (this.props.onStartMoving) {
                this.props.onStartMoving({
                    startX: this.startX,
                    startY: this.startY,
                    moveX: 0,
                    moveY: 0,
                    originalX: this.originalX,
                    originalY: this.originalY,
                    moving: this,
                    component: this.rootEl,
                    event: e
                }, this.props.data);
            }
        }
    }

    private onSelfMouseMove(e: any) {
        let moveX = e.clientX, moveY = e.clientY,
            x = this.startX - moveX, y = this.startY - moveY;


        if (this.props.onMoving) {
            let pos = {
                startX: this.startX, startY: this.startY,
                moveX, moveY, x, y,
                originalX: this.originalX,
                originalY: this.originalY,
                component: this.rootEl,
                moving: this,
                event: e
            };
            let r = this.props.onMoving(pos, this.props.data);
            if (r != false) {
                this.moveX = moveX;
                this.moveY = moveY;
                this.moveElXY(x, y);
            }
        } else {
            this.moveX = moveX;
            this.moveY = moveY;
            this.moveElXY(x, y);
        }
    }

    moveElXY(x: number, y: number) {
        if (this.props.movingSelf == true) {
            if (this.props.fixX == true) {
                this.setY(this.originalY - y);
            } else if (this.props.fixY == true) {
                this.setX(this.originalX - x);
            } else {
                this.setXY(this.originalX - x, this.originalY - y);
            }
        }
    }

    private onSelfMouseUp(e: any) {
        document.removeEventListener("mousemove", this.onSelfMouseMove);
        document.removeEventListener("mouseup", this.onSelfMouseUp);

        let dom = this.rootEl.dom as HTMLElement;
        if (this.props.movingClassName && dom) {
            let className = dom.className;
            className = className.replace(/\s{2,}/g, ' ');
            let arr = className.split(" ");
            if (arr.indexOf(this.props.movingClassName) >= 0) {
                arr.splice(arr.indexOf(this.props.movingClassName), 1);
            }
            dom.className = arr.join(" ");
        }

        if (this.props.onFinishMoving) {
            this.props.onFinishMoving({
                startX: this.startX, startY: this.startY,
                moveX: this.moveX, moveY: this.moveY,
                x: this.startX - this.moveX, y: this.startY - this.moveY,
                originalX: this.originalX,
                originalY: this.originalY,
                component: this.rootEl,
                moving: this,
                event: e
            }, this.props.data);
        }

        this.startX = 0;
        this.startY = 0;
        this.moveX = 0;
        this.moveY = 0;
    }

    public disableMoving(resetCursor: boolean = true) {
        this.disabled = true;
        if (resetCursor) {
            this.cursor = "default";
            this.rootEl.reloadStyle();
        }
    }

    public enableMoving(resetCursor: boolean = true) {
        this.disabled = false;
        if (resetCursor) {
            this.cursor = "";
            this.rootEl.reloadStyle();
        }
    }

    protected getRootStyle(): CSSProperties {
        let style = super.getRootStyle();
        style.cursor = this.cursor;
        return style;
    }
}
