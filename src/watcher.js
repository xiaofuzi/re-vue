import { observer } from './observer.js';

/**
 * watcher a key
 */

export default class Watcher {
    constructor (binding) {
        binding.watcher = this;

        this.binding = binding;
        this.dependencies = [];
    }

    getDeps () {
        observer.on('get', (dep)=>{
            this.dependencies.push(dep);
        });
    }

    off () {
        observer.off('get');
    }

    watch () {
        let self = this;
        this.dependencies.forEach((dep)=>{
            observer.on(dep.key, ()=>{
                self.binding.refresh();
            });
        });
    }
}