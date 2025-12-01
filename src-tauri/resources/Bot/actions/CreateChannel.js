import { ChannelType, PermissionsBitField } from "discord.js";

export default class CreateChannel {
    static type = "Create Channel";

    static variableTypes = ["Channel", "Text", "Boolean", "Number", "Server", "List"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel name"></dbe-label>
            <dbe-input name="channelName" class="col-span-3"></dbe-input>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Type"></dbe-label>
           <dbe-select
                name="channelType"
                id="channelTypeSelect"
                class="col-span-3"
                values="Text,Voice,Announcement,Stage,Forum,Category"
                change="(v) => handlers.onChange(v)"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Category"></dbe-label>
            <dbe-variable-list name="category" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Permissions"></dbe-label>
            <dbe-select 
                id="permissionsSelect"
                name="permissions" 
                class="col-span-3"
                type="multiple"
                values=""
            ></dbe-select>

        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                class="col-span-3"
                variableType="Channel"
            ></dbe-variable-list>
        </div>
    `;

    static load() {}
    static open(action, handlers) {
        const permissionsSelect = document.getElementById("permissionsSelect");

        const permissionOptions = {
            Text: [
                "View Channel","Manage Channels","Manage Roles","Manage Webhooks","Create Invite",
                "Send Messages","Send TTS Messages","Send Messages In Threads",
                "Create Public Threads","Create Private Threads","Manage Messages","Manage Threads",
                "Embed Links","Attach Files","Add Reactions","Use External Emojis","Use External Stickers",
                "Use Application Commands","Mention Everyone","Read Message History",
                "Pin Messages","Bypass Slowmode","Send Voice Messages","Create Polls"
            ],
            Announcement: [
                "View Channel","Manage Channels","Manage Roles","Manage Webhooks","Create Invite",
                "Send Messages","Send TTS Messages","Send Messages In Threads",
                "Create Public Threads","Create Private Threads","Manage Messages","Manage Threads",
                "Embed Links","Attach Files","Add Reactions","Use External Emojis","Use External Stickers",
                "Use Application Commands","Mention Everyone","Read Message History",
                "Pin Messages","Bypass Slowmode","Send Voice Messages","Create Polls"
            ],
            Forum: [
                "View Channel","Manage Channels","Manage Roles","Manage Webhooks","Create Invite",
                "Send Messages","Send Messages In Threads","Create Public Threads","Create Private Threads",
                "Manage Messages","Manage Threads","Embed Links","Attach Files","Add Reactions",
                "Use External Emojis","Use External Stickers","Use Application Commands","Mention Everyone",
                "Read Message History","Pin Messages","Bypass Slowmode","Send Voice Messages","Create Polls"
            ],
            Voice: [
                "View Channel","Manage Channels","Manage Roles","Manage Webhooks","Create Invite",
                "Connect","Speak","Stream","Use VAD","Priority Speaker",
                "Mute Members","Deafen Members","Move Members","Use Embedded Activities"
            ],
            Stage: [
                "View Channel","Manage Channels","Manage Roles","Manage Webhooks","Create Invite",
                "Connect","Speak","Request To Speak","Mute Members","Deafen Members",
                "Move Members","Manage Events","Use Embedded Activities"
            ],
            Category: [
                "View Channel","Manage Channels","Manage Roles","Manage Webhooks","Create Invite",
                "Send Messages"
            ]
        };

        handlers.onChange = (value) => {
            const perms = permissionOptions[value] || [];
            permissionsSelect.setValues(perms)
        };
    }
    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const guild = getVariable(data.get("server"));
        if (!guild) return actionManager.runNext(id, "action");

        const name = data.get("channelName");
        const typeStr = data.get("channelType");
        const category = getVariable(data.get("category"));
        const permissionFlags = data.get("permissions") || [];

        const typeMap = {
            Text: ChannelType.GuildText,
            Voice: ChannelType.GuildVoice,
            Announcement: ChannelType.GuildAnnouncement,
            Stage: ChannelType.GuildStageVoice,
            Forum: ChannelType.GuildForum,
            Category: ChannelType.GuildCategory,
        };

        const type = typeMap[typeStr];
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
            "Create Polls": "CreatePolls"
        };
        const allFlags = Object.values(uiToFlag);

        const selectedFlags = permissionFlags.map(p => uiToFlag[p]);

        const allow = new PermissionsBitField();
        const deny = new PermissionsBitField();

        for (const flag of allFlags) {
            if (selectedFlags.includes(flag)) {
                allow.add(PermissionsBitField.Flags[flag]);
            } else {
                deny.add(PermissionsBitField.Flags[flag]);
            }
        }
        let permissionOverwrites = [{
            id: guild.id,
            allow,
            deny
        }]

        const options = {
            name,
            type,
            parent: category,
        };
        options.permissionOverwrites = permissionOverwrites;
        const channel = await guild.channels.create(options);
        setVariable(data.get("value"), channel);
        actionManager.runNext(id, "action");
    }
}
