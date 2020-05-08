import {types, transform} from "@babel/core";
import plugin from "../";

describe('babel-plugin-transform-ginkgo-jsx', () => {
    it('should contain text', () => {

        const {code} = transform('<div>234</div>', {plugins: [plugin]});
        console.log(code)
    })
});
