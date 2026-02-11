import { Events } from "discord.js"

export default class ScheduledEventDeleted {
    static type = "Scheduled Event Deleted"
    static variableTypes = ["Scheduled Event"]

    static defaultVariables = [
        {
            name: "event",
            type: "Scheduled Event",
            element: "event"
        }
    ]

    static event = Events.GuildScheduledEventDelete
    static runIf = () => true

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store event in variable"></dbe-label>
            <dbe-variable-list 
                name="event" 
                class="col-span-3" 
                variableType="Scheduled Event">
            </dbe-variable-list>
        </div>
    `

    static load() {}

    static async run({ id, data, actionManager, setVariable }, event) {
        setVariable(data.get("event"), event)
        actionManager.runNext(id, "action")
    }
}
