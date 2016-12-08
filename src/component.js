import Vm from './main.js';
import {
    map,
    extend,
    objectEach,
    toLineStr
} from './utils.js';

export default {
    compilerComponent (el, component, vm) {
        let parent = el.parentNode,
            container = document.createElement('div'),
            next = el.nextSibling,
            startRef = document.createComment('Start of v-component'),
            endRef = document.createComment('End of v-component'),
            componentInstance;

        if (next) {
            parent.insertBefore(startRef, next);
            parent.insertBefore(endRef, next);
        } else {
            parent.appendChild(startRef);
            parent.appendChild(endRef);
        }

        /**
         * store el
         */
        this.el = el.cloneNode(true);
        parent.removeChild(el);
        parent.insertBefore(container, endRef);

        /**
         * 父节点遍历标识更新
         */
        parent.index += 2;

        container.innerHTML = component.template;
        component.el = container;

        let componentName = toLineStr(el.nodeName.toLowerCase());
        component.name = componentName;
        component.isComponent = true;

        componentInstance = new Vm(component, vm);

        vm.addComponent(componentInstance);
    },
    propsProcess (opts={}, vm) {
        if (!vm.$parent&&opts.props) {
            console.warn('Can not set props for root component.');
        }
        if (opts.props) {
            /**
             * 数组声明形式
             */
            let props = {},
                processProps = {},
                el = this.el;
            if (Array.isArray(opts.props)) {
                opts.props.forEach((prop)=>{
                    props[prop] = {
                        required: false,
                        defaultValue: ''
                    };
                })

            } else {
                /**
                 * 对象声明形式
                 */
                props = opts.props;
            }

            map(el.attributes, (attribute)=>{
                /**
                 * 静态props处理
                 */
                let name = attribute.name,
                    value = attribute.value;

                if (props[name]) {
                    processProps[name] = value;
                } else {
                    /**
                     * 动态props
                     */
                    let attr = '';
                    if (name[0] === ':') {
                        attr = name.substring(1);
                        if (props[attr]) {
                            processProps[attr] = vm.$parent[value];

                            /**
                             * watch change
                             */
                            vm.$parent.$watch(value, ()=>{
                                vm[attr] = vm.$parent[value];
                            });
                        }
                    }
                }
            });

            vm.$props = processProps;

            return processProps;
        }
    }
}