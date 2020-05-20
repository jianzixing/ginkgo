import {InputComponent} from "./InputComponent";

export type DataType =
    { [key: string]: any }
    | Blob
    | BufferSource
    | FormData
    | URLSearchParams
    | ReadableStream<Uint8Array>
    | string
    | Document;

interface Response {
    statusCode?: number;
}

export interface HttpConfig {
    url?: string;
    method?: "GET" | "POST";
    data?: DataType;
    postQueryString?: boolean;
    withCredentials?: boolean;
    headers?: { [key: string]: string };
    timeout?: number;
}

function getValue2String(value: any) {
    if (value instanceof Array) {
        value = JSON.stringify(value);
    }
    if (typeof value == "object") {
        value = JSON.stringify(value);
    }
    return value;
}

export class GinkgoHttpRequest {

    public static get(url: string, data?: { [key: string]: any } | FormData, config?: HttpConfig) {
        config = config || {url: url};
        config.url = url;
        config.method = "GET";
        config.data = data;
        return this.ajax(config);
    }

    public static post(url: string, data?: DataType, config?: HttpConfig) {
        config = config || {url: url};
        config.url = url;
        config.method = "POST";
        config.data = data;

        let postQueryString = false;
        if (typeof data == "object") {
            postQueryString = true;
        }
        config.postQueryString = postQueryString;
        return this.ajax(config);
    }

    public static ajax(config?: HttpConfig): Promise<any> {
        return new Promise<any>((resolve, reject: (info: Response) => void) => {
            let http = new XMLHttpRequest();
            let url = config.url;
            if (config.withCredentials != null) http.withCredentials = config.withCredentials;
            if (config.headers) {
                for (let key in config.headers) {
                    http.setRequestHeader(key, config.headers[key]);
                }
            }
            if (config.timeout != null) http.timeout = config.timeout;
            http.onreadystatechange = function () {
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        resolve(http.responseText);
                    } else {
                        reject({statusCode: http.status});
                    }
                }
            };

            if (config.method == "GET") {
                if (typeof config.data == "object") {
                    let queryString = this.object2QueryString(config.data);
                    if (queryString) {
                        url = this.appendUrlQueryString(url, queryString);
                    }
                }

                http.open(config.method, url);
                http.send();
                return;
            } else if (config.method == "POST" && config.postQueryString) {
                let queryString;
                if (typeof config.data == "object") {
                    queryString = this.object2QueryString(config.data);
                }
                http.open(config.method, url);
                http.send(queryString);
                return;
            } else {
                http.open(config.method || "POST", url);
                if (config.data && typeof config.data == "object") {
                    http.send(JSON.stringify(config.data));
                } else {
                    if (config.data) {
                        http.send("" + config.data);
                    } else {
                        http.send();
                    }
                }
            }

        })
    }

    private static appendUrlQueryString(url: string, queryString: string): string {
        let us = url.split("?"), str;
        if (us.length > 0) {
            if (us.length > 1) {
                if (us[1] && us[1].length > 0 && us[1].substring(us[1].length - 1, us[1].length) == "&") {
                    str = us[1] + queryString;
                } else if (!us[1] || us[1] == "" || us[1].trim() == "") {
                    str = queryString;
                } else {
                    str = us[1] + "&" + queryString;
                }
            } else {
                str = queryString;
            }
            return str ? us[0] + "?" + str : us[0];
        }
    }

    public static object2QueryString(params: { [key: string]: any }) {
        if (params) {
            let str = [];
            for (let p in params) {
                let value = params[p];
                if (typeof value == "function") {
                    value = getValue2String(value());
                } else {
                    value = getValue2String(value);
                }
                str.push(p + "=" + value);
            }
            return str.join("&");
        }
        return null;
    }

    public static queryString2Object(url: string) {
        let v = url.split("&");
        let obj = {};
        for (let item of v) {
            let i = item.split("=");
            if (i.length > 1) {
                let value = i[1];
                if (value.substring(0, 1) == '[' && value.substring(value.length - 1, value.length) == ']') {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        console.warn(i[0] + " is not a array");
                    }
                }
                if (value.substring(0, 1) == '{' && value.substring(value.length - 1, value.length) == '}') {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        console.warn(i[0] + " is not a object");
                    }
                }
                obj[i[0]] = value;
            }
        }
        return obj;
    }
}
