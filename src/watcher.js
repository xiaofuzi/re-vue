import { observer } from './observer.js';

/**
 * watcher a key
 */

export default class Watcher {
    constructor (binding) {
        this.binding = binding;

        this.dependencies = [];
        this.dependents = [];
    }

    getDeps () {
        observer.on('get', (dep)=>{
            this.dependencies.push(dep);
        });

        this.value = this.binding.value;
        observer.off('get');
    }

    watch () {
        observer.isObserving = true;
        this.getDeps();
        observer.isObserving = false;
    }
}