import { directiveParser } from './parser.js';
import { objectEach } from './utils.js';
import { observer } from './observer.js';
import {
    objectGet
} from './utils.js';

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
        this.defineReactive();
    }


    defineReactive () {
        let self = this;
        
        def(this.vm, this.key, {
            get () {
                return self.value;
            },
            set (value) {
                if (value !== self.value) {
                    self.value = value;
                    self.update(value);
                    observer.emit(self.key, value);
                }
            }
        });
    }

    update (value) {
        this.directives.forEach(function (directive) {
            directive.update(value);
        });
    }
}