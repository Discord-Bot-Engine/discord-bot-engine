export default class StoreList {
    static type = "Store List"
    static title(data) {
        return `Store list in "${data.get("value")}"`
    }
    static variableTypes = ["List"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store list in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, setVariable}) {
        setVariable(data.get("value"), [])
        actionManager.runNext()
    }
}