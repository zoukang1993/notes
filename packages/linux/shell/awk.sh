#!/bin/sh

# awk AWK是一种处理文本文件的语言，是一个强大的文本分析工具。
awk -F, '{print $1,$2}' test.sh


BEGIN { print "Hello, world!" }
