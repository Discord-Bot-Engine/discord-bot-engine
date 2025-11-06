export default class StoreText {
    static type = "Store Text"
    static variableTypes = ["Text"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Text"></dbe-label>
            <dbe-input name="text" class="col-span-3" value=""></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store text in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Text"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable}) {
        setVariable(data.get("value"), data.get("text"));
        actionManager.runNext(id, "action")
    }
}