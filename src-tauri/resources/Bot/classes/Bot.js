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
import botdata from "../data/data.json" with { type: "json" };
import {EmbedBuilder, Events} from "discord.js";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

class BotClass {
    debugger = null
    triggers = []
    extensions = new Map()
    triggerClasses = []
    actionClasses = []
    extensionClasses = []
    data = new Map()
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
        this.loadFiles()
    }

    attachDebugger() {
        this.debugger = new Debugger(async (triggerId, managerId, actionId) => {
            const t = this.triggers.find(t => t.id === triggerId)
            const manager = t.actionManagers.find(m => m.id === managerId) ?? t.actionManager
            manager.runningActionIndex = manager.actionList.findIndex(act => act.id === actionId)
            manager.runNext(true)
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
        Object.keys(botdata).forEach(async key => this.data.set(key, await this.parse(botdata[key])));
        Object.keys(extensions).forEach(extension => this.extensions.set(extension, Extension.fromJSON(extensions[extension])))
        this.triggerClasses = await Promise.all(fs.readdirSync(triggerClassesPath).filter(file=>file.endsWith(".js")).map(file => import("file://"+path.join(triggerClassesPath, file))))
        this.actionClasses = await Promise.all(fs.readdirSync(actionClassesPath).filter(file=>file.endsWith(".js")).map(file => import("file://"+path.join(actionClassesPath, file))))
        this.extensionClasses = await Promise.all(fs.readdirSync(extensionClassesPath).filter(file=>file.endsWith(".js")).map(file => import("file://"+path.join(extensionClassesPath, file))))
        this.triggerClasses = this.triggerClasses.map(m => m.default)
        this.actionClasses = this.actionClasses.map(m => m.default)
        this.extensionClasses = this.extensionClasses.map(m => m.default)
        this.extensions.keys().forEach(extension => this.extensions.get(extension).load(extension))
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

    serialize(value) {
        if (Array.isArray(value)) {
            const arr = [];
            for (const el of value)
                arr.push(this.serialize(el));
            return arr;
        } else if (typeof value === 'object' && value && !value.toDBEString) {
            const obj = {};
            for (const key in value)
                obj[key] = this.serialize(value[key]);
            return obj;
        }

        return value?.toDBEString?.() ?? value;
    };

    setData(key, value) {
        this.data.set(key, value)
        this.writeDataToFile()
    }

    getData(key) {
        return this.data.get(key);
    }

    writeDataToFile() {
        const data = {}
        this.data.keys().forEach(key => data[key] = this.serialize(this.data.get(key)))
        fs.writeFileSync(path.resolve(__dirname, `../data/botdata.json`), JSON.stringify(data))
    }
}

export const Bot = new BotClass()