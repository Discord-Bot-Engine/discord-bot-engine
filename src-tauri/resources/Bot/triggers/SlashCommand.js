import { Events, REST, Routes, SlashCommandBuilder } from "discord.js";
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

        if (!parsed.group) return true;

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
