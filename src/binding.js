import { directiveParser } from './parser.js';
import { objectEach } from './utils.js';
import { observer, arrayObserver } from './observer.js';
import {
    objectGet,
    objectSet,
    isObject,
    isFunc
} from './utils.js';

const def = Object.defineProperty;

let bindingId = 0;

export default class Binding {
    constructor (vm, key, isComputed=false) {
        this.vm = vm;
        this.key = key;
        this.isComputed = isComputed;
        this.watches = [];

        this.directives = [];
        this.parent = null;
        this.children = [];

        /**
         * for computed property
         */
        this.watcher = null;
        /**
         * init 
         */
        /**
         * vm不存在的Binding可watch其它Binding从而触发更新
         */
        if (this.vm) {
            this.defineReactive();
        }

        this.id = bindingId++;
    }


    defineReactive () {
        if (this.isComputed) {
            this.defineComputedProperty();
            return ;
        }

        let self = this;
        let path = this.key.split('.');
        let len = path.length;

        let obj, key,
            currentBindingData = objectGet(this.vm._bindingData, this.key),
            isObj = isObject(currentBindingData),
            isArray = Array.isArray(currentBindingData);

        if (len === 1) {
            obj = this.vm;
            key = this.key;
            self.value = isObj ? objectGet(this.vm, key) : '';

        } else {
            let lastKey = path.splice(path.length - 1);
            obj = objectGet(this.vm, path.join('.'));
            key = lastKey[0];
    
            self.value = isObj ? objectGet(this.vm, key) : ''; 
        }

        def(obj, key, {
            get () {
                observer.isObserving && observer.emit('get', self);
                return self.value;
            },
            set (value) {
                if (value !== self.value) {
                    self.oldValue = self.value;
                    /**
                     * 考虑到原始类型与赋值类型的不同
                     */
                    if (typeof value === 'string') {
                        self.value = value;
                        self.update(value);
                    } else if (isArray) {
                        self.value = value;

                        arrayObserver(self.value, ()=>{
                            self.update();
                        });
                        self.update(self.value);
                    } else if (isObj) {
                        for (let prop in value) {
                            self.value[prop] = value[prop];
                        } 
                    } else {
                        self.value = value;
                        self.update(value);
                    }
                    observer.emit(self.key, self);
                    self.refresh();
                }
            }
        });
    }

    defineComputedProperty () {
        let key = this.key,
            obj = this.vm,
            self = this;

        def(obj, key, {
            get () {
                let getter = self.vm._opts.computed[key];
                if (isFunc(getter)) {
                    self.value = getter.call(self.vm);

                    return self.value;
                }
            },
            set () {
                //console.warn('computed property is readonly.');
            }
        });
    }

    update (value=null) {
        if (value === null) {
            value = this.value;
        }

        let self = this;
        this.directives.forEach(function (directive) {
            /**
             * 计算属性绑定对应于多个不同key的指令，所以值需要动态获取
             */
            if (self.isComputed) {
                directive.update(objectGet(self.vm, directive.key));
            } else {
                directive.update(value);
            }
        });

        this._updateChildren();
    }

    refresh () {
        if (this.isComputed) {
            this.update(this.vm[this.key]);
        }
        /**
         * notify parent
         */
        if (this.parent) {
            this.parent.refresh();
        }
        
        this.watches.forEach((cb)=>{
            cb.call(this.vm, this.value, this.oldValue);
        });
    }

    add (childBinding) {
        this.children.push(childBinding);
        childBinding.parent = this;
        childBinding.value = this.value;
    }

    appendTo (parentBinding) {
        parentBinding.children.push(this);
        this.parent = parentBinding;
        this.value = parentBinding.value;
    }

    remove (childBinding) {
        this.children = this.children.filter((child)=>{
            return child.id != childBinding.id;
        })
    }

    destroy () {
        this.parent.remove(this);
        this.parent = null;
    }

    _updateChildren () {
        this.children.forEach((child)=>{
            child.update(this.value);
        });
    }
}