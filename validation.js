function ValidObject(validators = {}, locked = false) {
    return new Proxy({}, {
        set: (target, p, value) => {
            const validator = validators[p] || validators[ValidObject.default] || (() => !locked);
            const allowed = typeof validator === 'function' ? validator(value) : validator;
            if (!allowed) {
                throw new TypeError('Invalid value for property ' + p + ': ' + value);
            }
            target[p] = value;
            return true;
        }
    })
}
ValidObject.default = Symbol();

const ALLOWED_HOBBIES = ['none', 'sleep', 'drink'];
const PERSON_SCHEMA = {
    name: value => typeof value === 'string',
    age: value => typeof value === 'number',
    hobby: value => ALLOWED_HOBBIES.includes(value),
    arr: value => value instanceof Array
};

const OPEN_PERSON_SCHEMA = {
    ...PERSON_SCHEMA,
    [ValidObject.default]: value => typeof value === 'string',
}

const freeman = ValidObject(OPEN_PERSON_SCHEMA);
const person = ValidObject(PERSON_SCHEMA, true);

try {
    person.name = 'Avichay';
    person.age = 42;
    person.hobby = 'none';
    freeman.someProp = 'Yay';
    freeman.arr = [];
    person.someProp = 'Ooops';
} catch (err) {
    console.error(err);
} finally {
    console.log(person);
    console.log(freeman);
}