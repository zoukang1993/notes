#!/bin/sh
#!/bin/bash

# constants

FILE=$0;


# xmessage
function handleXmessage() {
    echo `date`;
    xmessage -center -timeout 10000 -file${FILE} "do you want to update system ?";
    echo "END";
}

# notify-send
function handlNotifySend() {
    echo `date`;
    notify-send "test title" "test notify-send!";
}

# zenity
handleZenity() {
    zenity --info "DO YOU WANT TO SHOW";
}


## invoke
# handleXmessage;
# handlNotifySend;
handleZenity;

