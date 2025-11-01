import {Bot} from "../classes/Bot.js";

export default class RunOnEachShard {
    static type = "Run On Each Shard"
    static variableTypes = []
    static outputs = ["action", "each"]
    static html = ``
    static load(context) {
    }
    static async run({id, actionManager}) {
        Bot.client.cluster.broadcastEval(async (client, {trigger, actions, edges}) =>
            {
                const Bot = (await import("../classes/Bot.js")).Bot;
                const Action = (await import("../classes/Action.js")).Action
                const ActionManager = (await import("../classes/ActionManager.js")).ActionManager
                actions = actions.map(action => Action.fromJSON(action))
                const t = Bot.triggers.find(t => t.id === trigger)
                const manager = new ActionManager(t, actions, edges)
                manager.runNext(trigger.id, "each")
            },
            {
                context: {
                    trigger: actionManager.trigger.id,
                    actions: actionManager.actions.map(act => act.toJSON()),
                    edges: actionManager.edges
                }
            }
        )
        actionManager.runNext(id, "action")
    }
}