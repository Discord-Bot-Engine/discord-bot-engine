
export default class SendHTTPResponse {
    static type = "Send HTTP Response"
    static variableTypes = ["HTTP Response"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Response"></dbe-label>
            <dbe-variable-list name="res" class="col-span-3" variableType="HTTP Response"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Text"></dbe-label>
            <dbe-input name="text" class="col-span-3" multiline="true"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const res = getVariable(data.get("res"))
        const text = data.get("text")
        res.send(isNaN(text) ? text : Number(text))
        actionManager.runNext(id, "action")
    }
}