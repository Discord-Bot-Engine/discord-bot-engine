import {Bot} from "../classes/Bot.js";

export default class RunOnEachShard {
    static type = "Run On Each Shard"
    static title(data) {
        return `Run ${data.get("actions").length} actions on each shard`
    }
    static variableTypes = []
    static html = `
        <dbe-action-list name="Actions" title="Actions"></dbe-action-list>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const actions = data.get("actions")
        Bot.client.cluster.broadcastEval(async (client, {trigger, name, actions}) =>
            {
                const Bot = (await import("../classes/Bot.js")).Bot;
                const Action = (await import("../classes/Action.js")).Action
                const ActionManager = (await import("../classes/ActionManager.js")).ActionManager
                actions = actions.map(action => Action.fromJSON(action))
                const t = Bot.triggers.find(t => t.id === trigger)
                const manager = new ActionManager(t, actions)
                manager.runNext()
            },
            {
                context: {
                    trigger: actionManager.trigger.id,
                    name: actionManager.name,
                    actions: actions.map(act => act.toJSON())
                }
            }
        )
        actionManager.runNext()
    }
}