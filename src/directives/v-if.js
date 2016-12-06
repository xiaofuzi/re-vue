import Vm from '../main.js';

/**
 * if directive
 */
export default {
    isBlock: true,
    bind () {
        this.parent = this.el.parentNode;
        this.startRef = document.createComment('Start of v-if-directive');
        this.ref = document.createComment('End of v-if-directive');

        let next = this.el.nextSibling;
        if (next) {
            this.parent.insertBefore(this.startRef, next);
            this.parent.insertBefore(this.ref, next);
        } else {
            this.parent.appendChild(this.startRef);
            this.parent.appendChild(this.ref);
        }
    },
    update (value) {
        if (value) {
            this.createDirectiveInstance();
        } else {
            this.parent.removeChild(this.el);
            this.childVm&&this.childVm.remove();
        }
    },
    createDirectiveInstance () {
        if (this.childVm) {
            this.childVm = null;
        }

        let node = this.el,
            parentVm = this.vm;
        this.parent.insertBefore(node, this.ref);

        let childVm = new Vm({
            el: node
        }, this.vm);
        /**
         * 给 if 指令新建一个vm实例，该实例与父实例共享同一个上下文
         */
        childVm.__proto__ = parentVm;
        childVm.appendTo(parentVm);
        console.log('childVm: ', childVm);
        this.childVm = childVm;
    }
};