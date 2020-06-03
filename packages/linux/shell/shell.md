## shell

### #!”是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行 /env 是系统的PATH目录中查找
```
#!/bin/sh
#!/bin/bash
#!/usr/bin/php
#!/usr/bin/env python3
#!/usr/bin/env bash


### 运行 Shell 脚本
chmod +x test.sh
./test.sh

/bin/sh/test.sh

ubuntu: bash test.sh


### 使用crontab，让linux定时执行shell脚本
