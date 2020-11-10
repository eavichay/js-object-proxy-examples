function NoUndefinedObservableInternal(reusePathMap = new WeakMap(), rootPath = '', o = {}) {
    const pathMap = reusePathMap;

    if (!pathMap.has(o)) {
        pathMap.set(o, rootPath);
    }

    return new Proxy(o, {
        set: (target, p, value) => {
            if (typeof value === 'object' && value !== null) {
                const resolved = NoUndefinedObservableInternal(reusePathMap, rootPath + '.' + p, value);
                target[p] = resolved;
            } else {
                target[p] = value;
            }
            const path = pathMap.get(target);
            if (path) {
                console.log('Change: ', path + '.' + p);
            }
        },
        get: (target, p) => {
            // V8 Issue - JSON stringify fails on proxies with no "toJSON" value
            if (p === 'toJSON') {
                return target;
            } else if (typeof target[p] === 'undefined') {
                const nested =  NoUndefinedObservableInternal(reusePathMap, rootPath + '.' + p, {});
                target[p] = nested;
            }
            return target[p];
        },
        deleteProperty: (target, p) => {
            delete target[p];
            const path = pathMap.get(target);
            if (path) {
                console.log('Delete: ', path + '.' + p);
            }
        }
    });
}

function NoUndefinedObservable() {
    const map = new WeakMap();
    return NoUndefinedObservableInternal(map, '[root]');
}


if (require.main === module) {
    const v = NoUndefinedObservable();
    
    v.a = 'hello';
    v.b = {
        c: 4
    };
    v.b.d = 5;
    delete v.b.d;
} else {
    module.exports = NoUndefinedObservable;
}

