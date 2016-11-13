import Directives from './directives/index.js';

const prefix = 'v';

class Directive {
    constructor (def, attr, arg, key) {
        this.attr = attr;
        this.arg = arg;
        this.key = key;

        if (typeof def === 'function') {
            this._update = def;
        } else {
            for (let prop in def) {
                if (prop === 'update') {
                    this._update = def.update;
                    continue;
                }
                this[prop] = def[prop];
            }
        }
    }

    update (val) {
        this._update(val);
    }
}

export default {
    parse (attr) {
        if (attr.name.indexOf(prefix) === -1) { 
            return ; 
        }

        /**
         * 指令解析
           v-on-click='onClick'
           这里的指令名称为 'on', 'click'为指令的参数，onClick 为key
         */

        //移除 'v-' 前缀, 提取指令名称、指令参数
        let directiveStr = attr.name.slice(prefix.length + 1),
            argIndex = directiveStr.indexOf('-'),
            directiveName = argIndex === -1
                ? directiveStr
                : directiveStr.slice(0, argIndex),
            directiveDef = Directives[directiveName],
            arg = argIndex === -1
                ? null
                : directiveStr.slice(argIndex + 1);

        /**
         * 指令表达式解析，即 v-text='counter' counter的解析
         * 这里暂时只考虑包含key的情况
         */
        let key = attr.value;
        return directiveDef
            ? new Directive(directiveDef, attr, arg, key)
            : null;
    },
    /**
     * 返回指令选择器，便于指令节点的查找
     */
    selectors () {
        /**
         * 支持的事件指令
         */
        let eventArr = ['click', 'change', 'blur']; 


        return Object.keys(Directives).map(function (directive) {
            /**
             * text => 'v-text'
             */
            return '[' + prefix + '-' + directive + ']';
        }).join() + ',' + eventArr.map(function (eventName) {
            return '[' + prefix + '-on-' + eventName + ']';
        }).join();
    }
};