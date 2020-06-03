#!/bin/bash
#!/bin/sh

## constants
logs_file='/home/zk/shell/logs/init_daily.txt';

# preview message
notify-send "daily operate" "update system,svn,repository";


# update system
function handleSystemUpgrade() {
    echo '=========upgrade and update system==========';  
    echo `date`;

    echo 'z' | sudo -S apt-get update;
    sudo apt-get upgrade;
}

# cd project
function handleCdProjectDirectory() {
    cd ~;
    cd project;
}

# pull develop and test
function handlePullDevelopTest() {
    git fetch;

    git checkout develop;
    git pull origin develop;

    git checkout test;
    git pull origin test;
}

# svn
function handleSvnUpdate() {
    echo '==================svn update==================';
    handleCdProjectDirectory;
    cd svn/;
    svn cleanup;
    sudo svn update;
}

# hzero_front
function handleHzeroFrontDevelop() {
    echo '==================hzero-front===============';
    handleCdProjectDirectory;
    cd hzero-front/;

    git checkout develop;
    git pull origin develop;
}

# srm-front-ssrc
function handleSrmFrontRepository() {
    if -n $1
    then
        echo "=========${$1}===============";
        handleCdProjectDirectory;
        cd srm-front-{$1};
        handlePullDevelopTest;
    else
        echo '======srm-front-ssrc=========';
        handleCdProjectDirectory;
        cd srm-front-ssrc;
        handlePullDevelopTest;
    fi
}

## call operate functions
handleSystemUpgrade '' >> ${logs_file} 2>&1;
handleSvnUpdate >> ${logs_file} 2>&1;
handleHzeroFrontDevelop >> ${logs_file} 2>&1;
handleSrmFrontRepository '' >> ${logs_file} 2>&1;

echo '=======================END=====================' >> ${logs_file};

