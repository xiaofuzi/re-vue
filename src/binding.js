import { directiveParser } from './parser.js';
import { objectEach } from './utils.js';
import { observer } from './observer.js';
import {
    objectGet,
    objectSet,
    isObject,
    isFunc
} from './utils.js';

const def = Object.defineProperty;

export default class Binding {
    constructor (vm, key, isComputed=false) {
        this.vm = vm;
        this.key = key;
        this.isComputed = isComputed;

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
        this.defineReactive();
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
            isObj = isObject(objectGet(this.vm._dataCopy, this.key));
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
                    if (!isObj) {
                        self.value = value;
                        self.update(value);
                    } else {
                        for (let prop in value) {
                            self.value[prop] = value[prop];
                        } 
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
                console.warn('computed property is readonly.');
            }
        });
    }

    update (value) {
        this.directives.forEach(function (directive) {
            directive.update(value);
        });
    }

    refresh () {
        /**
         * notify parent
         */
        if (this.parent) {
            this.parent.refresh();
        }
        
        this.watch.call(this.vm, this.value, this.oldValue);
    }

    watch (newVal, oldValue) {

    }
}