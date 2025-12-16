export default class StoreListSize {
    static type = "Store List Size"
    static variableTypes = ["List", "Number"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="List"></dbe-label>
            <dbe-variable-list name="list" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store size in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
`
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const list = getVariable(data.get("list"))
        setVariable(data.get("value"), list.length)
        actionManager.runNext(id, "action")
    }
}