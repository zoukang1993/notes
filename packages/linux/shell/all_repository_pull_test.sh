#!/bin/sh
#!/bin/bash

# ubuntu18.04

## 自动更新所有项目仓库代码
## ／home/zk/project/**,
## 文件下的所有git仓库
## develop,test分支的代码

#preview
notify-send "update repository" "srm,hzero repository, develop && test";

source constants.sh;

readonly logFile='/home/zk/shell/logs/all_repository_pull_test.txt';

files=$(ls $repositoryPath);

function handlePullFromTest() {
    printf "%-25s\n" $1;
    cd $repositoryPath;
    cd $1/;

    git fetch;

    git checkout develop >> ${logFile} 2>&1;
    git pull origin develop >> ${logFile} 2>&1;

    git checkout test >> ${logFile} 2>&1;
    git pull origin test >> ${logFile} 2>&1;

    cd $repositoryPath;
}

function handlePullTest() {
    file=$1;
    fileStart=${file:0:3};

    if [ $fileStart = 'srm' ]
    then
        handlePullFromTest $1;
    elif [ $fileStart = 'hze' ]
    then
        handlePullFromTest $1;
    else
        printf "%-25s %-5s %-3s %-10s %-10s %-10s\n" ${file} NOT A GIT REPOSITORY;
    fi
}

## start
echo "=====START====" >> ${logFile} 2>&1;
echo `date` | >> ${logFile} 2>&1;

for fileName in $files
do
    handlePullTest $fileName;
done;

echo "====END====" >> ${logFile} 2>&1;
