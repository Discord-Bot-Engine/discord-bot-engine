
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
    <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Roundness"></dbe-label>
        <dbe-input name="roundness" class="col-span-3" value="0"></dbe-input>
    </div>
     <div class="grid grid-cols-4 items-center gap-4">
        <dbe-label name="Animation"></dbe-label>
        <dbe-select name="animation" class="col-span-3" value="None" values="None,Fade,Swipe From Left,Swipe From Right,Swipe From Top,Swipe From Bottom,Fill From Left,Fill From Right,Fill From Top,Fill From Bottom,Fill"></dbe-select>
    </div>
    `;
    static load(context) {}

    static async run({ id, data, actionManager, getVariable }) {
        const url = data.get("url");
        const x = Number(data.get("x"));
        const y = Number(data.get("y"));
        const width = Number(data.get("width"));
        const height = Number(data.get("height"));
        const roundness = Number(data.get("roundness")) / 2;
        const animation = data.get("animation");
        const builder = getVariable(data.get("builder"));
        if(animation !== "None")
            builder.duration = 3
        const animations = {
            "Fade": "animation-name:fade;opacity:0;",
            "Swipe From Left": "animation-name:swipeLeft;transform:translateX(-1000000px);",
            "Swipe From Right": "animation-name:swipeRight;transform:translateX(1000000px);",
            "Swipe From Top": "animation-name:swipeTop;transform:translateY(-1000000px);",
            "Swipe From Bottom": "animation-name:swipeBottom;transform:translateY(1000000px);",
            "Fill From Left": "animation-name:fillHorizontal;transform-origin: left center;transform:scaleX(0);",
            "Fill From Right": "animation-name:fillHorizontal;transform-origin: right center;transform:scaleX(0);",
            "Fill From Top": "animation-name:fillVertical;transform-origin: center top;transform:scaleY(0);",
            "Fill From Bottom": "animation-name:fillHorizontal;transform-origin: center bottom;transform:scaleY(0);",
            "Fill": "animation-name:fill;transform-origin: center center;transform:scale(0);",
            "None": ""
        }
        builder.addTags(tag => tag.setType("img").setProperty("src", url).setProperty("style", `margin-left:${x}px;margin-top:${y}px;border-radius:${roundness}%;animation-duration:3s;animation-delay:1s;${animations[animation]}`).setProperty("width", width).setProperty("height", height))
        actionManager.runNext(id, "action")

    }
}
