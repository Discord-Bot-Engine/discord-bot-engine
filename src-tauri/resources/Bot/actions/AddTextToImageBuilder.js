
export default class AddTextToImageBuilder {
    static type = "Add Text To Image Builder";
    static variableTypes = ["Image Builder"];
    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Image builder"></dbe-label>
        <dbe-variable-list name="builder" class="col-span-3" variableType="Image Builder"></dbe-variable-list>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Text"></dbe-label>
        <dbe-input name="text" class="col-span-3"></dbe-input>
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
        <dbe-label name="Font family"></dbe-label>
        <dbe-input name="font" class="col-span-3" value="Arial"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Font size"></dbe-label>
        <dbe-input name="size" class="col-span-3" value="100"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Font color"></dbe-label>
        <dbe-color name="color" class="col-span-3" value="#000000"></dbe-color>
    </div>

    `;
    static load(context) {}

    static async run({ id, data, actionManager, getVariable }) {
        const text = data.get("text");
        const x = Number(data.get("x"));
        const y = Number(data.get("y"));
        const font = data.get("font");
        const size = Number(data.get("size"));
        const color = data.get("color");
        const builder = getVariable(data.get("builder"));
        builder.addTags(tag => tag.setType("p").setProperty("style", `margin-left:${x}px;margin-top:${y}px;color:${color};font-size:${size}px;font-family:${font};word-wrap:break-word;`).addText(text))
        actionManager.runNext(id, "action")

    }
}
