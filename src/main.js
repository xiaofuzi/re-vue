import Binding from './binding.js';
import { DirectiveParser } from './parser.js';

import Config from './config.js';
const { prefix } = Config;

import { 
    extend,
    forEach,
    map
} from './utils.js';


/**
 * TinyVue 
 */
export default class TinyVue {
    constructor (opts={}) {
        /**
         * this.$el:  根节点
         * _bindings: 指令与data关联的桥梁
         */
        this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
        
        /**
         * @private
         */
        this._bindings = {};
        this._opts = opts;

        this.init();

        this.ready();
    }

    /**
     * 初始化函数
     */
    init () {
        let self = this;
        /**
         * 指令处理
         */
        this._compileNode(this.$el);

        /**
         * vm响应式数据的初始化
         */
        let _data = extend(this._opts.data, this._opts.methods);
        for (let key in this._bindings) {
            this.$set(key, _data.$get(key));
        }
    }

    /**
     * 生命周期函数
     */
    ready () {
        if (this._opts.ready && typeof this._opts.ready == 'function') {
            this._opts.ready.call(this);
        }
    }

    /**
     * @private
     */
    _compileNode (el) {
        let self = this;

        if (el.nodeType === 3) {
            self._compileTextNode(el);
        } else if (el.attributes && el.attributes.length) {
            getAttributes(el.attributes).forEach(function (attr) {
                let directive = DirectiveParser.parse(attr.name, attr.value);
                if (directive) {
                    self._bind(el, directive);
                }
            });
        }

        if (el.childNodes.length) {
            forEach(el.childNodes, function (child) {
                self._compileNode(child);
            });
        }
    }

    _compileTextNode (el) {
        return el;
    }

    /**
     * bind directive
     */
    _bind (el, directive) {
        el.removeAttribute(prefix + '-' + directive.name);
        directive.el = el;

        let key = directive.key,
            binding = this._bindings[key] || this._createBinding(key);

        binding.directives.push(directive);
    } 

    _createBinding (key) {
        this._bindings[key] = new Binding(this, key);
        return this._bindings[key];
    }
}

/**************************************************************
 * @privete
 * helper methods
 */

/**
 * 获取节点属性
 * 'v-text'='counter' => {name: v-text, value: 'counter'}
 */
function getAttributes (attributes) {
    return map(attributes, function (attr) {
        return {
            name: attr.name,
            value: attr.value
        };
    });
}














