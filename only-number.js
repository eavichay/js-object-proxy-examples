function OnlyNumbers() {
    return new Proxy({}, {
        get: (target, key) => {
            if (key === 'total') {
                return Object.keys(target).reduce((sum, key) => sum + target[key], 0);
            }
            return target[key];
        },
        set: (target, key, value) => {
            const resolved = Number(value);
            if (isNaN(resolved)) {
                throw new Error('Values must be a number or number-like');
            }
            target[key] = resolved;
            return true;
        }
    })
}

const groceries = OnlyNumbers();

groceries.milk = 4;
groceries.sugar = 1;
groceries.coffee = 1;

Object.assign(groceries, {
    butter: 2 
});

console.log(groceries.total);

groceries.oops = 'Hello';