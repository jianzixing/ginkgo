import {GinkgoComponent, GinkgoContainer} from "./Ginkgo";
import {ContextLink} from "./GinkgoContainer";

export class QuerySelector {
    private component: GinkgoComponent;
    private condition: Array<{ module: {}, class: {}, attr: {} }>;
    private matches: Array<ContextLink> = [];

    constructor(component: GinkgoComponent, condition: Array<any>) {
        this.component = component;
        if (condition && condition.length > 0) {
            this.condition = [];
            for (let c of condition) {
                this.condition.push(this.parseCondition(c));
            }
        }
    }

    selector(): Array<GinkgoComponent> {
        if (this.condition && this.condition.length > 0) {
            let link = GinkgoContainer.getLinkByComponent(this.component);
            let content = link.content;
            if (content) {
                this.matchForEach(content, 0);
            }
            let arr = [];
            this.matches.map(value => arr.push(value.component));
            return arr;
        }
        return [];
    }

    private matchForEach(link: ContextLink, index: number) {
        if (this.isMatch(link, this.condition[index])) {
            if (index == this.condition.length - 1) {
                this.matches.push(link);
            } else {
                let children = link.children;
                if (children) {
                    for (let c of children) {
                        index++;
                        this.matchForEach(c, index);
                    }
                }
            }
        } else {
            let children = link.children;
            if (children) {
                for (let c of children) {
                    this.matchForEach(c, index);
                }
            }
        }
    }

    private isMatch(link: ContextLink, cnd: { module: {}, class: {}, attr: {} }): boolean {
        let props = link.props as any;
        let c1 = 0, c2 = 0;
        if (cnd.module) {
            c1++;
            if ((cnd.module as any).name == props.module) {
                c2++;
            } else {
                return false;
            }
        }
        if (cnd.class instanceof Array && cnd.class && cnd.class.length > 0) {
            c1++;
            let propsCls = props.className;
            if (typeof propsCls == "function") {
                propsCls = propsCls();
            }
            if (typeof propsCls == "string") {
                propsCls = propsCls.split(" ");
            }
            for (let cls of cnd.class) {
                let eq = true;
                if (cls.list && cls.list.length > 0) {
                    for (let c of cls.list) {
                        let is = false;
                        for (let oc of propsCls) {
                            if (c.trim() == oc.trim()) {
                                is = true;
                                break;
                            }
                        }
                        if (!is) {
                            eq = false;
                            break;
                        }
                    }
                }
                if (eq) {
                    c2++;
                    break;
                }
            }
        }
        if (cnd.attr instanceof Array && cnd.attr && cnd.attr.length > 0) {
            c1++;
            let is = true;
            for (let item of cnd.attr) {
                if (props[item.key] != item.value) {
                    is = false;
                }
            }
            if (is) {
                c2++;
            }
        }
        if (c1 == c2) return true;
        return false;
    }

    private parseCondition(cnd: any): { module: {}, class: {}, attr: {} } {
        let cs: any = [];
        let conditionObjects: any = {};
        if (cnd instanceof Array) {
            let i = 0;
            let first = cnd[i];
            for (let k = 1; k < cnd.length; k++) {
                if (!(typeof cnd[k] == "string")) {
                    throw new Error("selector by array must typeof string except first item.");
                }
            }
            if (typeof first == "string") {
                let str = cnd.join("");
                cs = this.parseConditionStr(str);
            } else {
                cs.push({type: 0, object: first});
                let arr1 = cnd.filter((value, index) => index != 0);
                let arr2 = this.parseConditionStr(arr1.join(""));
                arr2.map(value => cs.push(value));
            }
        } else if (typeof cnd == "string") {
            cs = this.parseConditionStr(cnd);
        }

        if (cs && cs.length > 0) {
            for (let c of cs) {
                if (c.type == 0) {
                    if (!conditionObjects["module"]) conditionObjects["module"] = {};
                    if (c.name) {
                        conditionObjects["module"]["name"] = c.object;
                        conditionObjects["module"]["type"] = 0;
                    }
                    if (c.object) {
                        conditionObjects["module"]["name"] = c.object;
                        conditionObjects["module"]["type"] = 1;
                    }
                }
                if (c.type == 1) {
                    if (!conditionObjects["class"]) conditionObjects["class"] = [];
                    let classNames = conditionObjects["class"];
                    for (let cn of classNames) {
                        if (cn.group == c.group) {
                            if (!cn.list) cn.list = [];
                            cn.list.push(c.name);
                        }
                    }
                }
                if (c.type == 2) {
                    if (!conditionObjects["attr"]) conditionObjects["attr"] = [];
                    conditionObjects["attr"].push({key: c.key, value: c.value});
                }
            }
        }
        return conditionObjects;
    }

    private parseConditionStr(str: string) {
        let cs = [];
        let last = "";
        let area = 0; // 0元素名称 1CSS样式名称 2属性值
        let start = 0;
        for (let i = 0; i < str.length; i++) {
            let char = str.charAt(i);
            if (char == ".") {
                if (area == 0) {
                    cs.push({type: 0, group: 0, name: last});
                    area = 1;
                }
                if (area == 1) {
                    cs.push({type: 1, group: 0, name: last});
                }
                if (area == 2 && start == 1) {
                    last += char;
                } else {
                    last = "";
                }
            } else if (char == "[") {
                start = 1;
                if (area == 0) {
                    cs.push({type: 0, name: last});
                }
                if (area == 1) {
                    cs.push({type: 1, name: last});
                }
                cs.push({type: 2, key: undefined, value: undefined});
                area = 2;
            } else if (char == "]") {
                if (area == 2) {
                    if ((last.startsWith("\"") && last.endsWith("\""))
                        || (last.startsWith("\'") && last.endsWith("\'"))) {
                        cs[cs.length - 1].value = "" + last;
                    } else {
                        if (last.indexOf(".") >= 0) {
                            cs[cs.length - 1].value = parseFloat("" + last);
                        } else {
                            cs[cs.length - 1].value = parseInt("" + last);
                        }
                        if (isNaN(cs[cs.length - 1].value)) {
                            throw new Error("attr value " + last + " is not a number,if miss \" or not.");
                        }
                    }
                }
                start = 0;
            } else if (char == "=") {
                if (area == 2) {
                    cs[cs.length - 1].key = last;
                }
                last = "";
            } else {
                last += char;
            }
        }
        return cs;
    }
}
