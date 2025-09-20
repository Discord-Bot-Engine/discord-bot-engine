import {Bot} from "./Bot.js";

export class Debugger {
    callback = () => {}

    constructor(callback) {
        this.callback = callback;
        this.onDebug = this.onDebug.bind(this);
        Bot.client.cluster.on('message', this.onDebug)
    }

    sendDebugData(data) {
        console.log(`$DEBUGGER$$$ ${data}`)
    }

    sendVariableData(data) {
        console.log(`$VARIABLE$$$ ${data}`)
    }

    onDebug(message) {
        let data = message.content
        if(!data?.startsWith("$DEBUGGER$$$")) return;
        const args = data.replace("$DEBUGGER$$$", "").trim().split(" ")
        this.callback(...args)
    }

    removeListener() {
        Bot.client.cluster.removeListener('message', this.onDebug)
    }
}