import Event from './event.js';

let observer = new Event();

/**
 * Array observer
 */
let arrProto = Array.prototype,
    mutationMethods = [
        'pop',
        'push',
        'reverse',
        'shift',
        'unshift',
        'splice',
        'sort'
    ];

function arrayObserver(arr, cb) {
    mutationMethods.forEach(function (method) {
        arr[method] = function (...rest) {
            arrProto[method].apply(this, rest);

            cb&&cb({
                event: method,
                args: rest,
                array: arr
            });
        };
    });
}

export {
    observer,
    arrayObserver
};
