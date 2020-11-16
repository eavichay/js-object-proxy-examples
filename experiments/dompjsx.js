module.exports = function(babel) {
    const t = babel.types;
    return {
        name: 'dompjsx',
        visitor: {
            JSXExpressionContainer(path) {
                const raw = path.toString();
                path.replaceWithSourceString('`$' + raw + '`');
            },
            JSXText(path) {
                if (path.node.value.split('\n').join('').trim() === '') {
                    path.remove();
                } else {
                    path.replaceWith(t.stringLiteral(path.node.value));
                }
            },
            JSXElement(path) {
                const attributes = path.node.openingElement.attributes.reduce((attrs, currentAttr) => {
                    const key = currentAttr.name.name;
                    const value = currentAttr.value.value;
                    const attr = t.objectProperty(t.stringLiteral(key), t.stringLiteral(String(value)));
                    attrs.push(attr);
                    return attrs;
                }, []);
                const callee = t.memberExpression(t.identifier('DOM'), t.identifier(path.node.openingElement.name.name));
                const callExpression = t.callExpression(callee, [t.objectExpression(attributes)]);
                callExpression.arguments = callExpression.arguments.concat(path.node.children);
                path.replaceWith(callExpression, path.node);

            return;
            //   //get the opening element from jsxElement node
            //   var openingElement = path.node.openingElement;  
            //    //tagname is name of tag like div, p etc
            //   var tagName = openingElement.name.name;
            //   // arguments for React.createElement function
            //   var args = []; 
            //   //adds "div" or any tag as a string as one of the argument
            //   args.push(t.stringLiteral(tagName)); 
            //   // as we are considering props as null for now
            //   var attribs = t.nullLiteral(); 
            //   //push props or other attributes which is null for now
            //   args.push(attribs); 
            //   // order in AST Top to bottom -> (CallExpression => MemberExpression => Identifiers)
            //   // below are the steps to create a callExpression
            //   var reactIdentifier = t.identifier("React"); //object
            //   var createElementIdentifier = t.identifier("createElement"); //property of object
            //   var callee = t.memberExpression(reactIdentifier, createElementIdentifier)
            //   var callExpression = t.callExpression(callee, args);
            //    //now add children as a third argument
            //   callExpression.arguments = callExpression.arguments.concat(path.node.children);
            //   // replace jsxElement node with the call expression node made above
            //   path.replaceWith(callExpression, path.node); 
            },
          },
    }
}