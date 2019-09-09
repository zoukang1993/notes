#!/bin/sh
read branch
read commitMessage


cd ~/project/srm-front-ssrc/;
ls


git checkout $branch
git add .
git commit -m "${commitMessage}"
git pull origin ${branch}
git push origin ${branch}

# ----sync branch-----
# . sync_ssrc.sh;

