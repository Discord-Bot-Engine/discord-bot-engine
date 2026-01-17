
import {ActionManager} from "../classes/ActionManager.js";
import {Bot} from "../classes/Bot.js";
import {
    TextDisplayBuilder,
    SectionBuilder,
    MediaGalleryBuilder,
    FileBuilder,
    SeparatorBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ContainerBuilder,
    AttachmentBuilder,
    SeparatorSpacingSize,
    ButtonStyle,
    ComponentType,
    MessageFlags, Events,
} from "discord.js"

export default class ReactionListener {
    static type = "Reaction Listener"
    static variableTypes = ["Message", "User", "Member", "Channel", "Server", "Reaction"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Message"></dbe-label>
            <dbe-variable-list name="origin" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Mode"></dbe-label>
            <dbe-select name="mode" class="col-span-3" value="Persistent" values="Persistent,Temporary"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store reaction in variable"></dbe-label>
            <dbe-variable-list name="reaction" class="col-span-3" variableType="Reaction"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
         <dbe-list name="emojis" title="Emojis" modalId="emojisModal" itemTitle="async (item, i) => item.data.get('emoji') ?? await App.translate('Emoji', App.selectedLanguage)+' #'+i"></dbe-list>
        <template id="emojisModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Emoji"></dbe-label>
                <dbe-input name="emoji" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Add reaction?"></dbe-label>
            <dbe-select name="add" class="col-span-3" value="True" values="True,False"></dbe-select>
        </div>
        </template>
    `
    static async close(context) {
        const outputs = []
        context.data.get("emojis").forEach(({data}) => {
            outputs.push(`${data.get("emoji")} added`)
            outputs.push(`${data.get("emoji")} removed`)
        })
        context.outputs = ["action", ...outputs]
    }
    static load(context) {
        if(!Bot.initReactions) {
            Bot.initReactions = true
            Bot.client.on(Events.MessageReactionAdd, async (reaction, user) => {
                if(user.id === Bot.client.user.id) return;
                if(reaction.partial) await reaction.fetch();
                const raw = await Bot.getData(`$REACTIONS$$$${reaction.message.channel.id}${reaction.message.id}`);
                if(!raw) return;
                const data = JSON.parse(raw)
                const triggerIds = data.triggerIds
                Object.keys(triggerIds).forEach(triggerId => {
                    triggerIds[triggerId].actionIds.forEach(async actionId => {
                        const t = Bot.triggers.find(t => t.id === triggerId)
                        const actionManager = t.lastManager ?? new ActionManager(t)
                        for (const key in (data.variables ?? {})) {
                            actionManager.setVariable(key, await Bot.restore(data.variables[key]));
                        }
                        const react = data.data["reaction"]
                        const mem = data.data["member"]
                        const u = data.data["user"]
                        const ch = data.data["channel"]
                        const sv = data.data["server"]
                        const emojis = data.emojis;
                        const op = reaction.emoji.id ? emojis[reaction.emoji.id] : emojis[reaction.emoji.name];
                        actionManager.setVariable(react, reaction)
                        actionManager.setVariable(mem, await reaction.message.guild.members.fetch(user.id))
                        actionManager.setVariable(u, user)
                        actionManager.setVariable(ch, reaction.message.channel)
                        actionManager.setVariable(sv, reaction.message.guild)
                        actionManager.runNext(actionId, `${op} added`)
                    })
                })
            })
            Bot.client.on(Events.MessageReactionRemove, async (reaction, user) => {
                if(user.id === Bot.client.user.id) return;
                if(reaction.partial) await reaction.fetch();
                const raw = await Bot.getData(`$REACTIONS$$$${reaction.message.channel.id}${reaction.message.id}`);
                if(!raw) return;
                const data = JSON.parse(raw)
                const triggerIds = data.triggerIds
                Object.keys(triggerIds).forEach(triggerId => {
                    triggerIds[triggerId].actionIds.forEach(async actionId => {
                        const t = Bot.triggers.find(t => t.id === triggerId)
                        const actionManager = t.lastManager ?? new ActionManager(t)
                        for (const key in (data.variables ?? {})) {
                            actionManager.setVariable(key, await Bot.restore(data.variables[key]));
                        }
                        const react = data.data["reaction"]
                        const mem = data.data["member"]
                        const u = data.data["user"]
                        const ch = data.data["channel"]
                        const sv = data.data["server"]
                        const emojis = data.emojis;
                        const op = reaction.emoji.id ? emojis[reaction.emoji.id] : emojis[reaction.emoji.name];
                        actionManager.setVariable(react, reaction)
                        actionManager.setVariable(mem, await reaction.message.guild.members.fetch(user.id))
                        actionManager.setVariable(u, user)
                        actionManager.setVariable(ch, reaction.message.channel)
                        actionManager.setVariable(sv, reaction.message.guild)
                        actionManager.runNext(actionId, `${op} removed`)
                    })
                })
            })
        }
    }
    static async run({id, data, rawData, actionManager, getVariable, setVariable}) {
        const temp = data.get("mode") === "Temporary"
        const emojis = data.get("emojis")
        const origin = getVariable(data.get("origin"))
        const map = {};
        for (const emoji of emojis) {
            const data = emoji.data;
            const i = emojis.indexOf(emoji);
            if (data.get("add") === "True") {
                await origin.react(data.get("emoji"));
                map[data.get("emoji")] = rawData.get("emojis")[i].data.get("emoji");
            }
        }
        if(!temp) {
            const variables = {}
            actionManager.variables.keys().forEach(key => {
                variables[key] = Bot.serialize(getVariable(key))
            })
            const raw = await Bot.getData(`$REACTIONS$$$${origin.channel.id}${origin.id}`);
            if(raw) {
                const data = JSON.parse(raw)
                data.triggerIds[actionManager.trigger.id] ??= { actionIds: [] }
                if(data.triggerIds[actionManager.trigger.id].actionIds.indexOf(id) === -1)
                    data.triggerIds[actionManager.trigger.id].actionIds.push(id)
                await Bot.setData(`$REACTIONS$$$${origin.channel.id}${origin.id}`, JSON.stringify({
                    triggerIds: data.triggerIds,
                    variables,
                    emojis: map,
                    data: {
                        reaction: data.get("reaction"),
                        member: data.get("member"),
                        user: data.get("user"),
                        channel: data.get("channel"),
                        server: data.get("server")
                    }
                }))
            } else {
                await Bot.setData(`$REACTIONS$$$${origin.channel.id}${origin.id}`, JSON.stringify({
                    triggerIds: {
                        [actionManager.trigger.id]: {
                            actionIds: [id]
                        }
                    },
                    variables,
                    emojis: map,
                    data: {
                        reaction: data.get("reaction"),
                        member: data.get("member"),
                        user: data.get("user"),
                        channel: data.get("channel"),
                        server: data.get("server")
                    }
                }))
            }
        } else {
            const collector = origin.createReactionCollector({dispose: true, filter: (reaction, user) => user.id !== Bot.client.user.id})
            collector.on("collect", async (reaction, user) => {
                const react = data.get("reaction")
                const mem = data.get("member")
                const u = data.get("user")
                const ch = data.get("channel")
                const sv = data.get("server")
                const op = reaction.emoji.id ? map[reaction.emoji.id] : map[reaction.emoji.name];
                setVariable(react, reaction)
                setVariable(mem, await reaction.message.guild.members.fetch(user.id))
                setVariable(u, user)
                setVariable(ch, reaction.message.channel)
                setVariable(sv, reaction.message.guild)
                actionManager.runNext(id, `${op} added`);
            })
            collector.on("remove", async (reaction, user) => {
                const react = data.get("reaction")
                const mem = data.get("member")
                const u = data.get("user")
                const ch = data.get("channel")
                const sv = data.get("server")
                const op = reaction.emoji.id ? map[reaction.emoji.id] : map[reaction.emoji.name];
                setVariable(react, reaction)
                setVariable(mem, await reaction.message.guild.members.fetch(user.id))
                setVariable(u, user)
                setVariable(ch, reaction.message.channel)
                setVariable(sv, reaction.message.guild)
                actionManager.runNext(id, `${op} removed`);
            })
        }
        actionManager.runNext(id, "action")
    }
}