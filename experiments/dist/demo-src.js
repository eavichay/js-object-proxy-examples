import { Component } from 'https://unpkg.com/@neow/core@1.0.1/dist/index.js';
const DOM = new Proxy({}, {
  get: (target, key) => {
    return (attrs = {}, ...children) => {
      const isText = typeof children === 'string';
      const attributeNames = Object.keys(attrs);

      const printAttr = (acc, attr) => `${acc} ${attr}="${attrs[attr]}"`;

      const result = [`<${key}${attributeNames.reduce(printAttr, '')}>`, children.join('\n'), `</${key}>\n`].join('\n');
      return result;
    };
  }
});

class MyClass extends Component {
  get computedTemplate() {
    return DOM.div({
      "id": "app-root"
    }, DOM.h1({}, "Hello"), DOM.form({
      "class": "pach control",
      "id": "my-form"
    }, DOM.input({
      "type": "password",
      "placeholder": "PASSWORD"
    }, {'{{myProperty}}'})));
  }

  get myProperty() {
    return 'doron';
  }

  constructor() {
    super();
  }

}

customElements.define('my-class', MyClass);
document.body.appendChild(document.createElement('my-class'));
