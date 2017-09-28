import Event from './event.js';

let observer = new Event();

/**
 * Array observer
 */
let arrProto = Array.prototype;
let arrayMethods = Object.create(arrProto);
const mutationMethods = [
    'pop',
    'push',
    'reverse',
    'shift',
    'unshift',
    'splice',
    'sort'
];

function arrayObserver (arr, cb) {
    mutationMethods.forEach(function (method) {
        // 原生的数组方法
        let originalMethod = arrProto[method];

        arrayMethods[method] = function () {
            originalMethod.apply(this, arguments);

            cb && cb({
                event: method,
                args: arguments,
                array: arr
            });
        };
    });
    arr.__proto__ = arrayMethods;
}

export {
    observer,
    arrayObserver
};
