import { GuildScheduledEventStatus, GuildScheduledEventEntityType } from "discord.js"

export default class StoreScheduledEventInfo {
    static type = "Store Scheduled Event Info"

    static variableTypes = [
        "Scheduled Event",
        "Channel",
        "Text",
        "User",
        "Member",
        "Date",
        "Boolean",
        "Number",
        "List",
        "Server"
    ]

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Scheduled Event"></dbe-label>
            <dbe-variable-list 
                name="event" 
                class="col-span-3" 
                variableType="Scheduled Event">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3"
                change="(v) => handlers.onChange(v)"
                values="Id,Name,Description,Status,Type,Channel,Location,Creator,Server,Start Time,End Time,Created At,User Count,Subscribers,Image URL,URL">
            </dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                id="var" 
                class="col-span-3"
                variableType="Text">
            </dbe-variable-list>
        </div>
    `

    static open(action, handlers) {
        const varlist = document.getElementById("var")

        handlers.onChange = (value) => {
            if (["Start Time", "End Time", "Created At"].includes(value)) {
                varlist.setVariableType("Date")
            }
            else if (value === "Channel") {
                varlist.setVariableType("Channel")
            }
            else if (value === "Creator") {
                varlist.setVariableType("User")
            }
            else if (value === "Server") {
                varlist.setVariableType("Server")
            }
            else if (value === "User Count") {
                varlist.setVariableType("Number")
            }
            else if (value === "Subscribers") {
                varlist.setVariableType("List")
            }
            else {
                varlist.setVariableType("Text")
            }
        }
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const event = getVariable(data.get("event"))
        const info = data.get("info")

        let value = null

        switch (info) {
            case "Id":
                value = event.id
                break

            case "Name":
                value = event.name
                break

            case "Description":
                value = event.description
                break

            case "Status": {
                const enumName = Object.keys(GuildScheduledEventStatus)
                    .find(k => GuildScheduledEventStatus[k] === event.status)

                value = enumName
                    ? enumName
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replace(/\b\w/g, c => c.toUpperCase())
                    : String(event.status)
                break
            }

            case "Type": {
                const enumName = Object.keys(GuildScheduledEventEntityType)
                    .find(k => GuildScheduledEventEntityType[k] === event.entityType)

                value = enumName
                    ? enumName
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replace(/\b\w/g, c => c.toUpperCase())
                    : String(event.entityType)
                break
            }

            case "Channel":
                value = event.channel ?? null
                break

            case "Location":
                value = event.entityMetadata?.location ?? null
                break

            case "Creator":
                value = event.creator ?? null
                break

            case "Server":
                value = event.guild ?? null
                break

            case "Start Time":
                value = event.scheduledStartAt ?? null
                break

            case "End Time":
                value = event.scheduledEndAt ?? null
                break

            case "Created At":
                value = event.createdAt ?? null
                break

            case "User Count":
                value = event.userCount ?? 0
                break

            case "Subscribers": {
                const subscribers = await event.fetchSubscribers({
                    withMember: true
                }).catch(() => null)

                if (!subscribers) {
                    value = []
                    break
                }

                value = [...subscribers.values()]
                    .map(sub => sub.member)
                    .filter(Boolean)

                break
            }

            case "Image URL":
                value = event.imageURL?.() ?? null
                break

            case "URL":
                value = event.url ?? null
                break

            default:
                value = null
                break
        }

        setVariable(data.get("value"), value)
        actionManager.runNext(id, "action")
    }
}
