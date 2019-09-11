#!/bin/sh
read -t 20 -p 'location branch and remote branch name: ' branch
read -t 40 -p 'commit message: ' commitMessage


cd ~/project/srm-front-ssrc/;
ls


git checkout $branch
git add .
git commit -m "${commitMessage}"
git pull origin ${branch}
git push origin ${branch}

# ----sync branch-----
# . sync_ssrc.sh;

