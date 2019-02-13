# Tree-Data.js
JS library for creation and simple editing tree data structures using functional programming style and functions like map, filter, reduce.

### Example of using

```javascript
const data = [{
    value: '1',
}, {
    value: '2',
    
    children: [{
       value: '1' 
    }, {
       value: '2',
       param: '24'
    }]
}];

const tree = new Tree(data); // creating of tree

tree.addChild({ value: '1-3'}); // adding a child

tree.forEach(element => console.log(element.id, element.value));

tree.map((element, level) => ({ 
    ...element, 
    value: `${level}-${element.value}`
}));

const element = tree.find(element => 
    element.value === '1-2');

console.log("param", element.param);
```

## API

### constructor params

### map

### reduce

### find

### addChild

### addParent

### todo: removeChild

### todo: removeParent

### hasChildren

### getChildren

### forEach

### flatten

### filter


### getObject

### setObject

### testQuery

### processElement
