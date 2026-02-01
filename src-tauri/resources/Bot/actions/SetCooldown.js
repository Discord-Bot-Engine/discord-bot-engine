import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";
import {Events} from "discord.js";
import {ActionManager} from "../classes/ActionManager.js";

export default class SetCooldown {
    static type = "Set Cooldown"
    static variableTypes = ["Member", "User", "Number"]
    static outputs = ["action", "on cooldown", "on end"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member or user"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member,User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Seconds"></dbe-label>
            <dbe-input name="sec" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store time remaining in variable"></dbe-label>
            <dbe-variable-list name="remaining" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
    `

    static async load(context) {
        if (!Bot.initCooldowns) {
            Bot.initCooldowns = true
            Bot.client.on(Events.ClientReady, async () => {
                const raw = await Bot.getData(`$COOLDOWNS$$$`);
                if (!raw) return;
                const date = Date.now()
                const data = JSON.parse(raw)
                const triggerIds = data.triggerIds
                Object.keys(triggerIds).forEach(triggerId => {
                    Object.keys(triggerIds[triggerId].actionIds).forEach(actionId => {
                        Object.keys(triggerIds[triggerId].actionIds[actionId].members).forEach(async memberId => {
                            const member = triggerIds[triggerId].actionIds[actionId].members[memberId]
                            if (date >= member.timestamp) {
                                delete triggerIds[triggerId].actionIds[actionId].members[memberId]
                                const t = Bot.triggers.find(t => t.id === triggerId)
                                const actionManager = t.lastManager ?? new ActionManager(t)
                                for (const key in (triggerIds[triggerId].variables ?? {})) {
                                    const val = await Bot.restore(triggerIds[triggerId].variables[key])
                                    actionManager.setVariable(key, val);
                                }
                                actionManager.runNext(actionId, `on end`)
                            } else {
                                setTimeout(async () => {
                                    delete triggerIds[triggerId].actionIds[actionId].members[memberId]
                                    const t = Bot.triggers.find(t => t.id === triggerId)
                                    const actionManager = t.lastManager ?? new ActionManager(t)
                                    for (const key in (triggerIds[triggerId].variables ?? {})) {
                                        actionManager.setVariable(key, await Bot.restore(triggerIds[triggerId].variables[key]));
                                    }
                                    actionManager.runNext(actionId, `on end`)
                                }, member.timestamp - date)
                            }
                        })
                    })
                })
                await Bot.setData(`$COOLDOWNS$$$`, JSON.stringify({
                    triggerIds: triggerIds,
                }))
            })
        }
    }

    static async run({id, data, actionManager, getVariable, setVariable}) {
        const seconds = Number(data.get("sec")) * 1000
        const member = getVariable(data.get("member"))
        let isOnCooldown = false
        const now = new Date();
        const timestamp = new Date(now.getTime() + seconds).getTime();
        const variables = {}
        actionManager.variables.keys().forEach(key => {
            variables[key] = Bot.serialize(getVariable(key))
        })
        const raw = await Bot.getData(`$COOLDOWNS$$$`);
        if (raw) {
            const data = JSON.parse(raw)
            isOnCooldown = data.triggerIds?.[actionManager.trigger.id]?.actionIds[id]?.members[`${member.guild?.id ?? 'global'}${member.id}`]
            data.triggerIds ??= {}
            data.triggerIds[actionManager.trigger.id] ??= {
                actionIds: {},
                variables
            }
            if (!data.triggerIds[actionManager.trigger.id].actionIds[id])
                data.triggerIds[actionManager.trigger.id].actionIds[id] = {
                    members: {
                        [`${member.guild?.id ?? 'global'}${member.id}`]: {
                            timestamp
                        }
                    }
                }
            if (!isOnCooldown) data.triggerIds[actionManager.trigger.id].actionIds[id].members[`${member.guild?.id ?? 'global'}${member.id}`] = {timestamp}
            await Bot.setData(`$COOLDOWNS$$$`, JSON.stringify({
                triggerIds: data.triggerIds,
            }))
        } else {
            await Bot.setData(`$COOLDOWNS$$$`, JSON.stringify({
                triggerIds: {
                    [actionManager.trigger.id]: {
                        actionIds: {
                            [id]: {
                                members: {
                                    [`${member.guild?.id ?? 'global'}${member.id}`]: {
                                        timestamp
                                    }
                                }
                            }
                        },
                        variables,
                    }
                },
            }))
        }
        if (isOnCooldown) {
            const cooldowns = JSON.parse(raw)
            isOnCooldown = false
            const now = new Date()
            setVariable(data.get("remaining"), Math.round((cooldowns.triggerIds[actionManager.trigger.id].actionIds[id].members[`${member.guild?.id ?? 'global'}${member.id}`].timestamp - now.getTime()) / 1000 * 10) / 10)
            return actionManager.runNext(id, `on cooldown`)
        } else {
            isOnCooldown = true
            actionManager.runNext(id, `action`)
        }
        setTimeout(async () => {
            const raw = await Bot.getData(`$COOLDOWNS$$$`);
            if (raw) {
                const data = JSON.parse(raw)
                const el = data.triggerIds[actionManager.trigger.id]?.actionIds[id].members[`${member.guild?.id ?? 'global'}${member.id}`]
                if (el)
                    delete data.triggerIds[actionManager.trigger.id]?.actionIds[id].members[`${member.guild?.id ?? 'global'}${member.id}`]
                await Bot.setData(`$COOLDOWNS$$$`, JSON.stringify({
                    triggerIds: data.triggerIds,
                }))
            }
            actionManager.runNext(id, "on end")
        }, seconds)
    }
}