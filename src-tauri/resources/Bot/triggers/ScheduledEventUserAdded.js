import { Events } from "discord.js"

export default class ScheduledEventUserAdded {
    static type = "Scheduled Event User Added"
    static variableTypes = ["Scheduled Event", "User"]

    static defaultVariables = [
        { name: "event", type: "Scheduled Event", element: "event" },
        { name: "user", type: "User", element: "user" }
    ]

    static event = Events.GuildScheduledEventUserAdd
    static runIf = () => true

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store event in variable"></dbe-label>
            <dbe-variable-list name="event" class="col-span-3" variableType="Scheduled Event"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
    `

    static load() {}

    static async run({ id, data, actionManager, setVariable }, event, user) {
        setVariable(data.get("event"), event)
        setVariable(data.get("user"), user)
        actionManager.runNext(id, "action")
    }
}
