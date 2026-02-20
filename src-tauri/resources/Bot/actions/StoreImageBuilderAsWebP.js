
export default class StoreImageBuilderAsWebP {
    static type = "Store Image Builder As WebP";
    static variableTypes = ["Image Builder", "Buffer"];
    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Image builder"></dbe-label>
        <dbe-variable-list name="builder" class="col-span-3" variableType="Image Builder"></dbe-variable-list>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Store webp buffer in variable"></dbe-label>
        <dbe-variable-list name="value" class="col-span-3" variableType="Buffer"></dbe-variable-list>
    </div>
    `;
    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const builder = getVariable(data.get("builder"));
        const value = data.get("value");
        setVariable(value, await builder.build())
        actionManager.runNext(id, "action")

    }
}
