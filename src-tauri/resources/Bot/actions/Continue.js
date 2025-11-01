import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class Continue {
    static type = "Continue"
    static variableTypes = []
    static outputs = []
    static html = `
    `
    static load(context) {
    }
    static async run({actionManager}) {
        actionManager.onContinue?.()
    }
}