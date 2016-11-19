import { directiveParser } from './parser.js';
import { objectEach } from './utils.js';
import { observer } from './observer.js';

const def = Object.defineProperty;

export default class Binding {
    constructor (vm, key, isComputed=false) {
        this.vm = vm;
        this.key = key;
        this.isComputed = isComputed;

        this.directives = [];
        /**
         * init 
         */
        let path = key.split('.');
        this.defineReactive(vm, path);
    }


    defineReactive (obj, path) {
        let self = this,
        key = path[0];

        if (path.length === 1) {
            def(obj, key, {
                get () {
                    if (self.isComputed) {
                        return self.vm._opts.computed[key].call(self.vm);
                    } else {
                        if (observer.isObserving) {
                            observer.emit('get', self);
                        }
                        return self.value;
                    }
                },
                set (value) {
                    if (value !== self.value) {
                        self.value = value;
                        self.update(value);
                    }
                }
            });
        } else {
            let subObj = obj[key];
            if (!subObj) {
                 subObj = {};
            }
            self.defineReactive(subObj, path.slice(1));
        }
    }

    update (value) {
        this.directives.forEach(function (directive) {
            directive.update(value);
        });
    }
}