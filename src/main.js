import ViewModel from './viewModel.js';

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
        this.$el = document.getElementById(opts.el);
        
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
    _compileNode (el) {
        let self = this;

        if (el.nodeType === 3) {
            self._compileTextNode(el);
        } else if (el.attributes && el.attributes.length) {
            getAttributes(el.attributes).forEach(function (attr) {
                let vm = ViewModel.parse(attr.name, attr.value);
                if (vm) {
                    self._bind(el, vm);
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
    _bind (el, vm) {
        el.removeAttribute(prefix + '-' + vm.directiveName);
        vm.el = el;

        let key = vm.key,
            binding = this._bindings[key] || this._createBinding(key);

        binding.directives.push(vm);
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














