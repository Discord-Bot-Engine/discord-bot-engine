export default class AddElementToList {
    static type = "Add Element To List"
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
    static async run({id, data, actionManager, getVariable}) {
        const list = getVariable(data.get("list"))
        list.push(data.get("value"))
        actionManager.runNext(id, "action")
    }
}