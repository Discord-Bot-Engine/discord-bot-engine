import {
    Events,
    REST,
    Routes,
    ContextMenuCommandBuilder,
    ApplicationCommandType
} from "discord.js";
import { Bot } from "../classes/Bot.js";

export default class ContextMenuCommand {
    static type = "Context Menu"
    static variableTypes = [
        "Context Menu Interaction",
        "User",
        "Member",
        "Server",
        "Channel",
        "Message"
    ]

    static event = Events.InteractionCreate

    static runIf = ({ actionManager }, interaction) =>
        interaction.commandName === actionManager.trigger.name &&
        interaction.isContextMenuCommand()

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Menu Type"></dbe-label>
            <dbe-select
                change="(v) => handlers.onChange(v)"
                name="menuType"
                values="User,Message"
                value="User"
                class="col-span-3">
            </dbe-select>
        </div>
        
        
        <div class="grid grid-cols-4 items-center gap-4" id="message">
            <dbe-label name="Store target message in variable"></dbe-label>
            <dbe-variable-list
                name="targetMessage"
                class="col-span-3"
                variableType="Message">
            </dbe-variable-list>
        </div>
        
        
        <div class="grid grid-cols-4 items-center gap-4" id="user">
            <dbe-label name="Store target user in variable"></dbe-label>
            <dbe-variable-list
                name="targetUser"
                class="col-span-3"
                variableType="User">
            </dbe-variable-list>
        </div>
        
        
        <div class="grid grid-cols-4 items-center gap-4" id="member">
            <dbe-label name="Store target member in variable"></dbe-label>
            <dbe-variable-list
                name="targetMember"
                class="col-span-3"
                variableType="Member">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store interaction in variable"></dbe-label>
            <dbe-variable-list
                name="interaction"
                class="col-span-3"
                variableType="Context Menu Interaction">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list
                name="user"
                class="col-span-3"
                variableType="User">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list
                name="member"
                class="col-span-3"
                variableType="Member">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list
                name="channel"
                class="col-span-3"
                variableType="Channel">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list
                name="server"
                class="col-span-3"
                variableType="Server">
            </dbe-variable-list>
        </div>
    `
    static open(action, handlers) {
        const message = document.getElementById("message")
        const user = document.getElementById("user")
        const member = document.getElementById("member")
        handlers.onChange = (value) => {
            message.style.display = "none"
            user.style.display = "none"
            member.style.display = "none"
            if(value === "User") {
                user.style.display = ""
                member.style.display = ""
            } else {
                message.style.display = ""
            }
        }
    }

    static load({ data, actionManager }) {
        Bot.commands ??= []
        Bot.registeredCommands = false

        const menuType = data.get("menuType") === "Message"
            ? ApplicationCommandType.Message
            : ApplicationCommandType.User

        const contextMenu = new ContextMenuCommandBuilder()
            .setName(actionManager.trigger.name)
            .setType(menuType)

        Bot.commands.push(contextMenu)

        if (Bot.registeredCommands) return
        Bot.registeredCommands = true

        Bot.client.once(Events.ClientReady, async () => {
            const rest = new REST().setToken(Bot.client.token)
            await rest.put(
                Routes.applicationCommands(Bot.client.application.id),
                { body: Bot.commands }
            )
        })
    }

    static run({ id, data, actionManager, setVariable }, interaction) {
        setVariable(data.get("interaction"), interaction)
        setVariable(data.get("user"), interaction.user)
        setVariable(data.get("member"), interaction.member)
        setVariable(data.get("channel"), interaction.channel)
        setVariable(data.get("server"), interaction.guild)

        if (interaction.isUserContextMenuCommand()) {
            setVariable(data.get("targetUser"), interaction.targetUser)
            setVariable(data.get("targetMember"), interaction.targetMember)
        }

        if (interaction.isMessageContextMenuCommand()) {
            setVariable(data.get("targetMessage"), interaction.targetMessage)
        }

        actionManager.runNext(id, "action")
    }
}
