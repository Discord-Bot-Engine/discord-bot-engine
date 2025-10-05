export default class AddElementToList {
    static type = "Add Element To List"
    static title(data) {
        return `Add "${data.get("value")}" to "${data.get("list")}"`
    }
    static variableTypes = ["List"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="List"></dbe-label>
            <dbe-variable-list name="list" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Element"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const list = actionManager.getVariable(data.get("list"))
        list.push(data.get("value"))
        actionManager.runNext()
    }
}