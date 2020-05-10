import Ginkgo, {GinkgoComponent} from "../../carbon/Ginkgo";

export interface StoreProcessor {
    storeBeforeLoad?(): void;

    storeLoaded(data: Object | Array<Object>, total?: number, originData?: any): void;

    storeAfterLoad?(): void;
}

export interface DataStoreProps {
    // 是否自动加载
    autoLoad?: boolean;
    type?: "ajax" | "storage";
    api: string;
    method?: "post" | "get",
    dataType?: "json";
    params?: any,

    // 是否需要使用dataField获取数据中的数据 true 不需要 false 需要
    root?: boolean;
    totalField?: string;
    dataField?: string;
}

export default class DataStore {
    private readonly props: DataStoreProps;
    protected processor: Array<StoreProcessor>;
    protected data: any;

    protected pagingParam: Object;

    protected status = 0;

    constructor(props: DataStoreProps) {
        this.props = {
            autoLoad: false,
            type: "ajax",
            method: "get",
            dataType: "json",
            root: false,
            totalField: "total",
            dataField: "records",
            ...props
        };

        if (this.props.autoLoad) {
            setTimeout(() => {
                this.load();
            }, 100);
        }
    }

    setPagingParam(pagingParam: Object): void {
        this.pagingParam = pagingParam;
    }

    addProcessor(processor: StoreProcessor): void {
        if (!this.processor) this.processor = [];
        if (this.processor.indexOf(processor) == -1) {
            this.processor.push(processor);
            if (this.data) {
                if (this.props.dataType == "json") {
                    this.setStoreJsonData(processor, this.data);
                }
            }
            let rms;
            for (let p of this.processor) {
                if (Ginkgo.getComponentStatus(p as any) == null) {
                    if (!rms) rms = [];
                    rms.push(p);
                }
            }
            if (rms) {
                for (let rm of rms) {
                    this.processor.splice(this.processor.indexOf(rm), 1);
                }
            }
        }
    }

    removeProcessor(processor: StoreProcessor): void {
        if (this.processor) {
            this.processor = this.processor.filter(value => value != processor);
        }
    }

    load(): void {
        if (this.props.type == "ajax") {
            let params = {...(this.props.params || {}), ...(this.pagingParam || {})};
            if (this.props.api) {
                this.processor && this.processor.map(value => {
                    value && value.storeBeforeLoad && value.storeBeforeLoad()
                });
                this.status = 1;
                if (this.props.method == "post") {
                    Ginkgo.post(this.props.api, params)
                        .then(value => {
                            this.status = 0;
                            this.setStoreData(value);
                            this.processor && this.processor.map(value => {
                                value && value.storeAfterLoad && value.storeAfterLoad()
                            });
                        })
                        .catch(reason => {
                            this.status = 0;
                            this.setStoreData(null, reason);
                            this.processor && this.processor.map(value => {
                                value && value.storeAfterLoad && value.storeAfterLoad()
                            });
                        });
                } else {
                    Ginkgo.get(this.props.api, params)
                        .then(value => {
                            this.status = 0;
                            this.setStoreData(value);
                            this.processor && this.processor.map(value => {
                                value && value.storeAfterLoad && value.storeAfterLoad()
                            });
                        })
                        .catch(reason => {
                            this.status = 0;
                            this.setStoreData(null, reason);
                            this.processor && this.processor.map(value => {
                                value && value.storeAfterLoad && value.storeAfterLoad()
                            });
                        });
                }
            } else {
                console.error("miss api config");
            }
        }
        if (this.props.type == "storage" && this.props.api) {
            this.processor && this.processor.map(value => {
                value && value.storeBeforeLoad && value.storeBeforeLoad()
            });
            let value = localStorage.getItem(this.props.api);
            this.setStoreData(value);
            this.processor && this.processor.map(value => {
                value && value.storeAfterLoad && value.storeAfterLoad()
            });
        }
    }

    private setStoreData(value: any, error?: any): void {
        if (value) {
            if (this.props.dataType == "json") {
                let data = value;
                if (typeof value == "string") {
                    data = JSON.parse(value);
                }
                this.data = data;
                this.setAllStoreJsonData(this.data);
            }
        } else {
            this.setAllStoreJsonData(null, error);
        }
    }

    private setAllStoreJsonData(data: Object, error?: any): void {
        if (this.processor) {
            for (let p of this.processor) {
                this.setStoreJsonData(p, data, error);
            }
        }
    }

    private setStoreJsonData(processor: StoreProcessor, data: Object, error?: any): void {
        if (this.props.root) {
            processor && processor.storeLoaded(data, null, data);
        } else {
            if (data) {
                let dt = data[this.props.dataField];
                let ct = data[this.props.totalField];
                processor && processor.storeLoaded(dt, ct, data);
            } else {
                processor && processor.storeLoaded(null, 0, data);
            }
        }
    }
}
