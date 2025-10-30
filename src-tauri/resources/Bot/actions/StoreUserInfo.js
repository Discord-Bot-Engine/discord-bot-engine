export default class StoreUserInfo {
    static type = "Store User Info"

    static title(data) {
        return `Store "${data.get("info")}" from user "${data.get("user")}"`;
    }

    static variableTypes = [
        "User",
        "Text",
        "Boolean",
        "Date",
        "Number",
        "Channel"
    ]

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="User"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="user"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                change="(v) => handlers.onChange(v)"
                values="Username,Display Name,Discriminator,Id,Tag,Avatar URL,Banner URL,Accent Color,Is Bot,Is System,Created At,Default Avatar URL,DM Channel">
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
                variableType="Text,Boolean,Date,Number,Channel">
            </dbe-variable-list>
        </div>
    `

    static open(action, handlers) {
        const varlist = document.getElementById("var")
        const imgsettings = document.getElementById("imgsettings")

        handlers.onChange = (value) => {
            if (value?.endsWith("URL")) {
                imgsettings.style.display = ""
            } else {
                imgsettings.style.display = "none"
            }

            if (["Created At"].includes(value)) {
                varlist.setVariableType("Date")
            } else if (["Is Bot", "Is System"].includes(value)) {
                varlist.setVariableType("Boolean")
            } else if (["Accent Color"].includes(value)) {
                varlist.setVariableType("Number")
            } else if (["DM Channel"].includes(value)) {
                varlist.setVariableType("Channel")
            } else {
                varlist.setVariableType("Text")
            }
        }
    }

    static load(context) {}

    static async run({ data, actionManager, getVariable, setVariable }) {
        const user = getVariable(data.get("user"))
        const info = data.get("info")

        const imgOptions = {
            forceStatic: data.get("static") === "True",
            size: Number(data.get("size")),
            extension: data.get("extension"),
        }

        let value

        switch (info) {
            case "Username":
                value = user.username
                break
            case "Display Name":
                value = user.displayName ?? user.username
                break
            case "Discriminator":
                value = user.discriminator
                break
            case "Id":
                value = user.id
                break
            case "Tag":
                value = user.tag
                break
            case "Avatar URL":
                value = user.displayAvatarURL(imgOptions)
                break
            case "Banner URL":
                value = user.bannerURL(imgOptions)
                break
            case "Accent Color":
                value = user.hexAccentColor ?? user.accentColor
                break
            case "Is Bot":
                value = user.bot
                break
            case "Is System":
                value = user.system
                break
            case "Created At":
                value = user.createdAt
                break
            case "Default Avatar URL":
                value = user.defaultAvatarURL
                break
            case "DM Channel":
                value = await user.createDM()
                break
            default:
                value = null
                break
        }

        setVariable(data.get("value"), value)
        actionManager.runNext()
    }
}
