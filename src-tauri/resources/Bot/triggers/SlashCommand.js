import {Events, REST, Routes, SlashCommandBuilder} from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class SlashCommand {
    static type = "Slash Command"
    static variableTypes = ["Command Interaction", "Member", "Channel", "Server", "Attachment", "Boolean", "Channel", "Mentionable", "Number", "Role", "Text", "User"]
    static event = Events.InteractionCreate
    static showInDebugger = ({actionManager}, interaction) => interaction.commandName === actionManager.trigger.name
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Description"></dbe-label>
            <dbe-input name="description" noVariables class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store interaction in variable"></dbe-label>
            <dbe-variable-list name="interaction" class="col-span-3" variableType="Command Interaction"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Text Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <dbe-list name="options" title="Options" modalId="optionsModal" itemTitle="(item, i) => item.data.get('name') ?? ('Option #'+i)"></dbe-list>
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
                <dbe-select name="type" onChange="(value) => document.getElementById('var').setVariableType(value.replace('Integer', 'Number'))" values="Attachment,Boolean,Channel,Integer,Mentionable,Number,Role,Text,User" value="Text" class="col-span-3"></dbe-select>
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
    `
    static load({data, actionManager, setVariable}) {
        Bot.commands ??= []
        Bot.registeredCommands = false
        const slashCommand = new SlashCommandBuilder()
            .setName(actionManager.trigger.name)
            .setDescription(data.get("description") ?? "No description provided.")
        data.get("options").forEach((option) => {
            const name = option.data.get("name")
            const description = option.data.get("description")
            const type = option.data.get("type")
            const required = option.data.get("required")
            if(type === "Attachment") slashCommand.addAttachmentOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "Boolean") slashCommand.addBooleanOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "Channel") slashCommand.addChannelOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "Integer") slashCommand.addIntegerOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "Mentionable") slashCommand.addMentionableOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "Number") slashCommand.addNumberOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "Role") slashCommand.addRoleOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "Text") slashCommand.addStringOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
            else if(type === "User") slashCommand.addUserOption(option => option.setName(name).setDescription(description).setRequired(required === "True"))
        })
        Bot.commands.push(slashCommand)
        if(Bot.registeredCommands) return;
        Bot.registeredCommands = true;
        Bot.client.once(Events.ClientReady, async () => {
            const rest = new REST().setToken(Bot.client.token);
            await rest.put(
                Routes.applicationCommands(Bot.client.application.id),
                { body: Bot.commands },
            );
        })
    }
    static run({data, actionManager, setVariable}, interaction) {
        if(!interaction.isChatInputCommand()) return;
        if(interaction.commandName !== actionManager.trigger.name) return;
        data.get("options").forEach(({data}) => {
            const name = data.get("name")
            const type = data.get("type")
            const value = data.get("value")
            if(type === "Attachment") setVariable(value, interaction.options.getAttachment(name))
            else if(type === "Boolean") setVariable(value, interaction.options.getBoolean(name))
            else if(type === "Channel") setVariable(value, interaction.options.getChannel(name))
            else if(type === "Integer") setVariable(value, interaction.options.getInteger(name))
            else if(type === "Mentionable") setVariable(value, interaction.options.getMentionable(name))
            else if(type === "Number") setVariable(value, interaction.options.getNumber(name))
            else if(type === "Role") setVariable(value, interaction.options.getRole(name))
            else if(type === "Text") setVariable(value, interaction.options.getString(name))
            else if(type === "User") setVariable(value, interaction.options.getUser(name))
        })
        setVariable(data.get("interaction"), interaction);
        setVariable(data.get("member"), interaction.member);
        setVariable(data.get("channel"), interaction.channel);
        setVariable(data.get("server"), interaction.guild);
        actionManager.runNext()
    }
}