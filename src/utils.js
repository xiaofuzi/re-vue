/**
 * type
 */
const toString = Object.prototype.toString;
export function typeOf (obj) {
    return toString.call(obj).slice(8, -1);
}

export function isObject (obj) {
    return typeOf(obj) === 'Object' ? true : false;
}

export function isFunc (obj) {
    return typeOf(obj) === 'Function' ? true : false;
}

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
export function extend (child, parent, isNew=false) {
    parent = parent || {};
    child = child || {};

    if (isNew) {
        let ret = {};
        objectEach(child, (key, value)=>{
            ret[key] = value;
        });

        objectEach(parent, (key, value)=>{
            ret[key] = value;
        });

        return ret;
    } else {
        objectEach(parent, (key, value)=>{
            child[key] = value;
        });
        return child;
    }
}

/**
 * 对象遍历
 */
export function objectEach (obj={}, cb=()=>{}) {
    Object.keys(obj).forEach(function (key) {
        cb(key, obj[key]);
    });
}

export function objectMap (obj={}, cb=()=>{}) {
    return Object.keys(obj).map(function (key) {
        return cb(key, obj[key]);
    });
}

/**
 * Object extend
 */
export function objectGet (obj, path='') {
    path = path.split('.');
    
    if (obj[path[0]] == undefined) {
        obj[path[0]] =  {};
    }

    if (path.length == 1) {
        return obj[path[0]];
    } else {
        return objectGet(obj[path[0]], path.slice(1).join('.'));
    }
};

export function objectSet (obj, path='', value) {
    path = path.split('.');
    if (path.length == 1) {
        obj[path[0]] = value;
    } else {
        obj[path[0]] = obj[path[0]] || {};
        objectSet(obj[path[0]], path.slice(1).join('.'), value);
    }
};

export function defer (fn, Timer=0) {
    setTimeout(()=>{
        fn();
    }, Timer);
}