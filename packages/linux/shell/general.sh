#!/bin/sh
#!/bin/bash

function printShellInfo() {
    printf "shell script info";
    printf $0;
    pwd;
}

# invoke
printShellInfo;


echo "====END====";
