function NoUndefined () {
    /**
     * @type ProxyHandler
     */
    const noUndefinedHandler = {
        get: (target, key) => {
            // V8 Issue - JSON stringify fails on proxies with no "toJSON" value
            if (key === 'toJSON') {
                return target;
            }
            // undefined? Make it an object then
            if (typeof target[key] === 'undefined') {
                const nested = NoUndefined();
                target[key] = nested;
            }
            return target[key];
        }
    }
    return new Proxy({}, noUndefinedHandler);
}

if (require.main === module) {
    const x = NoUndefined();
    x.some.nested.value = 4;
    x.some.other = 42;
    
    console.log(JSON.stringify(x, null, 4));
} else {
    module.exports = NoUndefined;
}



