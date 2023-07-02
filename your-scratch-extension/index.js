const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');

// M3D SMARS Logic

// put any setup for your extension here
var wsIsConnected = false;
var wsGateway = "";
var Sensors = [0,0,0,0,0,0,0,0,];
function initWebSocket() {
    console.log('Trying to open a WebSocket connection on: ' + wsGateway);
    try{
        websocket = new WebSocket(wsGateway);
        websocket.onopen = onOpen;
        websocket.onclose = onClose;
        websocket.onmessage = onMessage; // <-- add this line
    } catch {
        console.log("Connection failed. Will retry in a while");
        setTimeout(initWebSocket, 2000);
    }
    return wsIsConnected;
}
function onOpen(event) {
    wsIsConnected = true;
    console.log('Connection opened');
}
function onClose(event) {
    wsIsConnected = false; 
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}
function onMessage(event) {
    // console.log("ws message"); // to much logging
    var str = "";
    str = event.data;
    if (str.startsWith("sensor")){
        var sIndex = str.substring(str.indexOf(" ")).trim();
        sIndex = sIndex.substring(0, sIndex.indexOf(" "))
        var sIndex = parseFloat(sIndex);
        var val = parseFloat(str.substring(str.indexOf("=") + 1).trim());
        Sensors[sIndex] = val;
    }
}
function sendCommand(COMMAND){
    // example implementation to return a string
    console.log("sendCommand(" + COMMAND + ")");
    try{
        if (wsIsConnected){
            websocket.send(COMMAND);
            return true;
        }
    } catch { 
        console.log("Couldn't send: " + COMMAND);
    }
    return false;
}
class Scratch3YourExtension {

    constructor(runtime) {
        initWebSocket();
    }
    /**
     * Returns the metadata about your extension.
     */
    getInfo() {
        return {
            // unique ID for your extension
            id: 'yourScratchExtension',

            // name that will be displayed in the Scratch UI
            name: 'Demo',

            // colours to use for your extension blocks
            color1: '#000099',
            color2: '#660066',

            // icons to display
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // your Scratch blocks
            blocks: [
                {
                    opcode: 'checkConnectedBlock',                    
                    // type of block - choose from:
                    //   BlockType.REPORTER - returns a value, like "direction"
                    //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                    blockType: BlockType.BOOLEAN,
                    text: 'M3D SMARS is connected',
                    terminal: true,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        // type/shape of the parameter - choose from:
                        //     ArgumentType.ANGLE - numeric value with an angle picker
                        //     ArgumentType.BOOLEAN - true/false value
                        //     ArgumentType.COLOR - numeric value with a colour picker
                        //     ArgumentType.NUMBER - numeric value
                        //     ArgumentType.STRING - text value
                        //     ArgumentType.NOTE - midi music value with a piano picker
                    }
                },
                {
                    opcode: 'connectRequestBlock',
                    blockType: BlockType.COMMAND,
                    text: 'Connect M3D SMARS at [MY_ADDRESS]',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        MY_ADDRESS: {
                            defaultValue: '192.168.10.27',
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'sendRawCommandBlock',
                    blockType: BlockType.COMMAND,
                    text: 'Send Command [COMMAND]',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        COMMAND: {
                            defaultValue: 'Hello!',
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'goFwd',
                    blockType: BlockType.COMMAND,
                    text: 'Go forward',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'goBwd',
                    blockType: BlockType.COMMAND,
                    text: 'Go backward',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'halt',
                    blockType: BlockType.COMMAND,
                    text: 'Stop',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                    }
                },
                {
                    opcode: 'goFwdAtSpeed',
                    blockType: BlockType.COMMAND,
                    text: 'Go forward at [POWER]%',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        POWER: {
                            defaultValue: '80',
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'goBwdAtSpeed',
                    blockType: BlockType.COMMAND,
                    text: 'Go backward at [POWER]%',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        POWER: {
                            defaultValue: '80',
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'rotateCW',
                    blockType: BlockType.COMMAND,
                    text: 'Rotate clockwise',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'rotateCCW',
                    blockType: BlockType.COMMAND,
                    text: 'Rotate counter-clockwise',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                    }
                },
                {
                    opcode: 'rotateCWAtSpeed',
                    blockType: BlockType.COMMAND,
                    text: 'Rotate clockwise at [POWER]%',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        POWER: {
                            defaultValue: '80',
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'rotateCCWAtSpeed',
                    blockType: BlockType.COMMAND,
                    text: 'Rotate counter-clockwise at [POWER]%',
                    terminal: false,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        POWER: {
                            defaultValue: '80',
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'readIR0',
                    blockType: BlockType.REPORTER,
                    text: 'IR sensor value',
                    terminal: true,
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                    }
                }
            ]
        };
    }

    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */
    checkConnectedBlock({ }) {
        console.log("checkConnectedBlock()");
        if(wsIsConnected === null)
            wsIsConnected = false;
        return wsIsConnected;
    }
    connectRequestBlock({ MY_ADDRESS }) {
        // example implementation to return a string
        MY_ADDRESS = "ws://" + MY_ADDRESS + "/ws";
        console.log("connectRequestBlock(" + MY_ADDRESS + ")");
        if (wsGateway !== MY_ADDRESS){
            wsGateway = MY_ADDRESS;
            if (wsIsConnected){
                console.log("disconnecting previous one");
                onclose = null;
                websocket.close()
            }
            initWebSocket();
        }
        return wsIsConnected;
    }
    sendRawCommandBlock({ COMMAND }) {
        return sendCommand(COMMAND);
    }
    // Movement
    goFwd({}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor 100%");
        sendCommand("right motor 100%");
        return true;
    }
    goBwd({}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor -100%");
        sendCommand("right motor -100%");
        return true;
    }
    halt({}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor 0%");
        sendCommand("right motor 0%");
        return true;
    }
    goFwdAtSpeed({POWER}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor " + POWER + "%");
        sendCommand("right motor " + POWER + "%");
        return true;
    }
    goBwdAtSpeed({POWER}){
        sendCommand("left motor -" + POWER + "%");
        sendCommand("right motor -" + POWER + "%");
        return true;
    }
    rotateCW({}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor 100%");
        sendCommand("right motor -100%");
        return true;
    }
    rotateCCW({}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor -100%");
        sendCommand("right motor 100%");
        return true;
    }
    rotateCWAtSpeed({POWER}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor " + POWER + "%");
        sendCommand("right motor -" + POWER + "%");
        return true;
    }
    rotateCCWAtSpeed({POWER}){
        if (!wsIsConnected)
            return false;
        sendCommand("left motor -" + POWER + "%");
        sendCommand("right motor " + POWER + "%");
        return true;
    }
    readIR0({}) {
        // example implementation to return a string
        console.log("readIR0");
        // read the cache and return
        return Sensors[0];
    }
}

module.exports = Scratch3YourExtension;
