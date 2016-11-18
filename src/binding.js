import { directiveParser } from './parser.js';
import { objectEach } from './utils.js';

const def = Object.defineProperty;

export default class Binding {
    constructor (vm, key) {
        this.vm = vm;
        this.key = key;

        this.directives = [];

        /**
         * init 
         */
        let path = key.split('.');
        this.defineRective(vm, path);
    }


    defineRective (obj, path) {
        let self = this,
        key = path[0];

        if (path.length === 1) {
            def(obj, key, {
                get () {
                    return self.value;
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

                def(obj, key, {
                    get () {
                        return subObj;
                    },
                    set (value) {
                        objectEach(value, (key)=>{
                            subObj[key] = value[key];
                        });
                    }
                });
            }
            self.defineRective(subObj, path.slice(1));
        }
    }

    update (value) {
        this.directives.forEach(function (directive) {
            directive.update(value);
        });
    }
}