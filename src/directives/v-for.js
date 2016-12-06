import Vm from '../main.js';

/**
 * v-for directive
 */
export default {
    /**
     * 单独进行编译
     */
    isBlock: true,  
    bind () {
        this.parent = this.el.parentNode;
        this.startRef = document.createComment('Start of v-for-directive');
        this.container = document.createElement('div');
        this.endRef = document.createComment('End of v-for-directive');

        let next = this.el.nextSibling;
        if (next) {
            this.parent.insertBefore(this.startRef, next);
            this.parent.insertBefore(this.container, next);
            this.parent.insertBefore(this.endRef, next);
        } else {
            this.parent.appendChild(this.startRef);
            this.parent.appendChild(this.container);
            this.parent.appendChild(this.endRef);
        }

        this.parent.removeChild(this.el);
        /**
         * vfor vm instance
         */
        this.$vm = new Vm({
            el: this.container
        }); 
        this.$vm.appendTo(this.vm);
        console.log('this.$vm: ', this.$vm);
        this.$childElements = [];
    },
    update (arr=[]) {
        arr.forEach((item, index)=>{
            this.createChildInstance(item, index);
        });
    },
    createChildInstance (item, index) {
        let vm, node = this.el.cloneNode(true);

        this.container.appendChild(node);
        vm = new Vm({
            el: node,
            //data: item
        }, this.$vm);
        vm.__proto__ = this.$vm;

        vm.$parent = this.$vm;
        this.$vm.$children[index] = vm;
        vm.$index = this.$vm.$children.length - 1;

        console.log('vfor item: ', vm);
        this.$childElements[index] = node;
    }
}