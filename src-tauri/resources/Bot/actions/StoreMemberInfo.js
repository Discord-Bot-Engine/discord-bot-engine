import { Bot } from "../classes/Bot.js"

export default class StoreMemberInfo {
    static type = "Store Member Info"

    static variableTypes = [
        "Member",
        "User",
        "Server",
        "Text",
        "Number",
        "Boolean",
        "Date",
        "List",
        "Role",
        "Channel",
    ]

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                change="(v) => handlers.onChange(v)"
                values="Avatar URL,Banner URL,Communication Disabled Until,Display Color,Display Hex Color,Display Name,Joined At,Nickname,User,User Id,User Tag,Is Bannable,Is Communication Disabled,Is Kickable,Is Manageable,Is Owner,Is Pending,Is Premium Since,Roles,Permissions,Voice State">
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
                variableType="Member,User,Server,Text,Number,Boolean,Date,List,Role,Channel">
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

            if (["Joined At", "Is Premium Since", "Communication Disabled Until"].includes(value)) {
                varlist.setVariableType("Date")
            } else if (["Roles", "Permissions"].includes(value)) {
                varlist.setVariableType("List")
            } else if ([
                "Is Bannable",
                "Is Communication Disabled",
                "Is Kickable",
                "Is Manageable",
                "Is Owner",
                "Is Pending",
            ].includes(value)) {
                varlist.setVariableType("Boolean")
            } else if (["User", "User Id", "User Tag"].includes(value)) {
                varlist.setVariableType("User")
            } else if (["Display Color", "Display Hex Color", "Display Name", "Nickname", "Avatar URL", "Banner URL", "Voice State"].includes(value)) {
                varlist.setVariableType("Text")
            } else {
                varlist.setVariableType("Text")
            }
        }
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const member = getVariable(data.get("member"))
        const info = data.get("info")

        const imgOptions = {
            forceStatic: data.get("static") === "True",
            size: Number(data.get("size")),
            extension: data.get("extension"),
        }

        let value

        switch (info) {
            case "Avatar URL":
                value = member.displayAvatarURL(imgOptions)
                break
            case "Banner URL":
                value = await member.user.fetch().then(u => u.bannerURL(imgOptions))
                break
            case "Communication Disabled Until":
                value = member.communicationDisabledUntil
                break
            case "Display Color":
                value = member.displayColor
                break
            case "Display Hex Color":
                value = member.displayHexColor
                break
            case "Display Name":
                value = member.displayName
                break
            case "Joined At":
                value = member.joinedAt
                break
            case "Nickname":
                value = member.nickname
                break
            case "User":
                value = member.user
                break
            case "User Id":
                value = member.id
                break
            case "User Tag":
                value = member.user.tag
                break
            case "Is Bannable":
                value = member.bannable
                break
            case "Is Communication Disabled":
                value = member.isCommunicationDisabled()
                break
            case "Is Kickable":
                value = member.kickable
                break
            case "Is Manageable":
                value = member.manageable
                break
            case "Is Owner":
                value = member.id === member.guild.ownerId
                break
            case "Is Pending":
                value = member.pending
                break
            case "Is Premium Since":
                value = member.premiumSince
                break
            case "Roles":
                value = [...member.roles.cache.values()]
                break
            case "Permissions":
                value = member.permissions.toArray()
                break
            case "Voice State":
                value = member.voice
                break
            default:
                value = null
                break
        }

        setVariable(data.get("value"), value)
        actionManager.runNext(id, "action")
    }
}
