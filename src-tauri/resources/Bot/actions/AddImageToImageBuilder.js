
export default class AddImageToImageBuilder {
    static type = "Add Image To Image Builder";
    static variableTypes = ["Image Builder", "Container"];
    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Image builder or container"></dbe-label>
        <dbe-variable-list name="builder" class="col-span-3" variableType="Image Builder,Container"></dbe-variable-list>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Image URL"></dbe-label>
        <dbe-input name="url" class="col-span-3"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="X offset"></dbe-label>
        <dbe-input name="x" class="col-span-3" value="0"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Y offset"></dbe-label>
        <dbe-input name="y" class="col-span-3" value="0"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Width"></dbe-label>
        <dbe-input name="width" class="col-span-3" value="256"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Height"></dbe-label>
        <dbe-input name="height" class="col-span-3" value="256"></dbe-input>
    </div>

    `;
    static load(context) {}

    static async run({ id, data, actionManager, getVariable }) {
        const url = data.get("url");
        const x = Number(data.get("x"));
        const y = Number(data.get("y"));
        const width = Number(data.get("width"));
        const height = Number(data.get("height"));
        const builder = getVariable(data.get("builder"));
        builder.addTags(tag => tag.setType("img").setProperty("src", url).setProperty("style", `margin-left:${x}px;margin-top:${y}px;`).setProperty("width", width).setProperty("height", height))
        actionManager.runNext(id, "action")

    }
}
