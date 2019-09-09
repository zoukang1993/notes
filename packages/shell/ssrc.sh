#!/bin/sh
read branch
read commitMessage

location="project/srm-front-ssrc/"

cd ~
cd $location
ls


git checkout -b $branch
git add .
git commit -m "${commitMessage}"
git pull origin ${branch}
git push origin ${branch}

# ----sync branch-----
# . sync_ssrc.sh;

