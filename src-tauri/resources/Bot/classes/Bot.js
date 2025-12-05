import {Debugger} from "./Debugger.js";
import * as fs from "node:fs";
import path from "node:path"
import {Trigger} from "./Trigger.js";
import {Action} from "./Action.js";
import Client from "./Client.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {Extension} from "./Extension.js";
import extensions from "../data/extensions.json" with { type: "json" };
import {EmbedBuilder, Events} from "discord.js";
import Keyv from "keyv";
import {KeyvFile} from "keyv-file"
import {ActionManager} from "./ActionManager.js";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

class BotClass {
    npm = null
    debugger = null
    triggers = []
    extensions = new Map()
    triggerClasses = []
    actionClasses = []
    extensionClasses = []
    data = new Keyv({
        store: new KeyvFile({
            filename: path.join(__dirname, "../data/data.json"),
            expiredCheckDelay: 24 * 3600 * 1000,
            writeDelay: 100,
            encode: JSON.stringify,
            decode: JSON.parse
        })
    })

    client = new Client()

    sendDebugData(data) {
        if(!this.debugger) return;
        this.debugger.sendDebugData(JSON.stringify(data))
    }

    sendVariablesData(trigger, variables) {
        if(!this.debugger) return;
        variables.keys().forEach(name => {
            const value = variables.get(name);
            const data = {
                name,
                value,
                triggerId: trigger.id,
            }
            this.debugger.sendVariableData(
                JSON.stringify(
                    data,
                    (key, value) => typeof value === 'bigint' ? value.toString() : value,
                )
            )
        })
    }

    start() {
        this.client.start()
        this.client = this.client.client
    }

    attachDebugger() {
        this.debugger = new Debugger(async (triggerId, actionId) => {
            const t = this.triggers.find(t => t.id === triggerId)
            const action = t.actions.find(act => act.id === actionId)
            action.run({
                actionManager: t.lastManager,
                setVariable: t.lastManager.setVariable.bind(t.lastManager),
                getVariable: t.lastManager.getVariable.bind(t.lastManager),
            })
            Bot.sendVariablesData(t, t.lastManager.variables);
        });
    }

    removeDebugger() {
        this.debugger?.removeListener()
        this.debugger = null
    }

    async loadFiles() {
        const triggerClassesPath = path.resolve(__dirname, "../triggers")
        const actionClassesPath = path.resolve(__dirname, "../actions")
        const extensionClassesPath = path.resolve(__dirname, "../extensions")
        const dataPath = path.resolve(__dirname, "../data")
        const triggers = fs.readdirSync(dataPath).filter(f => f.length === 41).map(f => JSON.parse(fs.readFileSync(path.resolve(dataPath, f))))
        this.triggers = triggers.map(trigger => Trigger.fromJSON(trigger))
        this.triggerClasses = await Promise.all(fs.readdirSync(triggerClassesPath).filter(file=>file.endsWith(".js")).map(file => import("file://"+path.join(triggerClassesPath, file)).catch(console.log)))
        this.actionClasses = await Promise.all(fs.readdirSync(actionClassesPath).filter(file=>file.endsWith(".js")).map(file => import("file://"+path.join(actionClassesPath, file)).catch(console.log)))
        this.extensionClasses = await Promise.all(fs.readdirSync(extensionClassesPath).filter(file=>file.endsWith(".js")).map(file => import("file://"+path.join(extensionClassesPath, file)).catch(console.log)))
        this.triggerClasses = this.triggerClasses.filter(m => m).map(m => m.default)
        this.actionClasses = this.actionClasses.filter(m => m).map(m => m.default)
        this.extensionClasses = this.extensionClasses.filter(m => m).map(m => m.default)
        this.extensionClasses.forEach(extension => {
            const obj = extensions[extension.type] ?? {}
            this.extensions.set(extension.type, Extension.fromJSON({type: extension.type, data: {}, ...obj}))
        })
        this.extensions.keys().forEach(extension => this.extensions.get(extension).load())
        this.triggers.forEach(trigger => trigger.load())
    }

    async setData(key, value) {
        const num = Number(value)
        if (isNaN(num)) return await this.data.set(key, value);
        await this.data.set(key, String(value).length < 16 ? num : value);
    }

    async getData(key) {
        const value = await this.data.get(key)
        return value;
    }
}

export const Bot = new BotClass()