# compose

``` js
const compose = (f, g) => (...arg) => f(g(arg));

const toUppercase = x => x.toUppercase();
const explain = y => y + ' !';

let shut = compose(toUppercase, explain);
shut('hello world');
```

> redux是如何实现compose的

``` js
const composeTwo = (...funcs) => {
    if (funcs.length === 0) {
        return arg => arg;
    } else if (funcs.length === 1) {
        return funcs[0];
    } else {
        return funcs.reducer((a, b) => (...args) => a(b(args)));
    }
}
```
