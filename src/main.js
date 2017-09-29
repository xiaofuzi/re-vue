import Binding from './binding.js';
import Watcher from './watcher.js';
import { DirectiveParser } from './parser.js';
import { observer } from './observer.js';
import ComponentParser from './component.js';

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
    objectSet,
    defer,
    toCamels,
    toLineStr
} from './utils.js';


/**
 * Main class
 */
let vmId = 0;
export default class Main {
    constructor (opts={}, parent) {
        /**
         * this.$el:  根节点
         * _bindings: 指令与data关联的桥梁
         */
        this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
        this.$parent = parent;
        this.$children = [];
        this.$components = [];
        this.$id = vmId++;
        this.$name = opts.name || 'vm';
        this.$isComponent = opts.isComponent || false;
        /**
         * @private
         */

        /**
         * data opt process
         */
        if (isFunc(opts.data)) {
            opts.data = opts.data();
        }

        this._bindings = {};
        this._opts = opts;
        this._bindingData = {};

        this.beforeCompiler();
        this.init();

        this.ready();
    }

    static components = {}

    /**
     * 初始化函数
     */
    init () {
        let self = this;

        /**
         * components 数据挂载
         */
        this.components = this._opts.components;

        let _data = this._bindingData = extend(this._opts.data, this._opts.methods, true);
        objectEach(_data, (path, item) => {
            this._initReactive(path, item);
        });

        this._initComputed ();

        this._initProps();
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
         * props 初始化
         */
        objectEach(this.$props, (key, item)=>{
            this[key] = item;
        });

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
        objectEach(obj, (path, item)=>{
            this._initReactive(path, item);
        });
    }

    $destroy () {
        this.remove();
        forEach(this._bindings, (binding)=>{
            binding.destroy();
        });
        this.$parent = null;
        this.$el.parentNode.removeChild(this.$el);
    }

    /**
     * 生命周期函数
     */
    beforeCompiler () {
        if (this._opts.beforeCompiler && typeof this._opts.beforeCompiler === 'function') {
            this._opts.beforeCompiler.call(this);
        }
    }

    ready () {
        if (this._opts.ready && typeof this._opts.ready === 'function') {
            this._opts.ready.call(this);
        }
    }

    /**
     * @private
     */
    /**
     * viewModel树形结构
     */
    appendTo (vm) {
        this.$parent = vm;
        vm.$children.push(this);
    }

    remove () {
        this.$parent.$children = this.$parent.$children.filter((child)=>{
            return child.$id != this.$id;
        })
    }

    /**
     * 组件树结构
     */
    addComponent (component) {
        this.$components.push(component);
        component.$parent = this;
    }

    _initProps () {
        /**
         * props process
         */
        let propsData = ComponentParser.propsProcess(this._opts, this);
        if (propsData) {
            this.$reactive(propsData);

            this.$props = propsData;
        }
    }

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
        let isCompiler = true;

        /**
         * 子组件处理
         */
        let nodeName = el.nodeName.toLowerCase(),
            component = getComponent(this, toCamels(nodeName));

        if (!component) {
            component = getComponent(this, nodeName);
        }

        if (component) {
            this._compilerComponent(el, component);

            return ;
        }

        /**
         * 过滤注释节点
         */

        if (el.nodeType === 8) {
            return ;
        }

        if (el.nodeType === 3) {
            self._compileTextNode(el);
        } else if (el.attributes && el.attributes.length) {
            getAttributes(el.attributes).forEach(function (attr) {
                let directive = DirectiveParser.parse(attr.name, attr.value);

                if (directive) {
                    if (DirectiveParser.directives[directive.name].isBlock) {
                        isCompiler = false;
                    }

                    directive.vm = self;
                    self._bind(el, directive);
                }
            });
        }

        let len = el.childNodes.length;
        if (isCompiler&&len) {
            el.index = 0;
            for (; el.index < el.childNodes.length; el.index++) {
                /**
                 * el.index 表示当前第几个子元素,在_compileNode函数中可能会更改el的子元素结构，
                 * 所以需要el.index来标识编译的节点索引
                 */
                let child = el.childNodes[el.index];
                self._compileNode(child);
            }
        }
    }

    _compileTextNode (el) {
        return el;
    }

    _compilerComponent (el, componentOpts) {
        ComponentParser.compilerComponent(el, componentOpts, this);
    }

    /**
     * bind directive
     */
    _bind (el, directive) {
        let self = this,
            isParentVm = false;
        el.removeAttribute(prefix + '-' + directive.name);
        directive.el = el;
        let key = directive.key,
            binding = this._getBinding(this, key);

        processBinding(key);
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
            binding = this._getBinding(this, computedKey);
            processBinding(computedKey);
            if (binding.isComputed) {
                binding.directives.push(directive);
            } else {
                console.error(key + ' is not defined in ' + this.$name + ' component.');
            }
        } else {
            binding.directives.push(directive);
        }

        /**
         * 子 vm bingding时更新DOM
         */
        if (isParentVm) {
            binding.update();
        }

        function processBinding (key) {
            /**
             * 根据model值是否在当前viewModel从而做不同的处理
             */
            if (binding === true) {
                binding = self._bindings[key];
            } else if (isObject(binding)) {
                isParentVm = true;
                let parentBinding = binding.binding;
                binding = self._createBinding(key);
                binding.appendTo(parentBinding);
            }
        }
    }

    _createBinding (key, ctx) {
        this._bindings[key] = new Binding(ctx||this, key);
        return this._bindings[key];
    }

    /**
     * init reactive data
     */
    _initReactive (path, value) {
        let binding;
        if (this._bindings[path]) {
            console.warn(path + ' binding had created.');
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

    /**
     * vm binding 获取，支持继承
    */
    _getBinding (vm, key) {
        if (this._bindings[key]) {
            return true;
        } else if (this.$isComponent) {
            /**
             * 父子组件vm隔离
             */
            return false;
        }

        if (!vm) {
            return false;
        }

        let binding = vm._bindings[key];
        if (binding) {
            return {
                binding: binding,
                vm: vm,
                key: key
            }
        } else {
            return this._getBinding(vm.$parent, key);
        }
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

/**
 * 获取 component 辅助函数
 * vm嵌套情况，组件声明存储于更vm实例
 */
function getComponent (vm, componentName) {
    let components = getComponents(vm);

    if (components) {
        return components[componentName] || Main.components[componentName];

    } else {
        return Main.components[componentName];
    }
}

function getComponents (vm) {
    /**
     * 子组件与父组件式隔离作用域的，所以不会获取父组件的vm
     */
    if (vm.$isComponent) {
        return vm.components;
    }
    if (vm.$parent) {
        return getComponents(vm.$parent);
    } else {
        return vm.components;
    }
}














