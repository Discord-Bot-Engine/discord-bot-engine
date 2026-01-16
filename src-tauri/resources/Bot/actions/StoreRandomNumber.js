export default class StoreRandomNumber {
    static type = "Store Random Number"
    static variableTypes = ["Number"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Min"></dbe-label>
            <dbe-input name="min" class="col-span-3" value="0"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Max"></dbe-label>
            <dbe-input name="max" class="col-span-3" value="10"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store number in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({ id, data, actionManager, setVariable }) {
        const min = Number(data.get("min"))
        const max = Number(data.get("max"))

        const random = Math.floor(Math.random() * (max - min + 1)) + min

        setVariable(data.get("value"), random)
        actionManager.runNext(id, "action")
    }
}
