import {ContextLink, GinkgoContainer} from "./GinkgoContainer";
import {BindComponent, FragmentComponent, GinkgoElement, HTMLComponent, TextComponent} from "./Ginkgo";
import {BindComponentElement, callBindRender} from "./BindComponent";

export class GinkgoDifferentNodes {
    insertWork: (parent: ContextLink,
                 element: GinkgoElement,
                 previousSibling: ContextLink) => ContextLink;
    moveWork: (parent: ContextLink, current: ContextLink, previousSibling: ContextLink) => void;
    compareWork: (parent: ContextLink, current: ContextLink, newNode: GinkgoElement) => void;
    removeWork: (parent: ContextLink, current: ContextLink) => void;

    public compare(parent: ContextLink, elements: GinkgoElement[]) {
        let isContent = this.isComponentContent(parent);
        let component = parent.component;
        if (isContent && component != null) {
            let el = component.render ? component.render() : undefined;
            if (component instanceof BindComponent && parent.props && (parent.props as any).render) {
                el = callBindRender(parent.props as BindComponentElement);
            }
            if (el && typeof el != "string") {
                elements = [el];
            }
        }
        let children = isContent ? (parent.content ? [parent.content] : []) : parent.children;
        children = children || [];
        this.compareSibling(parent, children, elements);
        if (children && children.length > 0) {
            for (let ch of children) {
                // ch.props 是上一次对比后的新的props
                // 所以也包含需要对比的新的子元素列表
                let props = ch.props;
                if (typeof props !== "string") {
                    this.compare(ch, props.children);
                }
            }
        }
        if (isContent) {
            parent.content = children[0];
        } else {
            parent.children = children;
        }

        component.componentReceiveProps && component.componentReceiveProps(parent.props, {
            oldProps: {},
            type: parent.status == "new" ? "new" : "mounted"
        });
        component.componentDidMount && component.componentDidMount();
        parent.status = "mount";
    }

    private isComponentContent(link: ContextLink) {
        let component = link.component;
        if (!(component instanceof HTMLComponent)
            && !(component instanceof TextComponent)
            && !GinkgoContainer.isBaseType(link.props)
            && !(component instanceof FragmentComponent)
            && !(component instanceof BindComponent)) {
            return true;
        }
        return false;
    }

    private compareSibling(parent: ContextLink,
                           treeNodes: Array<ContextLink>,
                           newNodes: Array<GinkgoElement>) {
        if (newNodes == null) {
            if (treeNodes != null) {
                for (let treeNode of treeNodes) {
                    this.removeTreeNodes(parent, treeNodes, treeNode);
                }
            }
        } else {
            let lastIndex = 0;
            for (let newNode of newNodes) {
                let index = this.elementIndexTreeNodes(treeNodes, newNode);
                if (index >= 0) {
                    let treeNode = treeNodes[index];
                    // 需要排除新建的组件
                    this.compareComponent(parent, treeNode, newNode);
                    if (index < lastIndex) {
                        // 将treeNode移动到treeNodes的lastIndex位置，lastIndex之前的元素前移
                        this.moveTreeNodes(parent, treeNodes, index, lastIndex);
                    }
                    lastIndex = index > lastIndex ? index : lastIndex;
                } else {
                    // 在 treeNodes 中，创建 newNode 并将 newNode 插入到 lastIndex 位置后，相应元素后移一位
                    this.insertTreeNodes(parent, treeNodes, lastIndex, newNode);
                    lastIndex = lastIndex + 1;
                }
            }

            let copyTreeNodes = [...treeNodes];
            for (let treeNode of copyTreeNodes) {
                let index = this.checkTreeNodeRemove(newNodes, treeNode);
                if (index == -1) {
                    // 在 treeNodes 中，删除 treeNode
                    // this.removeTreeNodes(parent, treeNodes, treeNode);
                }
            }
        }
    }

    private elementIndexTreeNodes(treeNodes: Array<ContextLink>, element: GinkgoElement) {
        for (let i = 0; i < treeNodes.length; i++) {
            if (treeNodes[i]
                && element.key
                && treeNodes[i].props
                && treeNodes[i].props['key'] === element.key) {
                return i;
            }
        }
        return -1
    }

    private checkTreeNodeRemove(newNodes: Array<GinkgoElement>, link: ContextLink) {
        if (link.status == "new") {
            return 0;
        }
        for (let i = 0; i < newNodes.length; i++) {
            if (link
                && link.props
                && newNodes[i].key
                && link.props['key'] === newNodes[i].key) {
                return i;
            }
        }
        return -1;
    }


    private moveTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, index, lastIndex) {
        let obj = treeNodes[index];
        for (let i = index; i < lastIndex; i++) {
            treeNodes[i] = treeNodes[i + 1];
        }
        treeNodes[lastIndex] = obj;
        if (this.moveWork) {
            let previousSibling = lastIndex > 0 ? treeNodes[lastIndex - 1] : undefined;
            this.moveWork(parent, obj, previousSibling);
        }
    }

    private insertTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, lastIndex, element: GinkgoElement) {
        let newNode;
        if (this.insertWork) {
            let previousSibling = treeNodes && treeNodes.length > 0 ? treeNodes[treeNodes.length - 1] : undefined;
            newNode = this.insertWork(parent, element, previousSibling);
        }
        treeNodes.splice(lastIndex + 1, 0, newNode);
    }

    private removeTreeNodes(parent: ContextLink, treeNodes: Array<ContextLink>, treeNode: ContextLink) {
        treeNodes.splice(treeNodes.indexOf(treeNode), 1);
        if (this.removeWork) {
            this.removeWork(parent, treeNode);
        }
    }

    protected compareComponent(parent: ContextLink, treeNode: ContextLink, newNode: GinkgoElement) {
        if (this.compareWork) {
            this.compareWork(parent, treeNode, newNode);
        }
    }
}
