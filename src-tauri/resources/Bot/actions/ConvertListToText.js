export default class ConvertListToText {
    static type = "Convert List To Text"
    static variableTypes = ["List", "Text"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="List"></dbe-label>
            <dbe-variable-list name="list" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Separator"></dbe-label>
            <dbe-input name="sep" class="col-span-3" value=","></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store text in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Text"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const list = getVariable(data.get("list"))
        setVariable(data.get("value"), list.join(data.get("sep")));
        actionManager.runNext(id, "action")
    }
}