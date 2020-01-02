#!/bin/sh
#!/bin/bash

## logs file;
logsFile='/home/zk/shell/logs/backup_branch_to_master.txt';

function handleBackUpBranchToMaster() {
    notify-send "backup" "srm-front-ssrc test branch backup to master!";
    echo "=============backup ssrc to master============";
    echo `date`;

    cd ~/project/srm-front-ssrc;

    git fetch;
    git checkout develop;
    git pull origin develop;
    git checkout test;
    git pull origin test;

    git checkout master;
    git pull origin master;

    git merge test;
    git push origin master;

    git checkout test;
}

## invoke
handleBackUpBranchToMaster >> ${logsFile} 2>&1;

echo "========================END========================" >> ${logsFile} 2>&1;

