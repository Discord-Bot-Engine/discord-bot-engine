import { PermissionsBitField } from "discord.js";

export default class CreateRole {
    static type = "Create Role";

    static variableTypes = ["Server", "Role"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Role name"></dbe-label>
            <dbe-input name="name" class="col-span-3"></dbe-input>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Primary color"></dbe-label>
            <dbe-color name="pcolor" class="col-span-3" value="#ffffff"></dbe-color>
        </div>
        
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Secondary color"></dbe-label>
            <dbe-color name="scolor" class="col-span-3" value="#ffffff"></dbe-color>
        </div>
        
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Tertiary color"></dbe-label>
            <dbe-color name="tcolor" class="col-span-3" value="#ffffff"></dbe-color>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Icon"></dbe-label>
            <dbe-input name="icon" class="col-span-3"></dbe-input>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Position"></dbe-label>
            <dbe-input name="position" class="col-span-3" value="0"></dbe-input>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Hoist role"></dbe-label>
            <dbe-select name="hoist" class="col-span-3" values="True,False" value="False"></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Mentionable"></dbe-label>
            <dbe-select name="mentionable" class="col-span-3" values="True,False" value="False"></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Permissions"></dbe-label>
            <dbe-select 
                name="permissions"
                class="col-span-3"
                type="multiple"
                values="View Channel,Manage Channels,Manage Roles,Manage Webhooks,Create Invite,Send Messages,Send TTS Messages,Send Messages In Threads,Create Public Threads,Create Private Threads,Manage Messages,Manage Threads,Embed Links,Attach Files,Add Reactions,Use External Emojis,Use External Stickers,Use Application Commands,Mention Everyone,Read Message History,Pin Messages,Bypass Slowmode,Send Voice Messages,Send Polls,Connect,Speak,Stream,Use VAD,Priority Speaker,Mute Members,Deafen Members,Move Members,Use Embedded Activities,Request To Speak,Manage Events"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store role in variable"></dbe-label>
            <dbe-variable-list name="role" class="col-span-3" variableType="Role"></dbe-variable-list>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {

        const guild = getVariable(data.get("server"));
        const name = data.get("name");
        const pcolor = data.get("pcolor");
        const scolor = data.get("scolor");
        const tcolor = data.get("tcolor");
        const icon = data.get("icon");
        const position = Number(data.get("position") ?? 0);
        const hoist = data.get("hoist") === "True";
        const mentionable = data.get("mentionable") === "True";
        const perms = data.get("permissions") ?? [];
        const unicodeEmojiRegex = /\p{Extended_Pictographic}/u;

        const uiToFlag = {
            "View Channel": "ViewChannel",
            "Manage Channels": "ManageChannels",
            "Manage Roles": "ManageRoles",
            "Manage Webhooks": "ManageWebhooks",
            "Create Invite": "CreateInstantInvite",
            "Send Messages": "SendMessages",
            "Send TTS Messages": "SendTTSMessages",
            "Send Messages In Threads": "SendMessagesInThreads",
            "Create Public Threads": "CreatePublicThreads",
            "Create Private Threads": "CreatePrivateThreads",
            "Manage Messages": "ManageMessages",
            "Manage Threads": "ManageThreads",
            "Embed Links": "EmbedLinks",
            "Attach Files": "AttachFiles",
            "Add Reactions": "AddReactions",
            "Use External Emojis": "UseExternalEmojis",
            "Use External Stickers": "UseExternalStickers",
            "Use Application Commands": "UseApplicationCommands",
            "Mention Everyone": "MentionEveryone",
            "Read Message History": "ReadMessageHistory",
            "Connect": "Connect",
            "Speak": "Speak",
            "Stream": "Stream",
            "Use VAD": "UseVAD",
            "Priority Speaker": "PrioritySpeaker",
            "Mute Members": "MuteMembers",
            "Deafen Members": "DeafenMembers",
            "Move Members": "MoveMembers",
            "Request To Speak": "RequestToSpeak",
            "Manage Events": "ManageEvents",
            "Use Embedded Activities": "UseEmbeddedActivities",
            "Pin Messages": "PinMessages",
            "Bypass Slowmode": "BypassSlowmode",
            "Send Voice Messages": "SendVoiceMessages",
            "Send Polls": "SendPolls"
        };

        const permissionFlags = perms.map(p => uiToFlag[p]).filter(Boolean);

        const role = await guild.roles.create({
            name,
            color: {
                primaryColor: pcolor.trim(),
                secondaryColor: scolor.trim() || null,
                tertiaryColor: tcolor.trim() || null
            },
            hoist,
            mentionable,
            permissions: permissionFlags.length
                ? new PermissionsBitField(permissionFlags)
                : undefined,
            icon: unicodeEmojiRegex.test(icon) || !icon.trim() ? null : icon,
            unicodeEmoji: unicodeEmojiRegex.test(icon) && icon.trim() ? icon : null
        });

        if(position > 0) {
            await role.setPosition(position);
        }

        const roleVar = data.get("role");
        setVariable(roleVar, role);

        actionManager.runNext(id, "action");
    }
}