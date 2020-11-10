class Emitter {
    constructor() { this._eventMap = {};}
    _getEventMap(name) {
        if (!this._eventMap[name]) { this._eventMap[name] = new Set(); }
        return this._eventMap[name];
    }
    on(eventName, callback) { this._getEventMap(eventName).add(callback); return () => this.off(eventName, callback); }
    off(eventName, callback) { this._getEventMap(eventName).delete(callback); }
    emit(eventName, payload) { this._getEventMap(eventName).forEach(callback => callback(payload)); }
}

function ObservableInternal(reusePathMap = new WeakMap(), rootPath = '', o = {}, emitter = new Emitter()) {
    if (typeof o !== 'object' || o === null) {
        return o;
    }
    const pathMap = reusePathMap;

    if (!pathMap.has(o)) {
        pathMap.set(o, rootPath);
        Object.keys(o).forEach(key => {
            o[key] = ObservableInternal(reusePathMap, rootPath + '.' + key, o[key], emitter);
            emitter.emit(rootPath + '.' + key, o[key]);
        });
    }

    return new Proxy(o, {
        set: (target, p, value) => {
            if (typeof value === 'object' && value !== null) {
                const resolved = ObservableInternal(pathMap, rootPath + '.' + p, value, emitter);
                target[p] = resolved;
            } else {
                target[p] = value;
            }
            const path = pathMap.get(target);
            emitter.emit(path + '.' + p, target[p]);
        },
        get: (target, p) => {
            if (p === 'on' || o === 'off') {
                return (...args) => emitter[p](...args);
            }
            return target[p];
        },
        deleteProperty: (target, p) => {
            delete target[p];
            const path = pathMap.get(target);
            emitter.emit(path + '.' + p, undefined);
        },
        defineProperty: () => false
    });
}

function Observable() {
    return ObservableInternal(undefined, '');
}


if (require.main === module) {
    const v = Observable();

    v.on('.a', (v) => console.log('a changed to', v ));
    v.on('.b', (v) => console.log('b changed to', v ));
    v.on('.b.c', (v) => console.log('b->c changed to', v ));
    v.on('.b.d', (v) => console.log('b->d changed to', v ));
    
    v.a = 'hello';
    v.b = {
        c: 4,
        d: null
    };

    v.b.c = 9;
    v.b.d = 5;

    delete v.b.c;

    Object.defineProperty(v.b, 'kkk', {
        value: 'Hello'
    })

    console.log(Object.keys(v));
} else {
    module.exports = Observable;
}

