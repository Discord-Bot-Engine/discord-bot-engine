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

    sendVariablesData(trigger) {
        if(!this.debugger) return;
        trigger.variables.keys().forEach(name => {
            const value = trigger.variables.get(name);
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
            const action = t.actionManager.actions.find(act => act.id === actionId)
            action.run({
                actionManager: t.actionManager,
                setVariable: t.setVariable.bind(t),
                getVariable: t.getVariable.bind(t),
            })
            Bot.sendVariablesData(t);
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

    async parse(value) {
        try {
            if (typeof value === 'string') {
                if (value.startsWith('dbe$mem-')) {
                    const values = value.split('_');
                    const member = values[0].replace('dbe$mem-', '');
                    const guildId = values[1];
                    const guild = await this.client.guilds.fetch(guildId)
                    return await guild.members.fetch(member);
                } else if (value.startsWith('dbe$usr-')) {
                    const user = value.replace('dbe$usr-', '');
                    return await this.client.users.fetch(user);
                } else if (value.startsWith('dbe$msg-')) {
                    const values = value.split('_');
                    const message = values[0].replace('dbe$msg-', '');
                    const channel = values[1];
                    return await (await this.client.channels.fetch(channel))?.messages.fetch(message);
                } else if (value.startsWith('dbe$ch-')) {
                    const channel = value.replace('dbe$ch-', '');
                    return await this.client.channels.fetch(channel);
                } else if (value.startsWith('dbe$r-')) {
                    const values = value.split('_');
                    const role = values[0].replace('dbe$r-', '');
                    const guildId = values[1];
                    const guild = await this.client.guilds.fetch(guildId)
                    return await guild.roles.fetch(role);
                } else if (value.startsWith('dbe$s-')) {
                    const guildId = value.replace('dbe$s-', '');
                    return await this.client.guilds.fetch(guildId);
                } else if (value.startsWith('dbe$e-')) {
                    const values = value.split('_');
                    const emoji = values[0].replace('dbe$e-', '');
                    const guildId = values[1];
                    const guild = await this.client.guilds.fetch(guildId)
                    return await guild.emojis.fetch(emoji);
                } else {
                    return value;
                }
            } else if (Array.isArray(value)) {
                for (let index = 0; index < value.length; index++) {
                    value[index] = await this.parse(value[index]);
                }
                return value;
            } else if (typeof value === 'object') {
                const obj = {};
                for (const key in value)
                    obj[key] = await this.parse(value[key]);
                return obj;
            } else if (value.type === 'embed') {
                return new EmbedBuilder(value.data);
            } else {
                return value;
            }
        } catch {}
    };

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