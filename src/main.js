import Directives from './directives.js';

import { 
    extend,
    forEach,
    map
} from './utils.js';

const prefix = 'v';
 


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
        this.$els = this.$el.querySelectorAll(getDirSelectors(Directives));
        
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
        forEach(this.$els, processNode);
        processNode(this.$el);

        /**
         * vm响应式数据的初始化
         */
        let _data = extend(this._opts.data, this._opts.methods);
        for (let key in this._bindings) {
            this[key] = _data[key];
        }

        function processNode (el) {
            getAttributes(el.attributes).forEach(function (attr) {
                let directive = parseDirective(attr);
                if (directive) {
                    bindDirective(self, el, self._bindings, directive);
                }
            });
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
 * 返回指令选择器，便于指令节点的查找
 */
function getDirSelectors (directives) {
    /**
     * 支持的事件指令
     */
    let eventArr = ['click', 'change', 'blur']; 


    return Object.keys(directives).map(function (directive) {
        /**
         * text => 'v-text'
         */
        return '[' + prefix + '-' + directive + ']';
    }).join() + ',' + eventArr.map(function (eventName) {
        return '[' + prefix + '-on-' + eventName + ']';
    }).join();
}

/**
 * 节点指令绑定
 */
function bindDirective (vm, el, bindings, directive) {
    //从节点属性中移除指令声明
    el.removeAttribute(directive.attr.value);
    
    /**
     * v-text='counter'
     * v-model='counter'
     * data = { 
            counter: 1 
        } 
     * 这里的 counter 即指令的 key
     */
    let key = directive.key,
        binding = bindings[key];

    if (!binding) {
        /**
         * value 即 counter 对应的值
         * directives 即 key 所绑定的相关指令
         如：
           bindings['counter'] = {
                value: 1,
                directives: [textDirective, modelDirective]
             }
         */
        bindings[key] = binding = {
            value: '',
            directives: []
        };
    }
    directive.el = el;
    binding.directives.push(directive);

    //避免重复定义
    if (!vm.hasOwnProperty(key)) {
        /**
         * get/set 操作绑定
         */
        bindAccessors(vm, key, binding);
    }
}

/**
 * get/set 绑定指令更新操作
 */
function bindAccessors (vm, key, binding) {
    Object.defineProperty(vm, key, {
        get: function () {
            return binding.value;
        },
        set: function (value) {
            binding.value = value;
            binding.directives.forEach(function (directive) {
                directive.update(
                    directive.el,
                    value,
                    directive.argument,
                    directive,
                    vm,
                    key
                );
            });
        }
    });
}

function parseDirective (attr) {
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
        ? {
            attr: attr,
            key: key,
            dirname: directiveName,
            definition: directiveDef,
            argument: arg,
            /**
             * 指令本身是一个函数的情况下，更新函数即它本身，否则调用它的update方法
             */
            update: typeof directiveDef === 'function'
                ? directiveDef
                : directiveDef.update
        }
        : null;
}












