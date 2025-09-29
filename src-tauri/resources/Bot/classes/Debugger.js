import {Bot} from "./Bot.js";

export class Debugger {
    callback = () => {}
    breakPoints = []

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
        if(args[0] === "MARK" && !this.breakPoints.includes(args[1])) return this.breakPoints.push(args[1])
        else if(args[0] === "REMOVE" && this.breakPoints.includes(args[1])) return this.breakPoints = this.breakPoints.filter(el => el !== args[1])
        this.callback(...args)
    }

    removeListener() {
        Bot.client.cluster.removeListener('message', this.onDebug)
    }
}