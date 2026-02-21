export default class ReplaceText {
    static type = "Replace Text"
    static variableTypes = ["Text"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Base text"></dbe-label>
            <dbe-input name="base" class="col-span-3" value=""></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Text"></dbe-label>
            <dbe-input name="text" class="col-span-3" value=""></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Replace with"></dbe-label>
            <dbe-input name="replace" class="col-span-3" value=""></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store text in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Text"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable}) {
        const base = data.get("base")
        const text = data.get("text")
        const replace = data.get("replace")
        setVariable(data.get("value"), base.replaceAll(text, replace));
        actionManager.runNext(id, "action")
    }
}