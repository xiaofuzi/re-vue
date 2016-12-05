import Binding from './binding.js';
import Watcher from './watcher.js';
import { DirectiveParser } from './parser.js';
import { observer } from './observer.js';

import Config from './config.js';
const { prefix } = Config;

import { 
    extend,
    forEach,
    map,
    objectEach,
    objectMap,
    isObject,
    isFunc,
    objectGet,
    objectSet
} from './utils.js';


/**
 * Main class 
 */
export default class Main {
    constructor (opts={}) {
        /**
         * this.$el:  根节点
         * _bindings: 指令与data关联的桥梁
         */
        this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
        this.$parent = null;
        this.$children = [];

        /**
         * @private
         */
        this._bindings = {};
        this._opts = opts;
        this._bindingData = {};

        this.beforeCompiler();
        this.init();

        this.ready();
    }

    /**
     * 初始化函数
     */
    init () {
        let self = this;
        let _data = this._bindingData = extend(this._opts.data, this._opts.methods, true);
        objectEach(_data, (path, item)=>{
            this._initReactive(path, item);
        });

        this._initComputed ();

        /**
         * 指令处理
         */
        this._compileNode(this.$el);

        /**
         * vm响应式数据的初始化
         */
        for (let key in this._bindings) {
            this.$set(key, objectGet(_data, key));                
        }

        /**
         * watch 函数注册
         */
        let _watches = this._opts.watch || {};
        objectEach(_watches, (key, cb)=>{
            if (this._bindings[key]) {
                this.$watch(key, cb);
            }
        });
    }

    //public api
    $watch (key, cb) {
        let _binding = this._bindings[key];
        _binding.watches.push(cb);
    }

    /**
     * turn an normal object to reactive obeject
     */
    $reactive (obj={}) {
        objectEach(_data, (path, item)=>{
            this._initReactive(path, item);
        });
    }

    /**
     * 生命周期函数
     */
    beforeCompiler () {
        if (this._opts.beforeCompiler && typeof this._opts.beforeCompiler == 'function') {
            this._opts.beforeCompiler.call(this);
        }
    }
     
    ready () {
        if (this._opts.ready && typeof this._opts.ready == 'function') {
            this._opts.ready.call(this);
        }
    }

    /**
     * @private
     */
    _initComputed () {
        /**
         * computed 属性预处理
         */
        let _computed = this._opts.computed || {},
            self = this;

        for (let key in _computed) {
            let computedGetter = _computed[key];
            if (!isFunc(computedGetter)) {
                continue;
            }
            let binding;
            if (this._bindings[key]) {
                console.warn('Can not redefine ' + key + ' property.');
            } else {
                let isComputed = true;
                binding = new Binding(this, key, isComputed);
                this._bindings[key] = binding;
            }

            /**
             * 计算属性依赖监测
             */
            let watcher = new Watcher(binding);
            observer.isObserving = true;
            watcher.getDeps();
            computedGetter.call(this);
            observer.isObserving = false;
            watcher.watch();

            /**
             * 初始化,等待值初始化完毕后在获取计算computed的值
             */
            setTimeout(()=>{
                binding.update(binding.value);
            }, 0);
        }
    }

    _compileNode (el) {
        let self = this;

        if (el.nodeType === 3) {
            self._compileTextNode(el);
        } else if (el.attributes && el.attributes.length) {
            getAttributes(el.attributes).forEach(function (attr) {
                let directive = DirectiveParser.parse(attr.name, attr.value);
                if (directive) {
                    directive.vm = self;
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
            binding = this._bindings[key];

        /**
         * directive hook
         */
        if (directive.bind) {
            directive.bind();
        }

        if (!binding) {
            /**
             * computed property binding hack
             * 针对计算属性子属性
             */

            //get computed property key
            let computedKey = key.split('.')[0];
            binding = this._bindings[computedKey];
            if (binding.isComputed) {
                binding.directives.push(directive);
            } else {
                console.error(key + ' is not defined.');
            }
        } 
        
        binding.directives.push(directive);
    } 

    _createBinding (key) {
        this._bindings[key] = new Binding(this, key);
        return this._bindings[key];
    }

    /**
     * init reactive data
     */
    _initReactive (path, value) {
        let binding;
        if (this._bindings[path]) {
            return ;
        }

        if (isObject(value)) {
            binding = this._createBinding(path);

            let bindings = objectMap(value, (key, item)=>{            
                let childBinding = this._initReactive(`${path}.${key}`, item);
                childBinding.parent = binding;
                return childBinding;
            });    
            binding.children = bindings;
        } else {
            binding = this._createBinding(path);
        }

        return binding;
    }

    $get (path) {
        return objectGet(this, path);
    }

    $set (path, value) {
        return objectSet(this, path, value);
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














