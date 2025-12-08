import {Bot} from "../classes/Bot.js";
import {ActionManager} from "../classes/ActionManager.js";

export default class RunOnEachShard {
    static type = "Run On Each Shard"
    static variableTypes = []
    static outputs = ["action", "each"]
    static html = ``
    static load(context) {
    }
    static async run({id, actionManager}) {
        Bot.client.cluster.broadcastEval(async (client, {trigger, id}) =>
            {
                const Bot = (await import("../classes/Bot.js")).Bot;
                const ActionManager = (await import("../classes/ActionManager.js")).ActionManager
                const t = Bot.triggers.find(t => t.id === trigger)
                const actionManager = t.lastManager ?? new ActionManager(t)
                actionManager.runNext(id, "each")
            },
            {
                context: {
                    trigger: actionManager.trigger.id,
                    id
                }
            }
        )
        actionManager.runNext(id, "action")
    }
}