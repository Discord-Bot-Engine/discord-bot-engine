import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class Break {
    static type = "Break"
    static variableTypes = []
    static outputs = []
    static html = `
    `
    static load(context) {
    }
    static async run({actionManager}) {
        actionManager.onBreak?.()
    }
}