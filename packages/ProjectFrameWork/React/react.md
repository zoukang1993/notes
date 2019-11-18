### react 

#### build

```
npm install -g create-react-app
create-react-app demo-app
cd demo-app
Yarn install
Yarn start
```

---

> react decorator error with mobx and typescript
```
1. try to success run command
确保当前工作区的代码被commit 或者push到远程仓库，工作区是干净的
npm run eject

2. editor .bashrc
{
     "presets": [
          "react-app"
     ],
     "plugins": [
          ["@babel/plugin-proposal-decorators", {"legacy": true}],
     ]
}
```
