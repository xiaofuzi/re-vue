import Main from './src/main.js';
import Directives from './src/directives/index.js';

export default class TinyVue extends Main {
    constructor (opts) {
        super(opts);
    }

    /**
     * 自定义指令
     */
    static $directive (name, fn) {
        if (!fn) {
            return Directives[name];
        } else {
            Directives[name] = fn;
        }
    }
}

window.TinyVue = TinyVue;