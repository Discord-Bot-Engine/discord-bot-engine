import { Bot } from "../classes/Bot.js"
import { MessageType } from "discord.js"

export default class StoreMessageInfo {
    static type = "Store Message Info"

    static variableTypes = [
        "Message",
        "Channel",
        "User",
        "Text",
        "Boolean",
        "Date",
        "List",
        "Guild",
    ]

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Message"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="message"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                change="(v) => handlers.onChange(v)"
                values="ID,Content,Author,Channel,Created At,Edited At,Is Pinned,Is TTS,Is System,URL,Attachments,Embeds,Reactions,Mentions,Referenced Message,Type">
            </dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                id="var" 
                class="col-span-3"
                variableType="Message,Channel,User,Text,Boolean,Date,List,Guild">
            </dbe-variable-list>
        </div>
    `

    static open(action, handlers) {
        const varlist = document.getElementById("var")

        handlers.onChange = (value) => {
            if (["Created At", "Edited At"].includes(value)) {
                varlist.setVariableType("Date")
            } else if (["Attachments", "Embeds", "Reactions", "Mentions"].includes(value)) {
                varlist.setVariableType("List")
            } else if ([
                "Is Pinned",
                "Is TTS",
                "Is System"
            ].includes(value)) {
                varlist.setVariableType("Boolean")
            } else if (["Author"].includes(value)) {
                varlist.setVariableType("User")
            } else if (["Channel"].includes(value)) {
                varlist.setVariableType("Channel")
            } else if (["Content", "URL", "Type"].includes(value)) {
                varlist.setVariableType("Text")
            } else if (["Referenced Message"].includes(value)) {
                varlist.setVariableType("Message")
            } else {
                varlist.setVariableType("Text")
            }
        }
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const message = getVariable(data.get("message"))
        const info = data.get("info")

        let value

        switch (info) {
            case "ID":
                value = message.id
                break
            case "Content":
                value = message.content
                if(value.trim()) value += `\n`
                value += `${extractTextFromComponents(message.components).join("\n")}`
                break
            case "Author":
                value = message.author
                break
            case "Channel":
                value = message.channel
                break
            case "Created At":
                value = message.createdAt
                break
            case "Edited At":
                value = message.editedAt
                break
            case "Is Pinned":
                value = message.pinned
                break
            case "Is TTS":
                value = message.tts
                break
            case "Is System":
                value = message.system
                break
            case "URL":
                value = message.url
                break
            case "Attachments":
                value = [...message.attachments.values()]
                break
            case "Embeds":
                value = message.embeds
                break
            case "Reactions":
                value = [...message.reactions.cache.values()]
                break
            case "Mentions":
                value = [
                    ...message.mentions.users.values(),
                    ...message.mentions.roles.values(),
                    ...message.mentions.channels.values()
                ]
                break
            case "Referenced Message":
                value = message.reference ? await message.fetchReference().catch(() => null) : null
                break
            case "Type": {
                const enumName = Object.keys(MessageType).find(k => MessageType[k] === message.type) || String(message.type)
                value = enumName
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/\b\w/g, c => c.toUpperCase())
                break
            }
            default:
                value = null
                break
        }

        setVariable(data.get("value"), value)
        actionManager.runNext(id, "action")
        function extractTextFromComponents(components) {
            const texts = [];

            if (!components || !Array.isArray(components)) return texts;

            components.forEach(comp => {
                if (comp.type === 10) {
                    texts.push(comp.data.content);
                }
                else if (comp.components) {
                    texts.push(...extractTextFromComponents(comp.components));
                }
            });
            return texts;
        }
    }
}
