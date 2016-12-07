import Directives from '../directives/index.js';

import Config from '../config.js';
const { prefix } = Config;

export default class DirectiveParser {
    constructor (directiveName, arg, expression) {
        /**
         * v-on:click="onChange"
           directiveName = 'v-on:click'
           expression = 'onChange'
         */

        this.key = expression.trim();
        this.name = directiveName;
        this.arg = arg;

        let directive = Directives[directiveName];

        if (typeof directive === 'function') {
            this.update = directive;
        } else {
            for (let prop in directive) {
                if (prop === 'update') {
                    this.update = directive.update;
                }
                this[prop] = directive[prop];
            }
        }

        /**
         * directive expression process
         */
        if (this.name == 'for') {
            this.rawKey = this.key;
            let keyArray = this.rawKey.split(' ');

            if (keyArray.length != 3) {
                console.log('Invalid expression of v-for');
            }
            this.key = keyArray[2];
            this.subKey = keyArray[0];
        }
    }


    static parse (directiveName, expression) {
        if (directiveName.indexOf(prefix + '-') === -1) { 
            return null; 
        }

        /**
         * 指令解析
           v-on:click='onClick'
           这里的指令名称为 'on', 'click'为指令的参数，onClick 为key
         */

        //移除 'v-' 前缀, 提取指令名称、指令参数
        let directiveInfo = directiveName.slice(prefix.length + 1).split(':');
            directiveName = directiveInfo[0];
        let directiveArg = directiveInfo[1] ? directiveInfo[1] : null;
        let directive = Directives[directiveName];
            

        /**
         * 指令校验
         */
        if (!directive) {
            console.warn('unknown directive: ' + directiveName);
        }

        return directive
            ? new DirectiveParser(directiveName, directiveArg, expression)
            : null;
    }

    static directives = Directives
};
