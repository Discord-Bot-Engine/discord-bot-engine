import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";
import {Events} from "discord.js";
import {ActionManager} from "../classes/ActionManager.js";

export default class Wait {
    static type = "Wait"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Mode"></dbe-label>
            <dbe-select name="mode" class="col-span-3" value="Persistent" values="Persistent,Temporary"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Seconds"></dbe-label>
            <dbe-input name="sec" class="col-span-3"></dbe-input>
        </div>
    `
    static async load(context) {
        if(!Bot.initWaits) {
            Bot.initWaits = true
            Bot.client.on(Events.ClientReady, async () => {
                const raw = await Bot.getData(`$WAITS$$$`);
                if (!raw) return;
                const date = Date.now()
                const data = JSON.parse(raw)
                const triggerIds = data.triggerIds
                Object.keys(triggerIds).forEach(triggerId => {
                    triggerIds[triggerId].actionIds.forEach(async action => {
                        if (date >= action.timestamp) {
                            triggerIds[triggerId].actionIds = triggerIds[triggerId].actionIds.filter(act => act.id !== action.id);
                            const t = Bot.triggers.find(t => t.id === triggerId)
                            const actionManager = t.lastManager ?? new ActionManager(t)
                            for (const key in (triggerIds[triggerId].variables ?? {})) {
                                const val = await Bot.restore(triggerIds[triggerId].variables[key])
                                actionManager.setVariable(key, val);
                            }
                            actionManager.runNext(action.id, `action`)
                        } else {
                            setTimeout(async () => {
                                triggerIds[triggerId].actionIds = triggerIds[triggerId].actionIds.filter(act => act.id !== action.id);
                                const t = Bot.triggers.find(t => t.id === triggerId)
                                const actionManager = t.lastManager ?? new ActionManager(t)
                                for (const key in (triggerIds[triggerId].variables ?? {})) {
                                    actionManager.setVariable(key, await Bot.restore(triggerIds[triggerId].variables[key]));
                                }
                                actionManager.runNext(action.id, `action`)
                            }, action.timestamp - date)
                        }
                    })
                })
                await Bot.setData(`$WAITS$$$`, JSON.stringify({
                    triggerIds: triggerIds
                }))
            })
        }
    }
    static async run({id, data, actionManager, getVariable}) {
        const temp = data.get("mode") === "Temporary"
        const seconds = Number(data.get("sec")) * 1000
        if(!temp) {
            const now = new Date();
            const timestamp = new Date(now.getTime() + seconds).getTime();
            const variables = {}
            actionManager.variables.keys().forEach(key => {
                variables[key] = Bot.serialize(getVariable(key))
            })
            const raw = await Bot.getData(`$WAITS$$$`);
            if(raw) {
                const data = JSON.parse(raw)
                data.triggerIds ??= {}
                data.triggerIds[actionManager.trigger.id] ??= {
                    actionIds: [],
                    variables,
                }
                if(!data.triggerIds[actionManager.trigger.id].actionIds.find(act => act.id === id))
                    data.triggerIds[actionManager.trigger.id].actionIds.push({
                        id,
                        timestamp
                    })
                await Bot.setData(`$WAITS$$$`, JSON.stringify({
                    triggerIds: data.triggerIds,
                }))
            } else {
                await Bot.setData(`$WAITS$$$`, JSON.stringify({
                    triggerIds: {
                        [actionManager.trigger.id]: {
                            actionIds: [{
                                id,
                                timestamp
                            }],
                            variables,
                        }
                    },
                }))
            }
        }
        setTimeout(async () => {
            const raw = await Bot.getData(`$WAITS$$$`);
            if(raw) {
                const data = JSON.parse(raw)
                const el = data.triggerIds[actionManager.trigger.id]?.actionIds.find(act => act.id === id)
                if (el)
                    data.triggerIds[actionManager.trigger.id].actionIds = data.triggerIds[actionManager.trigger.id].actionIds.filter(act => act.id !== el.id)
                await Bot.setData(`$WAITS$$$`, JSON.stringify({
                    triggerIds: data.triggerIds,
                }))
            }
            actionManager.runNext(id, "action")
        }, seconds)
    }
}