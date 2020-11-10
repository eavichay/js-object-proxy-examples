const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.tvmaze.com/'
});
const tvmaze = new Proxy({}, {
    get(_, name) {
        return Object.assign({},
            ['get', 'delete', 'post', 'put', 'patch'].reduce(
                (obj, method) => Object.assign({}, obj, {
                    [method](data = {}, params = {}) {
                        if (method === 'get' || method === 'delete') {
                            return instance.request({
                                url: name,
                                method,
                                params,
                            }).then(r => r.data);
                        } else {
                            return instance.request({
                                url: name,
                                method,
                                data,
                                params,
                            }).then(r => r.data);
                        }
                    }
                }), {}));
    }
});


tvmaze.shows.get({}, {q: 'girls'}).then(r => console.log(r)).catch(console.log);
tvmaze['search/shows'].get({}, {q: 'girls'}).then(r => console.log(r)).catch(console.log);

