
export default class StoreRoleInfo {
    static type = "Store Role Info"

    static title(data) {
        return `Store "${data.get("info")}" from role "${data.get("role")}"`;
    }

    static variableTypes = [
        "Role",
        "Number",
        "Boolean",
        "List",
        "Date",
        "Text",
        "Member",
        "Server",
        "Channel",
    ]

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Role"></dbe-label>
            <dbe-variable-list name="role" class="col-span-3" variableType="role"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                change="(v) => handlers.onChange(v)"
                values="Color,Created At,Is Deleted,Is Editable,Is Hoisted,Icon URL,Id,Is Managed,Is Mentionable,Members,Name,Permissions,Position,Tags,Unicode Emoji">
            </dbe-select>
        </div>

        <div id="imgsettings" class="grid gap-4" style="display: none">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Image Extension"></dbe-label>
                <dbe-input name="extension" class="col-span-3" value="png"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Image Size"></dbe-label>
                <dbe-select name="size" class="col-span-3" value="64" values="16,32,64,128,256,512,1024,2048,4096"></dbe-select>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Force Static?"></dbe-label>
                <dbe-select name="static" class="col-span-3" value="False" values="True,False"></dbe-select>
            </div>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                id="var" 
                class="col-span-3"
                variableType="Number,Boolean,List,Date,Text,Role,Member,Server,Channel">
            </dbe-variable-list>
        </div>
    `

    static open(action, handlers) {
        const varlist = document.getElementById("var");
        const imgsettings = document.getElementById("imgsettings");

        handlers.onChange = (value) => {
            if (value === "Icon URL") {
                imgsettings.style.display = "";
            } else {
                imgsettings.style.display = "none";
            }

            if (["Position"].includes(value)) {
                varlist.setVariableType("Number");
            } else if (["Is Deleted", "Is Editable", "Is Hoisted", "Is Managed", "Is Mentionable"].includes(value)) {
                varlist.setVariableType("Boolean");
            } else if (["Members"].includes(value)) {
                varlist.setVariableType("List");
            } else if (["Created At"].includes(value)) {
                varlist.setVariableType("Date");
            } else if (["Color", "Icon URL", "Id", "Name", "Permissions", "Tags", "Unicode Emoji"].includes(value)) {
                varlist.setVariableType("Text");
            } else {
                varlist.setVariableType("Text");
            }
        }
    }

    static load(context) {}

    static async run({ data, actionManager, getVariable, setVariable }) {
        const role = getVariable(data.get("role"));
        const info = data.get("info");

        const imgOptions = {
            forceStatic: data.get("static") === "True",
            size: Number(data.get("size")),
            extension: data.get("extension"),
        };

        let value;

        switch (info) {
            case "Color":
                value = role.hexColor;
                break;
            case "Created At":
                value = role.createdAt;
                break;
            case "Is Deleted":
                value = role.deleted;
                break;
            case "Is Editable":
                value = role.editable;
                break;
            case "Is Hoisted":
                value = role.hoist;
                break;
            case "Icon URL":
                value = role.iconURL(imgOptions);
                break;
            case "Id":
                value = role.id;
                break;
            case "Is Managed":
                value = role.managed;
                break;
            case "Is Mentionable":
                value = role.mentionable;
                break;
            case "Members":
                value = [...role.members.values()];
                break;
            case "Name":
                value = role.name;
                break;
            case "Permissions":
                value = role.permissions.toArray();
                break;
            case "Position":
                value = role.position;
                break;
            case "Tags":
                value = role.tags;
                break;
            case "Unicode Emoji":
                value = role.unicodeEmoji;
                break;
            default:
                value = null;
                break;
        }

        setVariable(data.get("value"), value);
        actionManager.runNext();
    }
}
