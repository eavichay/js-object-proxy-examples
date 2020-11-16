const http = require('http');

const DOM = new Proxy({}, {
    get: (target, key) => {
        return (attrs = {}, children = '') => {
            const isText = typeof children === 'string';
            const attributeNames = Object.keys(attrs);
            if (isText && attributeNames.length === 0) {
                return children;
            }
            const printAttr = (acc, attr) => `${acc} ${attr}="${attrs[attr]}"`;
            const result = [
                `<${key}${attributeNames.reduce(printAttr, '')}>`,
                ...(isText ? [children] : children),
                `</${ key }>\n`
            ].join(' ');
            return result;
        }
    }
});

const html = 
    DOM.html(
        {},
        [DOM.head({}, [
            DOM.link({rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'})
        ]),
        DOM.body({class: 'container'}, [
            DOM.form(
                {
                    class: 'form jumbotron',
                    method: 'POST',
                    action: '/login'
                },
                [
                    DOM.div({class: 'form-group'}, [
                        DOM.label({for: 'username'}, 'Enter your name'),
                        DOM.input({name: 'username', class: 'form-control'}),
                        DOM.label({for: 'pwd'}, 'Password'),
                        DOM.input({name: 'pwd', type: 'password', class: 'form-control'}),
                        DOM.div({style: 'height: 20px'}),
                        DOM.button({type: 'submit', class: 'btn btn-primary'}, 'GREAT SUCCESS')
                    ])
                ]
            )
        ])
    ]);

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end(html);
}

const server = http.createServer(requestListener);
server.listen(8080);