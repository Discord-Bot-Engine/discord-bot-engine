import { Events } from "discord.js"

export default class ScheduledEventChanged {
    static type = "Scheduled Event Changed"
    static variableTypes = ["Scheduled Event"]

    static defaultVariables = [
        { name: "oldEvent", type: "Scheduled Event", element: "old" },
        { name: "newEvent", type: "Scheduled Event", element: "new" }
    ]

    static event = Events.GuildScheduledEventUpdate
    static runIf = () => true

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store old event in variable"></dbe-label>
            <dbe-variable-list name="old" class="col-span-3"  variableType="Scheduled Event"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store new event in variable"></dbe-label>
            <dbe-variable-list name="new" class="col-span-3" variableType="Scheduled Event"></dbe-variable-list>
        </div>
    `

    static load() {}

    static async run({ id, data, actionManager, setVariable }, oldEvent, newEvent) {
        setVariable(data.get("old"), oldEvent)
        setVariable(data.get("new"), newEvent)
        actionManager.runNext(id, "action")
    }
}
