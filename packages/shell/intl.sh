#!/bin/bash
# zk - 2019/9/18
# 扫描文件中多语言

echo "scanning start"
pwd

grep -R -i -n  "promptCode = *" */*.js > promptCode.txt;
grep -R -i -n ".get(\`\${" */*.js > language.txt
# grep -R -i -n "intl.get*" */*.js > language.txt

echo "finished"

