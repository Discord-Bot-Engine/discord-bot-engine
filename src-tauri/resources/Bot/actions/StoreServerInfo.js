import { Bot } from "../classes/Bot.js"
export default class StoreServerInfo {
    static type = "Store Server Info"
    static title(data) {
        return `Store "${data.get("info")}" from server "${data.get("server")}"`
    }
    static variableTypes = ["Server", "Voice Channel", "Member", "Number", "List", "Boolean", "Date", "Text", "Text Channel", "Channel"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select name="info" class="col-span-3" onChange="(v) => handlers.onChange(v)" values="Banner URL,Discovery Splash URL,Icon URL,Splash URL,Widget Image URL,Afk Channel,Afk Timeout,Approximate Member Count,Approximate Presence Count,Auto Moderation Rules,Is Available,Bans,Channels,Commands,Creation Date,Default Message Notifications,Description,Emojis,Explicit Content Filter,Id,Invites,Bot Join Date,Is Large,Preferred Locale,Maximum Bitrate,Maximum Members,Maximum Presences,Max Stage Video Channel Users,Max Video Channel Users,Member Count,Members,MFA Level,Name,Name Acronym,NSFW Level,Owner,Is Partnered,Boost Tier,Has Boost Progress Bar,Boosts Number,Presences,Public Updates Channel,Roles,Rules Channel,Safety Alerts Channel,Scheduled Events,Soundboard Sounds,Stage Instances,Stickers,System Channel,Vanity URL Code,Vanity URL Uses,Verification Level,Is Verified,Voice States,Widget Channel,Is Widget Enabled"></dbe-select>
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
            <dbe-variable-list name="value" id="var" class="col-span-3" variableType="Voice Channel,Member,Number,List,Boolean,Date,Text,Text Channel,Channel"></dbe-variable-list>
        </div>
    `
    static open(trigger, handlers) {
        const varlist = document.getElementById('var')
        const imgsettings = document.getElementById('imgsettings')
        handlers.onChange = (value) => {
            if(value?.endsWith("URL")) {
                imgsettings.style.display = ""
            } else {
                imgsettings.style.display = "none";
            }
            if(value === "Afk Channel") {
                varlist.setVariableType("Voice Channel")
            } else if(["Afk Timeout","Approximate Member Count","Approximate Presence Count", 'Maximum Bitrate', 'Maximum Members', 'Maximum Presences', 'Max Stage Video Channel Users', 'Max Video Channel Users', 'Member Count', "Boosts Number", "Vanity URL Uses"].includes(value)) {
                varlist.setVariableType("Number")
            } else if(["Auto Moderation Rules", "Bans", "Channels", "Commands", "Emojis", "Invites", "Members", "Presences", "Roles", "Scheduled Events", "Soundboard Sounds","Stage Instances", "Stickers", "Voice States"].includes(value)) {
                varlist.setVariableType("List")
            } else if(["Bot Join Date", "Creation Date"].includes(value)) {
                varlist.setVariableType("Date")
            } else if(["Is Available", "Is Large", "Is Partnered", "Has Boost Progress Bar", "Is Verified", "Is Widget Enabled"].includes(value)) {
                varlist.setVariableType("Boolean")
            } else if(["Banner URL","Discovery Splash URL","Icon URL","Splash URL","Widget Image URL","Description", "Id", "Name", "Name Acronym", "Vanity URL Code", "Default Message Notifications", "Explicit Content Filter", "MFA Level", "NSFW Level", "Preferred Locale", "Boost Tier", "Verification Level"].includes(value)) {
                varlist.setVariableType("Text")
            } else if(value === "Owner") {
                varlist.setVariableType("Member")
            } else if(["Public Updates Channel", "Rules Channel", "Safety Alerts Channel", "System Channel"].includes(value)) {
                varlist.setVariableType("Text Channel")
            } else if(value === "Widget Channel") {
                varlist.setVariableType("Channel")
            }

        }
    }
    static load(context) {
    }
    static async run({data, actionManager}) {
        let server = actionManager.getVariable(data.get("server"))
        const imgOptions = {
            forceStatic: data.get("static") === "True",
            size: Number(data.get("size")),
            extension: data.get("extension"),
        }
        const info = data.get("info")
        let value
        if(["Approximate Member Count","Approximate Presence Count","Maximum Presences"].includes(info)) {
            server = await Bot.client.guilds.fetch(server.id)
        }
        const words = info.split(" ").filter(el => el != "Is").map(el => el.replace("Creation Date", "createdAt").replace("Bot Join Date", "joinedAt").replace("Boost Tier","premiumTier").replace("Has Boost Progress Bar", "premiumProgressBarEnabled").replace("Boosts Number", "premiumSubscriptionCount"))
        const infoToValue = `${words[0].toLowerCase()}${words.slice(1).join('')}`
        value = server[infoToValue]
        if(infoToValue === "owner")
            value = await server.members.fetch(server.ownerId)
        else if(infoToValue === "vanityURLUses")
            value = await server.fetchVanityData()
        else if(infoToValue === "defaultMessageNotifications") {
            const notificationTypes = {
                0:"All Messages",
                1:"Only Mentions"
            }
            value = notificationTypes[value]
        } else if(infoToValue === "explicitContentFilter") {
            const filterTypes = {
                0:"Disabled",
                1:"Members Without Roles",
                2:"All Members"
            }
            value = filterTypes[value]
        } else if(infoToValue === "mfaLevel") {
            const mfaLevels = {
                0:"None",
                1:"Elevated"
            }
            value = mfaLevels[value]
        } else if(infoToValue === "nsfwLevel") {
            const nsfwLevels = {
                0:"Default",
                1:"Explicit",
                2: "Safe",
                3: "Age Restricted"
            }
            value = nsfwLevels[value]
        } else if(infoToValue === "premiumTier") {
            const tiers = {
                0:"None",
                1:"Tier 1",
                2: "Tier 2",
                3: "Tier 3"
            }
            value = tiers[value]
        } else if(infoToValue === "verificationLevel") {
            const levels = {
                0: "None",
                1: "Low",
                2: "Medium",
                3: "High",
                4: "Very High"
            }
            value = levels[value]
        } else if(infoToValue === "bannerURL") {
            value = server.bannerURL(imgOptions)
        } else if(infoToValue === "iconURL") {
            value = server.iconURL(imgOptions)
        } else if(infoToValue === "discoverySplashURL"){
            value = server.discoverySplashURL(imgOptions)
        } else if(infoToValue === "splashURL"){
            value = server.splashURL(imgOptions)
        } else if(infoToValue === "widgetImageURL"){
            value = server.widgetImageURL(imgOptions)
        } else if(value.cache) {
            if(value.fetch) await value.fetch().catch(() => {})
            value = [...value.cache.values()]
        }
        actionManager.setVariable(data.get("value"), value)
        actionManager.runNext()
    }
}