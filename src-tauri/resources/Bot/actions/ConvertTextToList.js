export default class ConvertTextToList {
    static type = "Convert Text To List"
    static variableTypes = ["List"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Text"></dbe-label>
            <dbe-input name="text" class="col-span-3" value=""></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Separator"></dbe-label>
            <dbe-input name="sep" class="col-span-3" value=","></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store list in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable}) {
        setVariable(data.get("value"), String(data.get("text")).split(data.get("sep")));
        actionManager.runNext(id, "action")
    }
}