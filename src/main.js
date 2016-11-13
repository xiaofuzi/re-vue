import Directive from './directive.js';

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
         * this.$els: 指令节点
         * _bindings: 指令与data关联的桥梁
         */
        this.$el = document.getElementById(opts.el);
        this.$els = this.$el.querySelectorAll(Directive.selectors());
        
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
        forEach(this.$els, this._compile.bind(this));
        this._compile(this.$el);

        /**
         * vm响应式数据的初始化
         */
        let _data = extend(this._opts.data, this._opts.methods);
        for (let key in this._bindings) {
            this[key] = _data[key];
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
    _compile (el) {
        let self = this;
        getAttributes(el.attributes).forEach(function (attr) {
            let directive = Directive.parse(attr);
            if (directive) {
                self._bind(el, directive);
            }
        });
    }

    /**
     * bind directive
     */
    _bind (el, directive) {
        el.removeAttribute(directive.attr.name);
        directive.el = el;

        let key = directive.key,
            binding = this._bindings[key] || this._createBinding(key);

        binding.directives.push(directive);
    } 

    _createBinding (key) {
        let binding = {
            value: '',
            directives: []
        };

        this._bindings[key] = binding;

        Object.defineProperty(this, key, {
            get: function () {
                return binding.value;
            },
            set: function (value) {
                binding.value = value;
                binding.directives.forEach(function (directive) {
                    directive.update(
                        value
                    );
                });
            }
        });

        return binding;
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














