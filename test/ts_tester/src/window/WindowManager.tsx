import {WindowPanel} from "./Window";

export default class WindowManager {
    private static windows: Array<{ win: WindowPanel<any>, zIndex: number }> = [];
    private static containers: Array<{ dom: HTMLElement, windows: Array<WindowPanel<any>> }> = [];
    private static masks: Array<{ dom: HTMLElement, mask: HTMLElement }> = [];

    addWindow(win: WindowPanel<any>) {
        if (win instanceof WindowPanel) {
            WindowManager.windows.push({win: win, zIndex: 0});

            let parent = win.getParentElement();
            if (parent) {
                let cnts = WindowManager.containers.filter(value => value.dom === parent);
                let cnt;
                if (cnts && cnts.length > 0) {
                    cnt = cnts[0];
                    let wins = cnt.windows;
                    if (!wins) wins = [];
                    wins.push(win);
                    cnt.windows = wins;
                } else {
                    cnt = {dom: parent, windows: [win]};
                    WindowManager.containers.push(cnt);
                }

                if (win.isMask()) {
                    let maskArr = WindowManager.masks.filter(value => value.dom === parent);
                    let mask;
                    if (!maskArr || maskArr.length == 0) {
                        mask = {};
                        mask.dom = parent;
                        mask.mask = document.createElement("div");
                        parent.append(mask.mask);
                        WindowManager.masks.push(mask);
                    } else {
                        mask = maskArr[0];
                    }

                    mask.mask.className = win.getMaskClassNames();
                    mask.mask.style.display = "none";
                }
            }

            console.log("添加窗口: ", WindowManager.containers.length, WindowManager.windows.length);
        }
    }

    activeWindow(win: WindowPanel<any>) {
        if (win instanceof WindowPanel) {
            WindowManager.windows.sort((a, b) => b.zIndex - a.zIndex);
            let index = 1000 + WindowManager.windows.length + 1;

            WindowManager.windows.map(value => {
                if (value.win == win) {
                    win.setZIndex(index);
                    value.zIndex = index;
                    index--;

                    if (win.isMask()) {
                        let parent = win.getParentElement();
                        let maskArr = WindowManager.masks.filter(value => value.dom === parent);
                        if (maskArr && maskArr.length > 0) {
                            maskArr[0].mask.style.display = "block";
                            maskArr[0].mask.style.zIndex = index + "";
                        }
                    }
                    index--;
                }
            });

            WindowManager.windows.map(value => {
                if (value.win != win) {
                    value.win.setZIndex(index);
                    value.zIndex = index;
                    index--;
                }
            });


        }
    }

    removeWindow(win: WindowPanel<any>) {
        if (win instanceof WindowPanel) {
            WindowManager.windows = WindowManager.windows.filter(value => value.win != win);
            let parent = win.getParentElement();
            if (parent) {
                let cnts = WindowManager.containers.filter(value => value.dom === parent);
                if (cnts && cnts.length > 0) {
                    let wins = cnts[0].windows;
                    if (wins) {
                        wins = wins.filter(value => value != win);
                        cnts[0].windows = wins;
                        if (!wins || wins.length == 0) {
                            this.removeMasks(cnts, parent);
                        }
                    } else {
                        this.removeMasks(cnts, parent);
                    }
                }
            }
            console.log("移除窗口: ", WindowManager.containers.length, WindowManager.windows.length);
        }
    }

    removeMasks(cnts: Array<{ dom: HTMLElement, windows: Array<WindowPanel<any>> }>, parent) {
        WindowManager.containers = WindowManager.containers.filter(value => value != cnts[0]);

        let i = 0;
        for (let mask of [...WindowManager.masks]) {
            let pp = mask.dom;
            if (pp == parent) {
                pp.removeChild(mask.mask);
                WindowManager.masks.splice(i, 1);
            }
            i++;
        }
    }
}
