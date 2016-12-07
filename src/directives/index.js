import vif from './v-if.js';
import vfor from './v-for.js';
/**
 * Directives
 */

export default {
    /**
     * 对应于 v-text 指令
     */
    text: function (value) {
        this.el.textContent = value === undefined ? '' : value;
    },
    /**
     * 对应于 v-model 指令
     */
    model: function (value) {
        let eventName = 'keyup',
            el = this.el,
            self = this;
        el.value = value || '';

        /**
         * 事件绑定控制
         */
        if (el.handlers && el.handlers[eventName]) {
            el.removeEventListener(eventName, el.handlers[eventName]);
        } else {
            el.handlers = {};
        }

        el.handlers[eventName] = function (e) {
            self[key] = e.target.value;
        };

        el.addEventListener(eventName, el.handlers[eventName]);
    },
    on: {
        update: function (handler) {
            let eventName = this.arg,
                el = this.el;

            if (!this.handlers) {
                this.handlers = {};
            }

            var handlers = this.handlers;

            if (handlers[eventName]) {
                //绑定新的事件前移除原绑定的事件函数
                el.removeEventListener(eventName, handlers[eventName]);
            }
            //绑定新的事件函数
            if (handler) {
                handler = handler.bind(this.vm);
                el.addEventListener(eventName, handler);
                handlers[eventName] = handler;
            }
        }
    },
    if: vif,
    for: vfor, 
    each: {
        update: function (arr) {

        }
    }
};