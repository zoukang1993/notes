#!/bin/sh
# read
# read 内部命令被用来从标准输入读取单行数据。这个命令可以用来读取键盘输入，当使用重定向的时候，可以读取文件中的一行数据


# -a 后跟一个变量，该变量会被认为是个数组，然后给其赋值，默认是以空格为分割符。
# -d 后面跟一个标志符，其实只有其后的第一个字符有用，作为结束的标志。
# -p 后面跟提示信息，即在输入前打印提示信息。
# -e 在输入的时候可以使用命令补全功能。
# -n 后跟一个数字，定义输入文本的长度，很实用。
# -r 屏蔽\，如果没有该选项，则\作为一个转义字符，有的话 \就是个正常的字符了。
# -s 安静模式，在输入字符时不再屏幕上显示，例如login时输入密码。
# -t 后面跟秒数，定义输入字符的等待时间。
# -u 后面跟fd，从文件描述符中读入，该文件描述符可以是exec新开启的。

# read -a arr
# echo ${arr[@]}

# read a
# b=`expr ${a} + 1`
# echo "${a} + 1 = ${b}"

# if read -t 3 -p 'test: ' content
# then
#     echo ${content}
# else
#     echo "time  out ."
# fi


# read -n3 number
# echo ${number}

# read -s password;
# echo ${password};


# 读取文件多行
count=1;
cat test.sh | while read line
do
    echo "Line ${count}: ${line}"
    count=`expr ${count} + 1`
done
echo "over"
exit 0
