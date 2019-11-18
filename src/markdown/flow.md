## 流程图 :smile:

```flow
st=>start: Start
e=>end: End
op1=>operation: My Operation
sub1=>subroutine: My Subtine
cond=>condition: Yes or No
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
```

```flow
st=>start: Start
e=>end: End
op1=>operation: Your operation
cond=>condition: yes or no
sub1=>subroutine: My subroutine
sub2=>sburoutine: Your subroutine

st->op1->cond
cond(yes)->sub1->e
cond(no)->e
```