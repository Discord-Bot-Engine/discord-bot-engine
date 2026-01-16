import {ActionManager} from "../classes/ActionManager.js";
import {Bot} from "../classes/Bot.js";
import {
    Events,
    FileUploadBuilder,
    LabelBuilder,
    ModalBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js"
import fetch from "node-fetch";

export default class ShowModal {
    static type = "Show Modal"
    static variableTypes = ["User", "Member", "Channel", "Server", "Context Menu Interaction", "Command Interaction", "Select Menu Interaction", "Modal Interaction", "List"];
    static outputs = ["action", "on submit"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Interaction"></dbe-label>
            <dbe-variable-list name="origin" class="col-span-3" variableType="Context Menu Interaction,Command Interaction,Button Interaction,Select Menu Interaction"></dbe-variable-list>
        </div>
         <div class="grid grid-cols-4 items-center gap-4">
               <dbe-label name="Custom ID"></dbe-label>
               <dbe-input name="id" class="col-span-3"></dbe-input>
         </div>
         <div class="grid grid-cols-4 items-center gap-4">
               <dbe-label name="Title"></dbe-label>
               <dbe-input name="title" class="col-span-3"></dbe-input>
         </div>
       <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store interaction in variable"></dbe-label>
            <dbe-variable-list name="interaction" class="col-span-3" variableType="Modal Interaction"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message in variable"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store channel in variable"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store server in variable"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
         <dbe-list name="components" title="Components" modalId="componentsModal" itemTitle="async (item, i) => await App.translate(item.data.get('type') ?? 'Component', App.selectedLanguage)+' #'+i"></dbe-list>
        <template id="componentsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Type"></dbe-label>
                <dbe-select name="type" change="(value, el) => handlers.onChange(value, el)" value="Text" values="Text,Text Input,Select Menu,File Upload" class="col-span-3"></dbe-select>
            </div>
            <div id="text" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Content"></dbe-label>
                    <dbe-input name="tcontent" class="col-span-3" multiline="true"></dbe-input>
                </div>
            </div>
            <div id="textinput" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Custom ID"></dbe-label>
                    <dbe-input name="tid" class="col-span-3"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Label"></dbe-label>
                    <dbe-input name="tlabel" class="col-span-3"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Description"></dbe-label>
                    <dbe-input name="tdesc" class="col-span-3"></dbe-input>
                </div>
                 <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Type"></dbe-label>
                    <dbe-select name="ttype" class="col-span-3" values="Paragraph,Short" value="Short"></dbe-select>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Value"></dbe-label>
                    <dbe-input name="tvalue" class="col-span-3"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Placeholder"></dbe-label>
                    <dbe-input name="tplaceholder" class="col-span-3"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Is required?"></dbe-label>
                    <dbe-select name="trequired" class="col-span-3" values="True,False" value="False"></dbe-select>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Min length"></dbe-label>
                    <dbe-input name="tmin" class="col-span-3" value="0"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Max length"></dbe-label>
                    <dbe-input name="tmax" class="col-span-3" value="100"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Store text in variable"></dbe-label>
                    <dbe-variable-list name="ttext" class="col-span-3" variableType="Text"></dbe-variable-list>
                </div>
            </div>
            <div id="fileupload" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Custom ID"></dbe-label>
                    <dbe-input name="fid" class="col-span-3"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Label"></dbe-label>
                    <dbe-input name="flabel" class="col-span-3"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Description"></dbe-label>
                    <dbe-input name="fdesc" class="col-span-3"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Is required?"></dbe-label>
                    <dbe-select name="frequired" class="col-span-3" values="True,False" value="False"></dbe-select>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Min values"></dbe-label>
                    <dbe-input name="fmin" class="col-span-3" value="0"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Max values"></dbe-label>
                    <dbe-input name="fmax" class="col-span-3" value="1"></dbe-input>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Store buffers in variable"></dbe-label>
                    <dbe-variable-list name="fbuffer" class="col-span-3" variableType="List"></dbe-variable-list>
                </div>
            </div>
             <div id="selectmenu" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Custom ID"></dbe-label>
                        <dbe-input name="sid" class="col-span-3"></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Label"></dbe-label>
                        <dbe-input name="slabel" class="col-span-3"></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Description"></dbe-label>
                        <dbe-input name="sdesc" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Placeholder"></dbe-label>
                        <dbe-input name="splaceholder" class="col-span-3"></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Is required?"></dbe-label>
                        <dbe-select name="srequired" class="col-span-3" values="True,False" value="False"></dbe-select>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Min values"></dbe-label>
                        <dbe-input name="smin" class="col-span-3" value="0"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Max values"></dbe-label>
                        <dbe-input name="smax" class="col-span-3" value="1"></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store selected options in variable"></dbe-label>
                        <dbe-variable-list name="seloptions" class="col-span-3" variableType="List"></dbe-variable-list>
                    </div>
                    <dbe-list name="soptions" title="Options" modalId="optionsModal" itemTitle="async (item, i) => item.data.get('label') ? item.data.get('label') : await App.translate('Option #'+i, App.selectedLanguage)"></dbe-list>
             </div>
        </template>
        <template id="optionsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Label"></dbe-label>
                <dbe-input name="label" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Description"></dbe-label>
                <dbe-input name="description" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Value"></dbe-label>
                <dbe-input name="value" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Emoji"></dbe-label>
                <dbe-input name="emoji" class="col-span-3" ></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Is default?"></dbe-label>
                <dbe-select name="default" class="col-span-3" values="True,False" value="False"></dbe-select>
            </div>
        </template>
    `
    static open(context, handlers) {
        handlers.onChange = (v, el) => {
            setTimeout(() => {
                const parent = el.parentElement.parentElement
                parent.querySelector('#text').style.display = "none"
                parent.querySelector('#textinput').style.display = "none"
                parent.querySelector('#fileupload').style.display = "none"
                parent.querySelector('#selectmenu').style.display = "none"
                if(v === "Text")
                    parent.querySelector('#text').style.display = ""
                else if(v === "Text Input")
                    parent.querySelector('#textinput').style.display = ""
                else if(v === "File Upload")
                    parent.querySelector('#fileupload').style.display = ""
                else if(v === "Select Menu")
                    parent.querySelector('#selectmenu').style.display = ""
            }, 10)
        }
    }
    static load(context) {
        if(!Bot.initModals) {
            Bot.initModals = true
            Bot.modals = {}
            Bot.client.on(Events.InteractionCreate, async (i) => {
                if(!i.isModalSubmit()) return;
                const data = Bot.modals[i.customId]
                if(!data) return;
                const triggerId = data.triggerId
                const actionId = data.actionId
                const t = Bot.triggers.find(t => t.id === triggerId)
                const actionManager = t.lastManager ?? new ActionManager(t)
                data.variables.keys().forEach(key => {
                    actionManager.setVariable(key, data.variables.get(key))
                })
                const int = data["interaction"]
                const msg = data["message"]
                const mem = data["member"]
                const user = data["user"]
                const ch = data["channel"]
                const sv = data["server"]
                actionManager.setVariable(int, i)
                actionManager.setVariable(msg, i.message)
                actionManager.setVariable(mem, i.member)
                actionManager.setVariable(user, i.user)
                actionManager.setVariable(ch, i.channel)
                actionManager.setVariable(sv, i.guild)
                for(const key in data.data) {
                    const {type, variable} = data.data[key]
                    if(type === "TextInput") {
                        actionManager.setVariable(variable, i.fields.getTextInputValue(key))
                    } else if(type === "FileUpload") {
                        const urls = [...i.fields.getUploadedFiles(key).values()]
                        const results = []
                        for(let i = 0; i < urls.length; i++) {
                            const result = await fetch(urls[i].attachment).then(res => res.arrayBuffer())
                            results.push(result)
                        }
                        actionManager.setVariable(variable, results)
                    } else if(type === "SelectMenu") {
                        actionManager.setVariable(variable, i.fields.getStringSelectValues(key))
                    }
                }
                actionManager.runNext(actionId, `on submit`)
            })
        }
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const customId = data.get("id")
        const title = data.get("title")
        const components = data.get("components")
        const interaction = data.get("interaction")
        const member = data.get("member")
        const user = data.get("user")
        const message = data.get("message")
        const channel = data.get("channel")
        const server = data.get("server")
        const modal = new ModalBuilder().setCustomId(customId).setTitle(title);
        Bot.modals[customId] = {
            triggerId: actionManager.trigger.id,
            actionId: id,
            interaction: interaction,
            member: member,
            user: user,
            message: message,
            channel: channel,
            server: server,
            data: {},
            variables: actionManager.variables
        }
        components.forEach(({data}) => {
            const type = data.get("type")
            if(type === "Text") {
                const builder =  new TextDisplayBuilder()
                builder.setContent(
                    data.get("tcontent")
                );
                modal.addTextDisplayComponents(builder);
            } else if(type === "Text Input") {
                const id = data.get("tid")
                const style = data.get("ttype")
                const value = data.get("tvalue")
                const placeholder = data.get("tplaceholder")
                const required = data.get("trequired") === "True"
                const min = Number(data.get("tmin"))
                const max = Number(data.get("tmax"))
                const label = data.get("tlabel")
                const desc = data.get("tdesc")
                Bot.modals[customId].data[id] = {
                    type: "TextInput",
                    variable: data.get("ttext")
                }
                const input = new TextInputBuilder()
                    .setCustomId(id)
                    .setStyle(TextInputStyle[style])
                    .setPlaceholder(placeholder)
                    .setRequired(required)
                    .setMinLength(min)
                    .setMaxLength(max);
                if(value.trim()) {
                    input.setValue(value)
                }
                const inputLabel = new LabelBuilder()
                    .setLabel(label)
                    .setDescription(desc)
                    .setTextInputComponent(input);
                modal.addLabelComponents(inputLabel);
            } else if(type === "Select Menu") {
                const builder = new StringSelectMenuBuilder()
                const id = data.get("sid")
                const label = data.get("slabel")
                const desc = data.get("sdesc")
                const placeholder = data.get("splaceholder")
                const srequired = data.get("srequired") === "True"
                const smin = Number(data.get("smin"))
                const smax = Number(data.get("smax"))
                const options = data.get("soptions")
                Bot.modals[customId].data[id] = {
                    type: "SelectMenu",
                    variable: data.get("seloptions")
                }
                builder.setCustomId(id).setPlaceholder(placeholder).setRequired(srequired).setMinValues(smin).setMaxValues(smax)
                options.forEach(({data}) => {
                    const label = data.get("label")
                    const description = data.get("description")
                    const value = data.get("value")
                    const emoji = data.get("emoji")
                    const isdefault = data.get("default") === "True"
                    const opt = new StringSelectMenuOptionBuilder().setLabel(label).setDescription(description).setValue(value).setDefault(isdefault)
                    if(emoji) opt.setEmoji(emoji)
                    builder.addOptions(opt)
                })
                const selectLabel = new LabelBuilder()
                    .setLabel(label)
                    .setDescription(desc)
                    .setStringSelectMenuComponent(builder);
                modal.addLabelComponents(selectLabel)
            } else if(type === "File Upload") {
                const id = data.get("fid")
                const label = data.get("flabel")
                const desc = data.get("fdesc")
                const required = data.get("frequired") === "True"
                const min = Number(data.get("fmin"))
                const max = Number(data.get("fmax"))
                Bot.modals[customId].data[id] = {
                    type: "FileUpload",
                    variable: data.get("fbuffer")
                }
                const file = new FileUploadBuilder()
                    .setCustomId(id)
                    .setRequired(required)
                    .setMinValues(min)
                    .setMaxValues(max)
                const fileLabel = new LabelBuilder()
                    .setLabel(label)
                    .setDescription(desc)
                    .setFileUploadComponent(file);
                modal.addLabelComponents(fileLabel);
            }
        })
        const origin = getVariable(data.get("origin"))
        origin.showModal(modal)
        actionManager.runNext(id, "action")
    }
}