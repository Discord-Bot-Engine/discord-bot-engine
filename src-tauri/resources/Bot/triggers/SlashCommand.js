import { Events, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Bot } from "../classes/Bot.js";

export default class SlashCommand {

    static type = "Slash Command";

    static variableTypes = [
        "Command Interaction",
        "User",
        "Member",
        "Server",
        "Attachment",
        "Boolean",
        "Channel",
        "Mentionable",
        "Number",
        "Role",
        "Text",
        "User"
    ];

    static defaultVariables = [
        {
            name: "interaction",
            type: "Command Interaction",
            element: "interaction"
        },
        {
            name: "user",
            type: "User",
            element: "user"
        },
        {
            name: "member",
            type: "Member",
            element: "member"
        },
        {
            name: "channel",
            type: "Channel",
            element: "channel"
        },
        {
            name: "server",
            type: "Server",
            element: "server"
        },
    ]

    static event = Events.InteractionCreate;

    static runIf = ({ actionManager }, interaction) => {
        if (!interaction.isChatInputCommand()) return false;

        const parts = actionManager.trigger.name.toLowerCase().trim().split(/\s+/);

        const parsed = {
            root: parts[0].toLowerCase().trim().replace(/\s+/g, "-"),
            group: parts.length >= 2 ? parts[1].toLowerCase().trim().replace(/\s+/g, "-") : null,
            sub: parts.length >= 3
                ? parts.slice(2).join(" ").toLowerCase().trim().replace(/\s+/g, "-")
                : null
        };

        if (interaction.commandName !== parsed.root) return false;

        if (!parsed.group) {
            return interaction.options.getSubcommand(false) === null;
        };

        if (parsed.sub) {
            return (
                interaction.options.getSubcommandGroup(false) === parsed.group &&
                interaction.options.getSubcommand(false) === parsed.sub
            );
        }

        return interaction.options.getSubcommand(false) === parsed.group;
    };

    static html = `
         <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Description"></dbe-label>
            <dbe-input name="description" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Requires permissions?"></dbe-label>
            <dbe-select
                name="hasPerms"
                class="col-span-3"
                values="True,False"
                value="False"
                change="(v) => document.getElementById('perms').style.display = v === 'True' ? '' : 'none'"
            ></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4" id="perms">
            <dbe-label name="Required permissions"></dbe-label>
            <dbe-select
                name="permissions"
                class="col-span-3"
                type="multiple"
                values="Administrator,View Channels,Manage Channels,Manage Roles,Manage Webhooks,Create Invite,Send Messages,Send TTS Messages,Send Messages In Threads,Create Public Threads,Create Private Threads,Manage Messages,Manage Threads,Embed Links,Attach Files,Add Reactions,Use External Emojis,Use External Stickers,Use Application Commands,Mention Everyone,Read Message History,Pin Messages,Bypass Slowmode,Send Voice Messages,Send Polls,Connect,Speak,Stream,Use VAD,Priority Speaker,Mute Members,Deafen Members,Move Members,Use Embedded Activities,Request To Speak,Manage Events,Manage Server,View Audit Log,Manage Emojis and Stickers,Manage Guild Expressions,Manage Nicknames,Change Nickname,Manage Threads,Create Events,Moderate Members"
            ></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store interaction in variable"></dbe-label>
            <dbe-variable-list name="interaction" class="col-span-3" variableType="Command Interaction"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <dbe-list name="options" title="Options" modalId="optionsModal" itemTitle="async (item, i) => item.data.get('name') ?? await App.translate('Option', App.selectedLanguage) + ' #' + i"></dbe-list>
        <template id="optionsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Name"></dbe-label>
                <dbe-input name="name" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Description"></dbe-label>
                <dbe-input name="description" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Type"></dbe-label>
                <dbe-select name="type" change="(value) => document.getElementById('var').setVariableType(value.replace('Integer', 'Number'))" values="Attachment,Boolean,Channel,Integer,Mentionable,Number,Role,Text,User" value="Text" class="col-span-3"></dbe-select>
            </div>
             <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Is Required?"></dbe-label>
                <dbe-select name="required" value="False" values="True,False" class="col-span-3"></dbe-select>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Store value in variable"></dbe-label>
                <dbe-variable-list name="value" class="col-span-3" id="var" variableType="Attachment,Boolean,Channel,Mentionable,Number,Role,Text,User"></dbe-variable-list>
            </div>
        </template>
    `;

    static load({ data, actionManager }) {
        Bot.commands ??= [];
        Bot.registeredCommands = false;

        const permissions = data.get("permissions") ?? [];

        const hasPerms = data.get("hasPerms") === "True";
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
            .map(p => PermissionFlagsBits[uiToFlag[p]])
        const bitfield = requiredFlags.reduce((acc, flag) => acc | flag, 0n);
        const parts = actionManager.trigger.name.toLowerCase().trim().split(/\s+/);

        const parsed = {
            root: parts[0].toLowerCase().trim().replace(/\s+/g, "-"),
            group: parts.length >= 2 ? parts[1].toLowerCase().trim().replace(/\s+/g, "-") : null,
            sub: parts.length >= 3
                ? parts.slice(2).join(" ").toLowerCase().trim().replace(/\s+/g, "-")
                : null
        };

        let command = Bot.commands.find(c => c.name === parsed.root);

        if (!command) {
            command = new SlashCommandBuilder()
                .setName(parsed.root)
                .setDescription(data.get("description")?.trim() || "No description provided.");
            if(hasPerms)
                command.setDefaultMemberPermissions(bitfield)
            Bot.commands.push(command);
        }

        const applyOptions = (builder) => {
            data.get("options")?.forEach(option => {
                const name = option.data.get("name").toLowerCase().trim().replace(/\s+/g, "-")
                const desc = option.data.get("description")?.trim() || "No description provided.";
                const req = option.data.get("required") === "True";
                const type = option.data.get("type");

                if (type === "Attachment") builder.addAttachmentOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "Boolean") builder.addBooleanOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "Channel") builder.addChannelOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "Integer") builder.addIntegerOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "Mentionable") builder.addMentionableOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "Number") builder.addNumberOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "Role") builder.addRoleOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "Text") builder.addStringOption(o => o.setName(name).setDescription(desc).setRequired(req));
                else if (type === "User") builder.addUserOption(o => o.setName(name).setDescription(desc).setRequired(req));
            });
        };

        if (parsed.sub) {
            command.addSubcommandGroup(group =>
                group
                    .setName(parsed.group)
                    .setDescription("Subcommand group")
                    .addSubcommand(sub => {
                        sub.setName(parsed.sub).setDescription("Subcommand");
                        applyOptions(sub);
                        return sub;
                    })
            );
        } else if (parsed.group) {
            command.addSubcommand(sub => {
                sub.setName(parsed.group).setDescription("Subcommand");
                applyOptions(sub);
                return sub;
            });
        } else {
            applyOptions(command);
        }

        if (Bot.registeredCommands) return;
        Bot.registeredCommands = true;

        Bot.client.once(Events.ClientReady, async () => {
            const rest = new REST().setToken(Bot.client.token);
            await rest.put(
                Routes.applicationCommands(Bot.client.application.id),
                { body: Bot.commands }
            );
        });
    }

    static run({ id, data, setVariable, actionManager }, interaction) {
        data.get("options")?.forEach(({ data }) => {
            const name = data.get("name").toLowerCase().trim().replace(/\s+/g, "-");
            const type = data.get("type");
            const value = data.get("value");

            if (type === "Attachment") setVariable(value, interaction.options.getAttachment(name));
            else if (type === "Boolean") setVariable(value, interaction.options.getBoolean(name));
            else if (type === "Channel") setVariable(value, interaction.options.getChannel(name));
            else if (type === "Integer") setVariable(value, interaction.options.getInteger(name));
            else if (type === "Mentionable") setVariable(value, interaction.options.getMentionable(name));
            else if (type === "Number") setVariable(value, interaction.options.getNumber(name));
            else if (type === "Role") setVariable(value, interaction.options.getRole(name));
            else if (type === "Text") setVariable(value, interaction.options.getString(name));
            else if (type === "User") setVariable(value, interaction.options.getUser(name));
        });

        setVariable(data.get("interaction"), interaction);
        setVariable(data.get("user"), interaction.user);
        setVariable(data.get("member"), interaction.member);
        setVariable(data.get("channel"), interaction.channel);
        setVariable(data.get("server"), interaction.guild);

        actionManager.runNext(id, "action");
    }
}
