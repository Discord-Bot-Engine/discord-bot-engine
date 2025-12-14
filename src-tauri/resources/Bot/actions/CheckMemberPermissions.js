import { PermissionsBitField } from "discord.js";

export default class CheckMemberPermissions {
    static type = "Check Member Permissions";

    static variableTypes = ["Member", "Server"];

    static outputs = ["true", "false"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list
                name="target"
                class="col-span-3"
                variableType="Member">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Permissions to check"></dbe-label>
            <dbe-select
                name="permissions"
                class="col-span-3"
                type="multiple"
                values="Administrator,View Channels,Manage Channels,Manage Roles,Manage Webhooks,Create Invite,Send Messages,Send TTS Messages,Send Messages In Threads,Create Public Threads,Create Private Threads,Manage Messages,Manage Threads,Embed Links,Attach Files,Add Reactions,Use External Emojis,Use External Stickers,Use Application Commands,Mention Everyone,Read Message History,Pin Messages,Bypass Slowmode,Send Voice Messages,Send Polls,Connect,Speak,Stream,Use VAD,Priority Speaker,Mute Members,Deafen Members,Move Members,Use Embedded Activities,Request To Speak,Manage Events,Manage Server,View Audit Log,Manage Emojis and Stickers,Manage Guild Expressions,Manage Nicknames,Change Nickname,Manage Threads,Create Events,Moderate Members"
            ></dbe-select>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const member = getVariable(data.get("target"));
        const permissions = data.get("permissions") ?? [];

        const uiToFlag = {
            "Administrator": "Administrator",
            "View Channels": "ViewChannel",
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
            "Pin Messages": "PinMessages",
            "Bypass Slowmode": "BypassSlowmode",
            "Send Voice Messages": "SendVoiceMessages",
            "Send Polls": "SendPolls",
            "Connect": "Connect",
            "Speak": "Speak",
            "Stream": "Stream",
            "Use VAD": "UseVAD",
            "Priority Speaker": "PrioritySpeaker",
            "Mute Members": "MuteMembers",
            "Deafen Members": "DeafenMembers",
            "Move Members": "MoveMembers",
            "Use Embedded Activities": "UseEmbeddedActivities",
            "Request To Speak": "RequestToSpeak",
            "Manage Events": "ManageEvents",
            "Manage Server": "ManageGuild",
            "View Audit Log": "ViewAuditLog",
            "Manage Emojis and Stickers": "ManageEmojisAndStickers",
            "Manage Guild Expressions": "ManageGuildExpressions",
            "Manage Nicknames": "ManageNicknames",
            "Change Nickname": "ChangeNickname",
            "Create Events": "CreateEvents",
            "Moderate Members": "ModerateMembers"
        };

        const requiredFlags = permissions
            .map(p => uiToFlag[p])
            .filter(Boolean);

        const memberPerms = member.permissions;

        const hasAllPermissions = requiredFlags.every(flag =>
            memberPerms.has(PermissionsBitField.Flags[flag])
        );

        actionManager.runNext(id, hasAllPermissions ? "true" : "false");
    }
}
