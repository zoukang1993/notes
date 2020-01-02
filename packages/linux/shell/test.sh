#!/bin/sh
#!/bin/bash

#echo "update and upgrade system";
#echo 'z' | sudo -S apt-get update;
#sudo apt-get upgrade;


logs_test="./logs/test.txt";

function test() {
    echo `date`;
    xmessage -center -timeout 10000 "do you want to update system ?";
    echo "end";
}

## invoke
test;
