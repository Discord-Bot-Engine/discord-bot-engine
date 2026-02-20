import {ImageBuilder} from "../classes/ImageBuilder.js";

export default class StoreImageBuilder {
    static type = "Store Image Builder";
    static variableTypes = ["Image Builder"];
    static html = `
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Background"></dbe-label>
        <dbe-input name="background" class="col-span-3"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Width"></dbe-label>
        <dbe-input name="width" class="col-span-3" value="1000"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Height"></dbe-label>
        <dbe-input name="height" class="col-span-3" value="500"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Duration (seconds)"></dbe-label>
        <dbe-input name="duration" class="col-span-3" value="0"></dbe-input>
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Store image builder in variable"></dbe-label>
        <dbe-variable-list name="value" class="col-span-3" variableType="Image Builder"></dbe-variable-list>
    </div>
    `;
    static load(context) {}

    static async run({ id, data, actionManager, setVariable }) {
        const bg = data.get("background");
        const width = Number(data.get("width"));
        const height = Number(data.get("height"));
        const duration = Number(data.get("duration"));
        const value = data.get("value");
        const builder = new ImageBuilder();
        builder
            .setBackground(bg)
            .setWidth(width)
            .setHeight(height)
            .setDuration(duration)
        setVariable(value, builder);
        actionManager.runNext(id, "action")
    }
}
