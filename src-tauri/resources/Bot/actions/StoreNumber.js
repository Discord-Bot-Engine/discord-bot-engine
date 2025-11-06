export default class StoreNumber {
    static type = "Store Number"
    static variableTypes = ["Number"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Number"></dbe-label>
            <dbe-input name="num" class="col-span-3" value="0"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store number in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable}) {
        setVariable(data.get("value"), Number(data.get("num")));
        actionManager.runNext(id, "action")
    }
}