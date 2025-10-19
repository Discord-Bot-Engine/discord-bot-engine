import { Bot } from "../classes/Bot.js"

export default class StoreServerInfo {
    static type = "Store Server Info"

    static title(data) {
        return `Store "${data.get("info")}" from server "${data.get("server")}"`;
    }

    static variableTypes = [
        "Server",
        "Voice Channel",
        "Member",
        "Number",
        "List",
        "Boolean",
        "Date",
        "Text",
        "Text Channel",
        "Channel"
    ];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="server"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                onChange="(v) => handlers.onChange(v)"
                values="Banner URL,Discovery Splash URL,Icon URL,Splash URL,Widget Image URL,Afk Channel,Afk Timeout,Approximate Member Count,Approximate Presence Count,Auto Moderation Rules,Is Available,Bans,Channels,Commands,Creation Date,Default Message Notifications,Description,Emojis,Explicit Content Filter,Id,Invites,Bot Join Date,Is Large,Preferred Locale,Maximum Bitrate,Maximum Members,Maximum Presences,Max Stage Video Channel Users,Max Video Channel Users,Member Count,Members,MFA Level,Name,Name Acronym,NSFW Level,Owner,Is Partnered,Boost Tier,Has Boost Progress Bar,Boosts Number,Presences,Public Updates Channel,Roles,Rules Channel,Safety Alerts Channel,Scheduled Events,Soundboard Sounds,Stage Instances,Stickers,System Channel,Vanity URL Code,Vanity URL Uses,Verification Level,Is Verified,Voice States,Widget Channel,Is Widget Enabled">
            </dbe-select>
        </div>

        <div id="imgsettings" class="grid gap-4" style="display:none">
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
                variableType="Voice Channel,Member,Number,List,Boolean,Date,Text,Text Channel,Channel">
            </dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");
        const imgsettings = document.getElementById("imgsettings");

        handlers.onChange = (value) => {
            // Show/hide image options
            imgsettings.style.display = value?.endsWith("URL") ? "" : "none";

            // Variable type logic
            if (value === "Afk Channel") {
                varlist.setVariableType("Voice Channel");
            } else if (["Afk Timeout", "Approximate Member Count", "Approximate Presence Count", "Maximum Bitrate", "Maximum Members", "Maximum Presences", "Max Stage Video Channel Users", "Max Video Channel Users", "Member Count", "Boosts Number", "Vanity URL Uses"].includes(value)) {
                varlist.setVariableType("Number");
            } else if (["Auto Moderation Rules", "Bans", "Channels", "Commands", "Emojis", "Invites", "Members", "Presences", "Roles", "Scheduled Events", "Soundboard Sounds", "Stage Instances", "Stickers", "Voice States"].includes(value)) {
                varlist.setVariableType("List");
            } else if (["Bot Join Date", "Creation Date"].includes(value)) {
                varlist.setVariableType("Date");
            } else if (["Is Available", "Is Large", "Is Partnered", "Has Boost Progress Bar", "Is Verified", "Is Widget Enabled"].includes(value)) {
                varlist.setVariableType("Boolean");
            } else if (["Banner URL","Discovery Splash URL","Icon URL","Splash URL","Widget Image URL","Description","Id","Name","Name Acronym","Vanity URL Code","Default Message Notifications","Explicit Content Filter","MFA Level","NSFW Level","Preferred Locale","Boost Tier","Verification Level"].includes(value)) {
                varlist.setVariableType("Text");
            } else if (value === "Owner") {
                varlist.setVariableType("Member");
            } else if (["Public Updates Channel","Rules Channel","Safety Alerts Channel","System Channel"].includes(value)) {
                varlist.setVariableType("Text Channel");
            } else if (value === "Widget Channel") {
                varlist.setVariableType("Channel");
            }
        };
    }

    static load(context) {}

    static async run({ data, actionManager, getVariable, setVariable }) {
        let server = getVariable(data.get("server"));
        const info = data.get("info");
        let value;

        const imgOptions = {
            forceStatic: data.get("static") === "True",
            size: Number(data.get("size")),
            extension: data.get("extension"),
        };

        // Some info requires a fresh fetch
        if (["Approximate Member Count", "Approximate Presence Count", "Maximum Presences"].includes(info)) {
            server = await Bot.client.guilds.fetch(server.id);
        }

        switch (info) {
            case "Banner URL":
                value = server.bannerURL(imgOptions);
                break;
            case "Discovery Splash URL":
                value = server.discoverySplashURL(imgOptions);
                break;
            case "Icon URL":
                value = server.iconURL(imgOptions);
                break;
            case "Splash URL":
                value = server.splashURL(imgOptions);
                break;
            case "Widget Image URL":
                value = server.widgetImageURL(imgOptions);
                break;
            case "Afk Channel":
                value = server.afkChannel;
                break;
            case "Afk Timeout":
                value = server.afkTimeout;
                break;
            case "Approximate Member Count":
                value = server.approximateMemberCount;
                break;
            case "Approximate Presence Count":
                value = server.approximatePresenceCount;
                break;
            case "Auto Moderation Rules":
                value = [...server.autoModerationRules.cache.values()];
                break;
            case "Is Available":
                value = server.available;
                break;
            case "Bans":
                value = [...(await server.bans.fetch()).values()];
                break;
            case "Channels":
                value = [...server.channels.cache.values()];
                break;
            case "Commands":
                value = [...server.commands?.cache?.values() ?? []];
                break;
            case "Creation Date":
                value = server.createdAt;
                break;
            case "Default Message Notifications":
                value = {
                    0: "All Messages",
                    1: "Only Mentions"
                }[server.defaultMessageNotifications];
                break;
            case "Description":
                value = server.description;
                break;
            case "Emojis":
                value = [...server.emojis.cache.values()];
                break;
            case "Explicit Content Filter":
                value = {
                    0: "Disabled",
                    1: "Members Without Roles",
                    2: "All Members"
                }[server.explicitContentFilter];
                break;
            case "Id":
                value = server.id;
                break;
            case "Invites":
                value = [...(await server.invites.fetch()).values()];
                break;
            case "Bot Join Date":
                value = server.joinedAt;
                break;
            case "Is Large":
                value = server.large;
                break;
            case "Preferred Locale":
                value = server.preferredLocale;
                break;
            case "Maximum Bitrate":
                value = server.maximumBitrate;
                break;
            case "Maximum Members":
                value = server.maximumMembers;
                break;
            case "Maximum Presences":
                value = server.maximumPresences;
                break;
            case "Max Stage Video Channel Users":
                value = server.maxStageVideoChannelUsers;
                break;
            case "Max Video Channel Users":
                value = server.maxVideoChannelUsers;
                break;
            case "Member Count":
                value = server.memberCount;
                break;
            case "Members":
                value = [...server.members.cache.values()];
                break;
            case "MFA Level":
                value = { 0: "None", 1: "Elevated" }[server.mfaLevel];
                break;
            case "Name":
                value = server.name;
                break;
            case "Name Acronym":
                value = server.nameAcronym;
                break;
            case "NSFW Level":
                value = {
                    0: "Default",
                    1: "Explicit",
                    2: "Safe",
                    3: "Age Restricted"
                }[server.nsfwLevel];
                break;
            case "Owner":
                value = await server.members.fetch(server.ownerId);
                break;
            case "Is Partnered":
                value = server.partnered;
                break;
            case "Boost Tier":
                value = {
                    0: "None",
                    1: "Tier 1",
                    2: "Tier 2",
                    3: "Tier 3"
                }[server.premiumTier];
                break;
            case "Has Boost Progress Bar":
                value = server.premiumProgressBarEnabled;
                break;
            case "Boosts Number":
                value = server.premiumSubscriptionCount;
                break;
            case "Presences":
                value = [...server.presences.cache.values()];
                break;
            case "Public Updates Channel":
                value = server.publicUpdatesChannel;
                break;
            case "Roles":
                value = [...server.roles.cache.values()];
                break;
            case "Rules Channel":
                value = server.rulesChannel;
                break;
            case "Safety Alerts Channel":
                value = server.safetyAlertsChannel;
                break;
            case "Scheduled Events":
                value = [...server.scheduledEvents.cache.values()];
                break;
            case "Soundboard Sounds":
                value = [...server.soundboardSounds.cache.values()];
                break;
            case "Stage Instances":
                value = [...server.stageInstances.cache.values()];
                break;
            case "Stickers":
                value = [...server.stickers.cache.values()];
                break;
            case "System Channel":
                value = server.systemChannel;
                break;
            case "Vanity URL Code":
                value = server.vanityURLCode;
                break;
            case "Vanity URL Uses":
                value = (await server.fetchVanityData()).uses;
                break;
            case "Verification Level":
                value = {
                    0: "None",
                    1: "Low",
                    2: "Medium",
                    3: "High",
                    4: "Very High"
                }[server.verificationLevel];
                break;
            case "Is Verified":
                value = server.verified;
                break;
            case "Voice States":
                value = [...server.voiceStates.cache.values()];
                break;
            case "Widget Channel":
                value = server.widgetChannel;
                break;
            case "Is Widget Enabled":
                value = server.widgetEnabled;
                break;
            default:
                value = null;
                break;
        }

        setVariable(data.get("value"), value);
        actionManager.runNext();
    }
}
