const mbId = "1"
const isVba = true;

/****
 * Device control variables
 */

let leds = [
    {
        port: "1",
        state: 0,
        location: 'beak',
        pin: 0
    },
    {
        port: "2",
        state: 0,
        location: 'tail',
        pin: TailPort.One
    }
]
let trileds = [
    {
        port: "1",
        redState: 0,
        greenState: 0,
        blueState: 0,
        location: 'beak',
        pin: 0
    },
    {
        port: "2",
        redState: 0,
        greenState: 0,
        blueState: 0,
        location: 'tail',
        pin: TailPort.One
    }
]

let rovers = [
    {
        id: "1",
        speedLimitStraight: 0,
        speedLimitTurn: 0,
        staticSpeedStraight: 75,
        staticSpeedTurn: 50
    }
];

let provers = [
    {
        id: "1",
        speedLimitStraight: 0,
        speedLimitTurn: 0,
        staticSpeedStraight: 75,
        staticSpeedTurn: 50,
        straightDistance: 50,
        turnDistance: 90,
        pause: 500
    }
];

/******
 * Platform Specific Functions
 */

finch.startFinch();

function controlLed(id: string, newState: number) {
    let foundLed = leds.find(function (value: any, index: number) {
        return value.port == id
    })
    if(foundLed) {
        if(newState != foundLed.state) {
            if(foundLed.location = 'beak') {
                finch.setBeak(newState, newState, newState);
            } else {
                
                finch.setTail(foundLed.pin, newState, newState, newState);
            }
            foundLed.state = newState;
        }
        return true
    }
    return false
}

// function controlTriLed(id: string, newState: string) {
//     let foundTriLed = trileds.find(function (value: any, index: number) {
//         return value.port == id
//     })
//     if(foundTriLed) {
//         let newStates = {
//             red: convertLed(newState[0]),
//             green: convertLed(newState[1]),
//             blue: convertLed(newState[2])
//         }
//         if(newStates.red != foundTriLed.redState || newStates.green != foundTriLed.greenState || newStates.blue != foundTriLed.blueState) {
//             if(foundTriLed.location = 'beak') {
//                 finch.setBeak(newStates.red, newStates.green, newStates.blue);
//             } else {
                
//                 finch.setTail(foundTriLed.pin, newStates.red, newStates.green, newStates.blue);
//             }
//             foundTriLed.redState = newStates.red
//             foundTriLed.greenState = newStates.green
//             foundTriLed.blueState = newStates.blue
//         }
//         // basic.showString(`${newStates.red}${newStates.green}${newStates.blue}`)
//         return true
//     }
//     return false
// }

function adjustBotSpeed(bot: any, direction: string, speed: any) {
    speed = parseInt(speed);
    if(direction == 'f' || direction == 'b') {
        if(bot.staticSpeedStraight > 0) {
            speed = bot.staticSpeedStraight;
        } else if(bot.speedLimitStraight > 0) {
            // speed = speed > bot.speedLimitStraight ? bot.speedLimitStraight : speed;
            speed = Math.floor(bot.speedLimitStraight * (speed/100));
        }
    } else if(direction == 'l' || direction == 'r') {
        if(bot.staticSpeedTurn > 0) {
            speed = bot.staticSpeedTurn;
        } else if(bot.speedLimitTurn > 0) {
            // speed = speed > bot.speedLimitTurn ? bot.speedLimitTurn : speed;
            speed = Math.floor(bot.speedLimitTurn * (speed/100));
        }
    }
    return speed;
}

function controlRover(id: string, direction: string, speed: number) {
    let foundBot = rovers.find(function (value: any, index: number) {
        return (value.id == id)
    })
    if(foundBot) {
        speed = adjustBotSpeed(foundBot, direction, speed);
        switch(direction) {
            case 'f':
                finch.startMotors(speed, speed)
                break;
            case 'b':
                finch.startMotors(speed * -1, speed * -1);
                break;
            case 'r':
                finch.startMotors(speed, speed * -1);
                break;
            case 'l':
                finch.startMotors(speed * -1, speed);
                break;
            case 's':
                finch.stopMotors();
                break;
        }
    } else {
        basic.showString(`Rover ${id} not found`)
    }
}

function controlProgRover(id: string, direction: string, speed: number) {
    let foundBot = provers.find(function (value: any, index: number) {
        return (value.id == id)
    })
    if(foundBot) {
        speed = adjustBotSpeed(foundBot, direction, speed);
        switch(direction) {
            case 'f':
                finch.setMove(MoveDir.Forward, foundBot.straightDistance, speed)
                break;
            case 'b':
                finch.setMove(MoveDir.Backward, foundBot.straightDistance, speed)
                break;
            case 'r':
                finch.setTurn(RLDir.Right, foundBot.turnDistance, speed)
                break;
            case 'l':
                finch.setTurn(RLDir.Left, foundBot.turnDistance, speed)
                break;
            case 's':
                finch.stopMotors();
                break;
            default:
                basic.showString("?");
        }
        // basic.showString('i:'+id+' d:'+direction+' s:'+speed);
        // basic.pause(foundBot.pause);
    } else {
        basic.showString(`PRover ${id} not found`)
    }
}

// function controlServo(id: string, stype: string, newState: number) {}

function controlWheels(id: string, speeds: string) {
    let foundBot = rovers.find(function (value: any, index: number) {
        return (value.id == id)
    })
    if (foundBot) {
        let speed = speeds.split(':');
        // basic.showString(speeds);
        // basic.showString('*');
        // basic.showString(speed[0].substr(0, 1));
        // basic.showString('$');
        // basic.showString(speed[1].substr(0, 1));
        // let ladjust = 1;
        // let lspeed = speed[0];
        // if (speed[0].substr(0, 1) == '-') {
        //     basic.showString('nl');
        //     ladjust = -1;
        //     lspeed = speed[0].substr(1,4);
        // }
        // let radjust = 1;
        // let rspeed = speed[1];
        // if (speed[1].substr(0, 1) == '-') {
        //     basic.showString('nr');
        //     radjust = -1;
        //     rspeed = speed[1].substr(1, 4);
        // }
        // finch.startMotors(parseInt(lspeed) * ladjust, parseInt(rspeed) * radjust)
        finch.startMotors(parseInt(speed[0]), parseInt(speed[1]))
    } else {
        basic.showString(`Rover ${id} not found`)
    }
}

// function controlBotHead(id: string, direction: string) {}

/******
 * NON-Platform Specific Functions
 */

/* Variables
Allows RMB to set variables that can then be read by loops to update StringMap
*/
let cmdVars = returnEmptyCmdVars();
let debug = 0;
let isRunning = false;
let cleanedUp = true;
let vbaRanOnce = false;

for (let i = 0; i < 3; i++) {
    controlLed("1", 100)
    basic.pause(300)
    controlLed("1", 0)
    basic.pause(300)
}

function returnEmptyCmdVars() {
    return [[{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }]
    ];
}

function setEmptyCmdVars() {
    cmdVars = returnEmptyCmdVars();
}

// function padString(input: string, strLen: number, padChar: string) {
//     while (input.length < strLen) {
//         input = padChar + input;
//     }
//     return input;
// }

// function matrix25Decode(input: string) {
//     let bCon = parseInt(input, 16);
//     let bOut = '';
//     let bLast = 0;
//     do {
//         if (Math.round(bCon % 2) != 0) {
//             bOut = '1' + bOut;
//             bCon--;
//         } else {
//             bOut = '0' + bOut;
//         }
//         bCon = bCon / 2;
//     } while (bCon > 0)
//     bOut = padString(bOut, 52, '0');
//     return bOut;
// }

// function matrix25Plot(bOut: string) {
//     let startPoint = 2
//     for (let r = 0; r < 5; r++) {
//         for (let c = 0; c < 5; c++) {
//             if (bOut.substr(startPoint, 2) == '11') {
//                 led.plot(c, r);
//             } else {
//                 led.unplot(c, r);
//             }
//             startPoint += 2;
//         }
//     }
// }

// function controlMatrix25(value: string) {
//     matrix25Plot(matrix25Decode(value));
// }

function convertLed(value: string) {
    return value.toLowerCase() == "f" ? 100 : parseInt(value) * 10
}

radio.onReceivedString(function (receivedString) {
    handleMessage(receivedString);
    // basic.showString(receivedString);
})
radio.setGroup(27)

function controlVariable(id: string, data: string) {
    const d = data.split('=');
    if (d.length === 2) {
        if (d[0] == 'bs') {
            isRunning = d[1] == '1' ? true : false;
            if (!isRunning) setEmptyCmdVars();
        }
    }
}

function controlCommands(gid: string, data: string) {
    // 01000
    const devType = data[0];
    const devId = devType == 'x' || devType == 'm' ? '' : data[1];
    const igid = parseInt(gid);
    // const val = devType == 'm' ? matrix25Decode(data.substr(2,20)) : data.substr(2,20);
    const val = data.substr(2, 20);
    // console.log('type: '+devType+' id: '+devId+' val: '+val);

    if (cmdVars[igid][0].deviceType == '') {
        cmdVars[igid][0] = {
            deviceType: devType,
            deviceId: devId,
            value: val
        };
    } else {
        cmdVars[igid].push({
            deviceType: devType,
            deviceId: devId,
            value: val
        });
    }
}

function handleMessage(msg: string) {
    // console.log(msg);
    if (mbId == msg[0]) {
        let dId = msg[2]
        switch (msg[1]) {
            case "b": // Rover
                controlRover(dId, msg[3].toLowerCase(), parseInt(msg.substr(4, 4)));
                break;
            case "u": // Programmable Rover
                controlProgRover(dId, msg[3].toLowerCase(), 0);
                break;
            // case "h": // Bothead or 2 axis gimble
            //     controlBotHead(dId, msg[3].toLowerCase());
            //     break;
            case "l": // LED
                controlLed(dId, convertLed(msg[3]));
                break;
            // case "m": // Matrix 25
            //     controlMatrix25(msg.substr(2, 100));
            //     break;
            // case "p": // Position Servo
            // case "r": // Rotation Servo
            //     controlServo(dId, msg[1], parseInt(msg.substr(3, 4)));
            //     break;
            // case "t": // Tricolor LED
            //     controlTriLed(dId, msg.substr(3, 3));
            //     break;
            case "u": // Programmable Rover
                controlProgRover(dId, msg[3].toLowerCase(), 0);
                break;
            case "v": // var_batch
                controlVariable(dId, msg.substr(2, 100));
                break;
            case "w": // wheels
                controlWheels('1', msg.substr(3, 100));
                break;
            case "x": // Pause
                basic.pause(parseInt(msg.substr(2, 20)));
                break;
            case "z": // vba
                controlCommands(dId, msg.substr(3, 20));
                break;
        }
    }
    if (debug === 1) {
        basic.showString(msg);
    }
}

input.onButtonPressed(Button.A, function () {
    if (debug === 1) {
        debug = 0;
    } else {
        debug = 1;
    }
    basic.showNumber(debug);
    basic.pause(1000);
    basic.clearScreen();
})

input.onButtonPressed(Button.AB, function () {
    if (isRunning) {
        isRunning = false;
    } else {
        isRunning = true;
    }
})

/*****
 * VBA Functionality
 */

function handleVba(group: number) {
    if (cmdVars[group] && cmdVars[group][0] && cmdVars[group][0].value != '') {
        cmdVars[group].forEach(function (cmd: any) {
            if (cmd.deviceType) {
                handleMessage(`${mbId}${cmd.deviceType}${cmd.deviceId}${cmd.value}`);
            } else {
                // basic.showString("NC");
            }
        });
    }
}

function cleanUpVba() {
    handleMessage(`${mbId}m0`);
    handleMessage(`${mbId}w10:0`);
    cleanedUp = true;
    vbaRanOnce = false;
}

if (isVba) {
    // Group 0 - On Start
    basic.forever(function () {
        if (isRunning && !vbaRanOnce) {
            handleVba(0);
            vbaRanOnce = true;
        } else {
            basic.pause(500);
        }
    });

    // Group 1 - Forever
    basic.forever(function () {
        if (isRunning) {
            if (cleanedUp) cleanedUp = false;
            handleVba(1);
        } else {
            basic.pause(500);
            if (!cleanedUp) cleanUpVba();
            // Add any position cleanup for the stop state here
        }
    });

    // Group 2 - Forever
    basic.forever(function () {
        if (isRunning) {
            handleVba(2);
        } else {
            basic.pause(500);
        }
    });

    // // Group 3 - Forever
    // basic.forever(function () {
    //     if (isRunning) {
    //         handleVba(3);
    //     } else {
    //         basic.pause(500);
    //     }
    // });

    // // Group 4 - On Shake
    // input.onGesture(Gesture.Shake, function () {
    //     handleVba(4);
    // });
}

basic.showString(mbId);