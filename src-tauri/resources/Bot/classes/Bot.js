import {Debugger} from "./Debugger.js";
import * as fs from "node:fs";
import path from "node:path"
import {Trigger} from "./Trigger.js";
import Client from "./Client.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {Extension} from "./Extension.js";
import extensions from "../data/extensions.json" with { type: "json" };
import {EmbedBuilder, Collection, GuildMember, User, Guild, Message, BaseChannel, Role, GuildEmoji} from "discord.js";
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

    async restore(value) {
        try {
            if (typeof value == "string") {
                if (value.startsWith("big-")) {
                    const number = value.replace("big-", "");
                    return BigInt(number);
                } else if (value.startsWith("mem-")) {
                    const values = value.split("_");
                    const member = values[0].replace("mem-", "");
                    const server = values[1];
                    return await this.client.guilds.resolve(server).members.fetch(member);
                } else if (value.startsWith("usr-")) {
                    const user = value.replace("usr-", "");
                    return await this.client.users.fetch(user);
                } else if (value.startsWith("msg-")) {
                    const values = value.split("_");
                    const message = values[0].replace("msg-", "");
                    const channel = values[1];
                    return await (await this.client.channels.fetch(channel))?.messages.fetch(message);
                } else if (value.startsWith("ch-")) {
                    const channel = value.replace("ch-", "");
                    return await this.client.channels.fetch(channel);
                } else if (value.startsWith("r-")) {
                    const values = value.split("_");
                    const role = values[0].replace("r-", "");
                    const server = values[1];
                    return this.client.guilds.resolve(server).roles.resolve(role);
                } else if (value.startsWith("s-")) {
                    const server = value.replace("s-", "");
                    return this.client.guilds.resolve(server);
                } else if (value.startsWith("e-")) {
                    const emoji = value.replace("e-", "");
                    return this.client.emojis.resolve(emoji);
                } else {
                    return value;
                }
            } else if (Array.isArray(value)) {
                for (let index = 0; index < value.length; index++) {
                    value[index] = await this.restore(value[index]);
                };
                return value;
            } else if (value.type === "embed") {
                return new EmbedBuilder(value.data);
            } else if (value.type === "collection") {
                const col = new Collection()
                for (const key in value.data) {
                    col.set(key, await this.restore(value.data[key]));
                }
                return col;
            } else if(typeof value === "object") {
                for (const key in value) {
                    value[key] = await this.restore(value[key]);
                }
                return value
            } else {
                return value;
            }
        } catch { }
    };

    serialize(value) {
        if (Array.isArray(value)) {
            const arr = [];
            for (const el of value) {
                arr.push(this.serialize(el));
            }
            return arr;
        } else if (typeof value == "object" && value && !value.toDBEString) {
            const obj = {};
            for (const key in value) {
                obj[key] = this.serialize(value[key]);
            }
            return obj;
        } else {
            return value?.toDBEString?.() ?? value;
        }
    };
}
export const Bot = new BotClass()
Reflect.defineProperty(BigInt.prototype, "toDBEString", {
    value() {
        return `big-${this}`;
    }
});
Reflect.defineProperty(Collection.prototype, "toDBEString", {
    value() {
        const obj = {}
        this.keys().forEach((key) => {
            obj[key] = Bot.serialize(this.get(key))
        })
        return { type: "collection", data: obj };
    }
});
Reflect.defineProperty(EmbedBuilder.prototype, "toDBEString", {
    value() {
        return { type: "embed", data: this.data };
    }
});
Reflect.defineProperty(GuildMember.prototype, "toDBEString", {
    value() {
        return `mem-${this.id}_${this.guild.id}`;
    }
});
Reflect.defineProperty(User.prototype, "toDBEString", {
    value() {
        return `usr-${this.id}`;
    }
});
Reflect.defineProperty(Guild.prototype, "toDBEString", {
    value() {
        return `s-${this.id}`;
    }
});
Reflect.defineProperty(Message.prototype, "toDBEString", {
    value() {
        return `msg-${this.id}_${this.channel.id}`;
    }
});
Reflect.defineProperty(BaseChannel.prototype, "toDBEString", {
    value() {
        return `ch-${this.id}`;
    }
});
Reflect.defineProperty(Role.prototype, "toDBEString", {
    value() {
        return `r-${this.id}_${this.guild.id}`;
    }
});
Reflect.defineProperty(GuildEmoji.prototype, "toDBEString", {
    value() {
        return `e-${this.id}`;
    }
});