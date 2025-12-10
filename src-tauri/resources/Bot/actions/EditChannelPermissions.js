import { ChannelType, PermissionsBitField } from "discord.js";

export default class EditChannelPermissions {
    static type = "Edit Channel Permissions";

    static variableTypes = ["Channel", "Role", "Member", "User"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <dbe-list name="perms" title="Permissions" modalId="permsModal" itemTitle="async (item, i) => item.data.get('target') ?? await App.translate('Permission #'+i, App.selectedLanguage)"></dbe-list>
        <template id="permsModal">
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Target role, member or user"></dbe-label>            
            <dbe-variable-list name="target" class="col-span-3" variableType="Role,Member,User"></dbe-variable-list>
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
</template>
    `;

    static load() {}
    static async run({ id, data, actionManager, getVariable }) {
        const channel = getVariable(data.get("channel"));
        const perms = data.get("perms");
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
        const allFlags = Object.values(uiToFlag);
        const permissionOverwrites = []
        perms.forEach(perm => {
            const permissionFlags = perm.data.get("permissions");

            const selectedFlags = permissionFlags.map(p => uiToFlag[p]);
            const obj = {}
            for (const flag of allFlags) {
                obj[flag] = selectedFlags.includes(flag);
            }
            permissionOverwrites.push({
                target: getVariable(perm.data.get("target")),
                perms: obj
            })
        })
        for (const ow of permissionOverwrites) {
            await channel.permissionOverwrites.edit(ow.target, ow.perms);
        }
        actionManager.runNext(id, "action");
    }
}
