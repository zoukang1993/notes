### [eruda](https://github.com/liriliri/eruda)

> Console for mobile browsers

> npm install eruda --save
> yarn add eruda --save

---

#### add this script to your page direction
```
<script src="node_modules/eruda/eruda.min.js"></script>
<script>eruda.init();</script>
```

> use trigger debug
```
(function () {
    var src = 'node_modules/eruda/eruda.min.js';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();

or 
 trigger with url have 'debug', example https://star.kuipmake.com?debug

<script>
    (function() {
      let url = window.location.href;
      
      if (url.match(/debug/)) {
        let s = document.createElement("script");
        s.setAttribute("src", '//cdn.bootcss.com/eruda/1.5.2/eruda.min.js');
        document.getElementsByTagName('head')[0].appendChild(s); 
        s.onload = function() {
          eruda.init();
        }
      }
    })()
  </script>
```
