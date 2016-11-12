/*******************************************************
 * 数组相关
 */
export function forEach (arr=[], cb) {
    [].forEach.call(arr, cb);
}

export function map (arr=[], cb) {
    return [].map.call(arr, cb);
}

/*******************************************************
 * 对象相关
 */

/**
 * 对象继承
 */
export function extend (child, parent) {
    parent = parent || {};
    child = child || {};

    for(var key in parent) {
        if (parent.hasOwnProperty(key)) {
            child[key] = parent[key];
        }
    }

    return child;
}