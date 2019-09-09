#!/bin/sh

location="project/srm-front-ssrc/"

cd ~
cd $location
ls

git checkout test;
git pull origin test;

function syncReleaseBranch() {
    echo "sync branch $1";
    echo "----- git checkout $1 --------"
    git checkout $1;
    echo "----- git pull $1 --------"
    git pull origin $1;
    echo "----- git merge test --------"
    git merge test;
    echo "----- git push $1 --------"
    git push origin $1;
}

function syncAllBranch() {
    syncReleaseBranch "release";
    # syncReleaseBranch "develop";
    # syncReleaseBranch "master";
    # syncReleaseBranch "1.2.0";
    syncReleaseBranch "backup";
}

syncAllBranch;
echo "------ result: $? -----------";
