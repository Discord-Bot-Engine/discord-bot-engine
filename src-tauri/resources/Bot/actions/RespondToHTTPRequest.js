
export default class RespondToHTTPRequest {
    static type = "Respond To HTTP Request"
    static title(data) {
        return `Respond to "${data.get("req")}" HTTP Request`
    }
    static variableTypes = ["HTTP Request"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Request"></dbe-label>
            <dbe-variable-list name="req" class="col-span-3" variableType="HTTP Request"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Text"></dbe-label>
            <dbe-input name="text" class="col-span-3" multiline="true"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable, setVariable}) {
        const req = getVariable(data.get("req"))
        req.send(data.get("text"))
        actionManager.runNext()
    }
}