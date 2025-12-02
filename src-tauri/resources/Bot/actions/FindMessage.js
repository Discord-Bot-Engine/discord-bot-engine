export default class FindMessage {
    static type = "Find Message"
    static variableTypes = ["Message", "Channel"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Id"></dbe-label>
            <dbe-input name="value" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message in variable"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const message = data.get("value")
        const channel = getVariable(data.get("channel"))
        setVariable(data.get("message"), await channel.messages.fetch(message).catch(() => {}))
        actionManager.runNext(id, "action")
    }
}