export default class StoreDate {
    static type = "Store Date"
    static variableTypes = ["Date"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Date"></dbe-label>
            <dbe-input name="date" class="col-span-3" value=""></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store date in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Date"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable}) {
        setVariable(data.get("value"), new Date(data.get("date").trim() || undefined));
        actionManager.runNext(id, "action")
    }
}