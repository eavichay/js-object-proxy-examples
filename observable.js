function ObservableInternal(reusePathMap = new WeakMap(), rootPath = '', o = {}) {
    const pathMap = reusePathMap;

    if (!pathMap.has(o)) {
        pathMap.set(o, rootPath);
    }

    return new Proxy(o, {
        set: (target, p, value) => {
            if (typeof value === 'object' && value !== null) {
                const resolved = ObservableInternal(reusePathMap, rootPath + '.' + p, value);
                target[p] = resolved;
            } else {
                target[p] = value;
            }
            const path = pathMap.get(target);
            if (path) {
                console.log('Change: ', path + '.' + p);
            }
        }
    });
}

function Observable() {
    const map = new WeakMap();
    return ObservableInternal(map, '[root]');
}


if (require.main === module) {
    const v = Observable();
    
    v.a = 'hello';
    v.b = {
        c: 4
    };
    v.b.d = 5;
} else {
    module.exports = Observable;
}

