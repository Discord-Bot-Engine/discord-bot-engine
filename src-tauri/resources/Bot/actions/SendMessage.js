import {ActionManager} from "../classes/ActionManager.js";
import {Bot} from "../classes/Bot.js";
import {
    TextDisplayBuilder,
    SectionBuilder,
    MediaGalleryBuilder,
    FileBuilder,
    SeparatorBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ContainerBuilder,
    AttachmentBuilder,
    SeparatorSpacingSize,
    ButtonStyle,
    ComponentType,
    MessageFlags,
} from "discord.js"

export default class SendMessage {
    static type = "Send Message"
    static variableTypes = ["Message", "User", "Member", "Channel", "Server", "Button Interaction", "Select Menu Interaction"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel, member or user"></dbe-label>
            <dbe-variable-list name="ch" class="col-span-3" variableType="Channel,Member,User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message in variable"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
         <dbe-list name="files" title="Files" modalId="filesModal" itemTitle="async (item, i) => item.data.get('name') ?? await App.translate('File', App.selectedLanguage)+' #'+i"></dbe-list>
         <dbe-list name="components" title="Components" modalId="componentsModal" itemTitle="async (item, i) => await App.translate(item.data.get('type') ?? 'Component', App.selectedLanguage)+' #'+i"></dbe-list>
        <template id="filesModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Buffer"></dbe-label>
                <dbe-variable-list name="buffer" class="col-span-3" variableType="Buffer"></dbe-variable-list>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Name"></dbe-label>
                <dbe-input name="name" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Description"></dbe-label>
                <dbe-input name="description" class="col-span-3"></dbe-input>
            </div>
        </template>
        <template id="componentsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Type"></dbe-label>
                <dbe-select name="type" change="(value, el) => handlers.onChange(value, el)" value="Text" values="Text,Section,Media Gallery,File,Separator,Container,Button,Select Menu" class="col-span-3"></dbe-select>
            </div>
            <div id="text" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Content"></dbe-label>
                    <dbe-input name="tcontent" class="col-span-3" multiline="true"></dbe-input>
                </div>
            </div>
            <div id="section" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Content"></dbe-label>
                    <dbe-input name="scontent" class="col-span-3" multiline="true"></dbe-input>
                </div>
                 <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Has thumbnail?"></dbe-label>
                    <dbe-select name="sthumbnail" class="col-span-3" change="(value, el) => el.parentElement.parentElement.parentElement.querySelector('#thumbnail').style.display = (value === 'True' ? '' : 'none')" values="True,False" value="False"></dbe-select>
                </div>
                 <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Has button?"></dbe-label>
                    <dbe-select name="sbutton" class="col-span-3" change="(value, el) => el.parentElement.parentElement.parentElement.querySelector('#button').style.display = (value === 'True' ? '' : 'none')" values="True,False" value="False"></dbe-select>
                </div>
            </div>
            <div id="thumbnail" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Description"></dbe-label>
                        <dbe-input name="tdescription" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="URL"></dbe-label>
                        <dbe-input name="turl" class="col-span-3"></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Is spoiler?"></dbe-label>
                        <dbe-select name="tspoiler" class="col-span-3" value="False" values="True,False"></dbe-select>
                    </div>
            </div>
            <dbe-list name="mediagallery" id="mediagallery" title="Images" modalId="galleryModal" itemTitle="async (item, i) => item.data.get('url') ? item.data.get('url') : await App.translate('Image #' + i, App.selectedLanguage)"></dbe-list>
            <div id="file" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="File URL"></dbe-label>
                        <dbe-input name="furl" class="col-span-3"></dbe-input>
                    </div>
            </div>
            <div id="separator" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Size"></dbe-label>
                        <dbe-select name="ssize" class="col-span-3" value="Small" values="Large,Small"></dbe-select>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Has divider?"></dbe-label>
                        <dbe-select name="sdivider" class="col-span-3" value="False" values="True,False"></dbe-select>
                    </div>
            </div>
             <div id="button" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4" id="cid">
                        <dbe-label name="Custom ID"></dbe-label>
                        <dbe-input name="bid" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Label"></dbe-label>
                        <dbe-input name="blabel" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Style"></dbe-label>
                        <dbe-select name="bstyle" class="col-span-3" change="(value, el) => handlers.onStyleChange(value, el)" values="Danger,Link,Premium,Primary,Secondary,Success" value="Primary"></dbe-select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4" id="url">
                        <dbe-label name="URL"></dbe-label>
                        <dbe-input name="burl" class="col-span-3" ></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Emoji"></dbe-label>
                        <dbe-input name="bemoji" class="col-span-3" ></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Is disabled?"></dbe-label>
                        <dbe-select name="bdisabled" class="col-span-3" values="True,False" value="False"></dbe-select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store interaction in variable"></dbe-label>
                        <dbe-variable-list name="binteraction" class="col-span-3" variableType="Button Interaction"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store member in variable"></dbe-label>
                        <dbe-variable-list name="bmember" class="col-span-3" variableType="Member"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store user in variable"></dbe-label>
                        <dbe-variable-list name="buser" class="col-span-3" variableType="User"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store message in variable"></dbe-label>
                        <dbe-variable-list name="bmessage" class="col-span-3" variableType="Message"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store channel in variable"></dbe-label>
                        <dbe-variable-list name="bchannel" class="col-span-3" variableType="Channel"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store server in variable"></dbe-label>
                        <dbe-variable-list name="bserver" class="col-span-3" variableType="Server"></dbe-variable-list>
                    </div>
             </div>
             <div id="selectmenu" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Custom ID"></dbe-label>
                        <dbe-input name="sid" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Placeholder"></dbe-label>
                        <dbe-input name="splaceholder" class="col-span-3"></dbe-input>
                    </div>
                    <dbe-list name="soptions" title="Options" modalId="optionsModal" itemTitle="async (item, i) => item.data.get('label') ? item.data.get('label') : await App.translate('Option #'+i, App.selectedLanguage)"></dbe-list>
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
                        <dbe-label name="Is disabled?"></dbe-label>
                        <dbe-select name="sdisabled" class="col-span-3" values="True,False" value="False"></dbe-select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store interaction in variable"></dbe-label>
                        <dbe-variable-list name="sinteraction" class="col-span-3" variableType="Select Menu Interaction"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store selected options in variable"></dbe-label>
                        <dbe-variable-list name="seloptions" class="col-span-3" variableType="Any"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store member in variable"></dbe-label>
                        <dbe-variable-list name="smember" class="col-span-3" variableType="Member"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store user in variable"></dbe-label>
                        <dbe-variable-list name="suser" class="col-span-3" variableType="User"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store message in variable"></dbe-label>
                        <dbe-variable-list name="smessage" class="col-span-3" variableType="Message"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store channel in variable"></dbe-label>
                        <dbe-variable-list name="schannel" class="col-span-3" variableType="Channel"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store server in variable"></dbe-label>
                        <dbe-variable-list name="sserver" class="col-span-3" variableType="Server"></dbe-variable-list>
                    </div>
             </div>
             <div id="comps" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Accent color"></dbe-label>
                    <dbe-color name="ccolor" class="col-span-3" value="#000000"></dbe-color>
                </div>
                <dbe-list name="components" title="Components" modalId="nestedComponentsModal" itemTitle="async (item, i) => (item.data.get('type') ?? await App.translate('Component', App.selectedLanguage))+' #'+i"></dbe-list>             
            </div>
        </template>
        <template id="nestedComponentsModal">
           <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Type"></dbe-label>
                <dbe-select name="type" change="(value, el) => handlers.onChange(value, el)" value="Text" values="Text,Section,Media Gallery,File,Separator,Button,Select Menu" class="col-span-3"></dbe-select>
            </div>
            <div id="text" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Content"></dbe-label>
                    <dbe-input name="tcontent" class="col-span-3" multiline="true"></dbe-input>
                </div>
            </div>
            <div id="section" class="grid gap-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Content"></dbe-label>
                    <dbe-input name="scontent" class="col-span-3" multiline="true"></dbe-input>
                </div>
                 <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Has thumbnail?"></dbe-label>
                    <dbe-select name="sthumbnail" class="col-span-3" change="(value, el) => el.parentElement.parentElement.parentElement.querySelector('#thumbnail').style.display = (value === 'True' ? '' : 'none')" values="True,False" value="False"></dbe-select>
                </div>
                 <div class="grid grid-cols-4 items-center gap-4">
                    <dbe-label name="Has button?"></dbe-label>
                    <dbe-select name="sbutton" class="col-span-3" change="(value, el) => el.parentElement.parentElement.parentElement.querySelector('#button').style.display = (value === 'True' ? '' : 'none')" values="True,False" value="False"></dbe-select>
                </div>
            </div>
            <div id="thumbnail" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Description"></dbe-label>
                        <dbe-input name="tdescription" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="URL"></dbe-label>
                        <dbe-input name="turl" class="col-span-3"></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Is spoiler?"></dbe-label>
                        <dbe-select name="tspoiler" class="col-span-3" value="False" values="True,False"></dbe-select>
                    </div>
            </div>
            <dbe-list name="mediagallery" id="mediagallery" title="Images" modalId="galleryModal" itemTitle="async (item, i) => item.data.get('url') ? : await App.translate('Image #' + i, App.selectedLanguage)"></dbe-list>
            <div id="file" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="File URL"></dbe-label>
                        <dbe-input name="furl" class="col-span-3"></dbe-input>
                    </div>
            </div>
            <div id="separator" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Size"></dbe-label>
                        <dbe-select name="ssize" class="col-span-3" value="Small" values="Large,Small"></dbe-select>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Has divider?"></dbe-label>
                        <dbe-select name="sdivider" class="col-span-3" value="False" values="True,False"></dbe-select>
                    </div>
            </div>
             <div id="button" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4" id="cid">
                        <dbe-label name="Custom ID"></dbe-label>
                        <dbe-input name="bid" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Label"></dbe-label>
                        <dbe-input name="blabel" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Style"></dbe-label>
                        <dbe-select name="bstyle" class="col-span-3" change="(value, el) => handlers.onStyleChange(value, el)" values="Danger,Link,Premium,Primary,Secondary,Success" value="Primary"></dbe-select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4" id="url">
                        <dbe-label name="URL"></dbe-label>
                        <dbe-input name="burl" class="col-span-3" ></dbe-input>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Emoji"></dbe-label>
                        <dbe-input name="bemoji" class="col-span-3" ></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Is disabled?"></dbe-label>
                        <dbe-select name="bdisabled" class="col-span-3" values="True,False" value="False"></dbe-select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store interaction in variable"></dbe-label>
                        <dbe-variable-list name="binteraction" class="col-span-3" variableType="Button Interaction"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store member in variable"></dbe-label>
                        <dbe-variable-list name="bmember" class="col-span-3" variableType="Member"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store user in variable"></dbe-label>
                        <dbe-variable-list name="buser" class="col-span-3" variableType="User"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store message in variable"></dbe-label>
                        <dbe-variable-list name="bmessage" class="col-span-3" variableType="Message"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store channel in variable"></dbe-label>
                        <dbe-variable-list name="bchannel" class="col-span-3" variableType="Channel"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store server in variable"></dbe-label>
                        <dbe-variable-list name="bserver" class="col-span-3" variableType="Server"></dbe-variable-list>
                    </div>
             </div>
             <div id="selectmenu" class="grid gap-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Custom ID"></dbe-label>
                        <dbe-input name="sid" class="col-span-3"></dbe-input>
                    </div>
                     <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Placeholder"></dbe-label>
                        <dbe-input name="splaceholder" class="col-span-3"></dbe-input>
                    </div>
                    <dbe-list name="soptions" title="Options" modalId="optionsModal" itemTitle="async (item, i) => item.data.get('label') ? item.data.get('label') : await App.translate('Option #'+i)"></dbe-list>
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
                        <dbe-label name="Is disabled?"></dbe-label>
                        <dbe-select name="sdisabled" class="col-span-3" values="True,False" value="False"></dbe-select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store interaction in variable"></dbe-label>
                        <dbe-variable-list name="sinteraction" class="col-span-3" variableType="Select Menu Interaction"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store selected options in variable"></dbe-label>
                        <dbe-variable-list name="seloptions" class="col-span-3" variableType="Any"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store member in variable"></dbe-label>
                        <dbe-variable-list name="smember" class="col-span-3" variableType="Member"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store user in variable"></dbe-label>
                        <dbe-variable-list name="suser" class="col-span-3" variableType="User"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store message in variable"></dbe-label>
                        <dbe-variable-list name="smessage" class="col-span-3" variableType="Message"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store channel in variable"></dbe-label>
                        <dbe-variable-list name="schannel" class="col-span-3" variableType="Channel"></dbe-variable-list>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <dbe-label name="Store server in variable"></dbe-label>
                        <dbe-variable-list name="sserver" class="col-span-3" variableType="Server"></dbe-variable-list>
                    </div>
             </div>
        </template>
        <template id="galleryModal" class="grid gap-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Description"></dbe-label>
                <dbe-input name="description" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="URL"></dbe-label>
                <dbe-input name="url" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Is spoiler?"></dbe-label>
                <dbe-select name="spoiler" class="col-span-3" value="False" values="True,False"></dbe-select>
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
            const parent = el.parentElement.parentElement
            parent.querySelector('#text').style.display = "none"
            parent.querySelector('#section').style.display = "none"
            parent.querySelector('#thumbnail').style.display = "none"
            parent.querySelector('#mediagallery').style.display = "none"
            parent.querySelector('#file').style.display = "none"
            parent.querySelector('#separator').style.display = "none"
            parent.querySelector('#button').style.display = "none"
            parent.querySelector('#selectmenu').style.display = "none"
            if(parent.querySelector('#comps'))
                parent.querySelector('#comps').style.display = "none"
            if(v === "Text")
                parent.querySelector('#text').style.display = ""
            else if(v === "Section")
                parent.querySelector('#section').style.display = ""
            else if(v === "Media Gallery")
                parent.querySelector('#mediagallery').style.display = ""
            else if(v === "File")
                parent.querySelector('#file').style.display = ""
            else if(v === "Separator")
                parent.querySelector('#separator').style.display = ""
            else if(v === "Button")
                parent.querySelector('#button').style.display = ""
            else if(v === "Select Menu")
                parent.querySelector('#selectmenu').style.display = ""
            else if(v === "Container")
                parent.querySelector('#comps').style.display = ""
        }
        handlers.onStyleChange = (value, el) => {
            el.parentElement.parentElement.querySelector('#url').style.display = (value === 'Link' ? '' : 'none');
            el.parentElement.parentElement.querySelector('#cid').style.display = (value !== 'Link' ? '' : 'none');
        }
    }
    static async close(context) {
        const data = context.data
        const selectmenus = [];
        const buttons = [];
        data.get("components").forEach(comp => {
            const data = comp.data
            const type = data.get("type")
            if(type === "Section") {
                const button = data.get("sbutton") === "True";
                if(button) {
                    const id = data.get("bid")
                    if(data.get("bstyle") !== "Link") buttons.push(id)
                }
            } else if(type === "Select Menu") {
                selectmenus.push(data.get("sid"))
            } else if(type === "Button") {
                if(data.get("bstyle") !== "Link") buttons.push(data.get("bid"))
            } else if(type === "Container") {
                const components = data.get("components")
                components.forEach(comp => {
                    const data = comp.data
                    const type = data.get("type")
                    if(type === "Section") {
                        const button = data.get("sbutton") === "True";
                        if(button) {
                            const id = data.get("bid")
                            if(data.get("bstyle") !== "Link") buttons.push(id)
                        }
                    } else if(type === "Select Menu") {
                        selectmenus.push(data.get("sid"))
                    } else if(type === "Button") {
                        if(data.get("bstyle") !== "Link") buttons.push(data.get("bid"))
                    }
                })
            }
        })
        const btns = await Promise.all(buttons.map(async el => (await App.translate(`%s (on click)`, App.selectedLanguage)).replace("%s", el)))
        const selects = await Promise.all(selectmenus.map(async el => (await App.translate(`%s (on select)`, App.selectedLanguage)).replace("%s", el)))
        context.outputs = ["action", ...btns.map(b => ({translation:b})), ...selects.map(s => ({translation:s}))]
    }
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const components = data.get("components")
        const buttons = []
        const selectmenus = []
        const list = []
        let currentRow = 0
        components.forEach(({data}, i) => {
            const type = data.get("type")
            if(type === "Text") {
                list.push(new TextDisplayBuilder().setContent(
                    data.get("tcontent"),
                ))
            } else if(type === "Section") {
                const content = data.get("scontent");
                const thumbnail = data.get("sthumbnail") === "True";
                const button = data.get("sbutton") === "True";
                const builder = new SectionBuilder()
                builder.addTextDisplayComponents(
                    text => text.setContent(content)
                )
                if(thumbnail) {
                    const url = data.get("turl")
                    const description = data.get("tdescription")
                    const spoiler = data.get("tspoiler") === "True"
                    builder.setThumbnailAccessory(t => t.setURL(url).setDescription(description).setSpoiler(spoiler))
                }
                if(button) {
                    const id = data.get("bid")
                    const label = data.get("blabel")
                    const style = data.get("bstyle")
                    const url = data.get("burl")
                    const emoji = data.get("bemoji")
                    const disabled = data.get("bdisabled") === "True"
                    buttons.push({id, data})
                    builder.setButtonAccessory(
                        button => {
                            button.setLabel(label).setStyle(ButtonStyle[style]).setDisabled(disabled)
                            if(style === "Link") button.setURL(url)
                            else button.setCustomId(id)
                            if(emoji) button.setEmoji(emoji)
                            return button
                        }
                    )
                }
                list.push(builder)
            } else if(type === "Media Gallery") {
                const builder = new MediaGalleryBuilder()
                const images = data.get("mediagallery")
                images.forEach(({data}) => {
                    const url = data.get("url")
                    const description = data.get("description")
                    const spoiler = data.get("spoiler") === "True"
                    builder.addItems(item => item.setURL(url).setDescription(description).setSpoiler(spoiler))
                })
                list.push(builder)
            } else if(type === "File") {
                const builder = new FileBuilder()
                const url = data.get("furl")
                builder.setURL(url)
                list.push(builder)
            } else if(type === "Separator") {
                const builder = new SeparatorBuilder()
                const divider = data.get("sdivider") === "True"
                const size = SeparatorSpacingSize[data.get("ssize")]
                builder.setDivider(divider).setSpacing(size)
                list.push(builder)
            } else if(type === "Button") {
                const builder = new ButtonBuilder()
                const id = data.get("bid")
                const label = data.get("blabel")
                const style = data.get("bstyle")
                const url = data.get("burl")
                const emoji = data.get("bemoji")
                const disabled = data.get("bdisabled") === "True"
                buttons.push({id, data})
                builder.setLabel(label).setStyle(ButtonStyle[style]).setDisabled(disabled)
                if(style === "Link") builder.setURL(url)
                else builder.setCustomId(id)
                if(emoji) builder.setEmoji(emoji)
                if(!(list[currentRow] instanceof ActionRowBuilder) && list[currentRow]) currentRow++;
                if(list[currentRow] instanceof ActionRowBuilder && (list[currentRow].data.components.size >= 5 || list[currentRow].data.components.every(c => c.type === ComponentType.Button))) currentRow = i;
                if(!list[currentRow]) list[currentRow] = new ActionRowBuilder()
                list[currentRow].addComponents(builder)
            } else if(type === "Select Menu") {
                const builder = new StringSelectMenuBuilder()
                const id = data.get("sid")
                const placeholder = data.get("splaceholder")
                const srequired = data.get("srequired") === "True"
                const smin = Number(data.get("smin"))
                const smax = Number(data.get("smax"))
                const sdisabled = data.get("sdisabled") === "True"
                const options = data.get("soptions")
                selectmenus.push({id, data})
                builder.setCustomId(id).setPlaceholder(placeholder).setRequired(srequired).setMinValues(smin).setMaxValues(smax).setDisabled(sdisabled)
                options.forEach(({data}) => {
                    const label = data.get("label")
                    const value = data.get("value")
                    const emoji = data.get("emoji")
                    const isdefault = data.get("default") === "True"
                    const opt = new StringSelectMenuOptionBuilder().setLabel(label).setValue(value).setDefault(isdefault)
                    if(emoji) opt.setEmoji(emoji)
                    builder.addOptions(opt)
                })
                currentRow = i;
                if(!list[currentRow]) list[currentRow] = new ActionRowBuilder()
                list[currentRow].addComponents(builder)
            } else if(type === "Container") {
                const components = data.get("components")
                const builder = new ContainerBuilder()
                const rows = []
                let currentRow = 0
                const color = hexToNumber(data.get("ccolor").replace("#", ""))
                builder.setAccentColor(color)
                components.forEach(({data}) => {
                    const type = data.get("type")
                    if(type === "Text") {
                        builder.addTextDisplayComponents(text=>text.setContent(
                            data.get("tcontent")
                        ))
                    } else if(type === "Section") {
                        const content = data.get("scontent");
                        const thumbnail = data.get("sthumbnail") === "True";
                        const button = data.get("sbutton") === "True";
                        builder.addSectionComponents(builder => {
                            builder.addTextDisplayComponents(
                                text => text.setContent(content)
                            )
                            if(thumbnail) {
                                const url = data.get("turl")
                                const description = data.get("tdescription")
                                const spoiler = data.get("tspoiler") === "True"
                                builder.setThumbnailAccessory(t => t.setURL(url).setDescription(description).setSpoiler(spoiler))
                            }
                            if(button) {
                                const id = data.get("bid")
                                const label = data.get("blabel")
                                const style = data.get("bstyle")
                                const url = data.get("burl")
                                const emoji = data.get("bemoji")
                                const disabled = data.get("bdisabled") === "True"
                                buttons.push({id, data})
                                builder.setButtonAccessory(
                                    button => {
                                        button.setLabel(label).setStyle(ButtonStyle[style]).setDisabled(disabled)
                                        if(style === "Link") button.setURL(url)
                                        else button.setCustomId(id)
                                        if(emoji) button.setEmoji(emoji)
                                        return button
                                    }
                                )
                            }
                            return builder
                        })
                    } else if(type === "Media Gallery") {
                        builder.addMediaGalleryComponents(builder => {
                            const images = data.get("mediagallery")
                            images.forEach(({data}) => {
                                const url = data.get("url")
                                const description = data.get("description")
                                const spoiler = data.get("spoiler") === "True"
                                builder.addItems(item => item.setURL(url).setDescription(description).setSpoiler(spoiler))
                            })
                            return builder
                        })
                    } else if(type === "File") {
                        builder.addFileComponents(builder => {
                            const url = data.get("furl")
                            builder.setURL(url)
                            return builder
                        })
                    } else if(type === "Separator") {
                        builder.addSeparatorComponents(builder => {
                            const divider = data.get("sdivider") === "True"
                            const size = SeparatorSpacingSize[data.get("ssize")]
                            builder.setDivider(divider).setSpacing(size)
                            return builder
                        })
                    } else if(type === "Button") {
                        const builder = new ButtonBuilder()
                        const id = data.get("bid")
                        const label = data.get("blabel")
                        const style = data.get("bstyle")
                        const url = data.get("burl")
                        const emoji = data.get("bemoji")
                        const disabled = data.get("bdisabled") === "True"
                        buttons.push({id, data})
                        builder.setLabel(label).setStyle(ButtonStyle[style]).setDisabled(disabled)
                        if(style === "Link") builder.setURL(url)
                        else builder.setCustomId(id)
                        if(emoji) builder.setEmoji(emoji)
                        if(rows[currentRow] && (rows[currentRow].data.components.size >= 5 || rows[currentRow].data.components.every(c => c.type === ComponentType.Button))) currentRow++;
                        if(!rows[currentRow]) rows[currentRow] = new ActionRowBuilder()
                        rows[currentRow].addComponents(builder)
                    } else if(type === "Select Menu") {
                        const builder = new StringSelectMenuBuilder()
                        const id = data.get("sid")
                        const placeholder = data.get("splaceholder")
                        const srequired = data.get("srequired") === "True"
                        const smin = Number(data.get("smin"))
                        const smax = Number(data.get("smax"))
                        const sdisabled = data.get("sdisabled") === "True"
                        const options = data.get("soptions")
                        selectmenus.push({id, data})
                        builder.setCustomId(id).setPlaceholder(placeholder).setDisabled(sdisabled).setRequired(srequired).setMinValues(smin).setMaxValues(smax)
                        options.forEach(({data}) => {
                            const label = data.get("label")
                            const value = data.get("value")
                            const emoji = data.get("emoji")
                            const isdefault = data.get("default") === "True"
                            const opt = new StringSelectMenuOptionBuilder().setLabel(label).setValue(value).setDefault(isdefault)
                            if(emoji) opt.setEmoji(emoji)
                            builder.addOptions(opt)
                        })
                        if(rows[currentRow]) currentRow++;
                        if(!rows[currentRow]) rows[currentRow] = new ActionRowBuilder()
                        rows[currentRow].addComponents(builder)
                    }
                })
                builder.addActionRowComponents(...rows)
                list.push(builder)
            }
        })
        const files = data.get("files")
        const attachments = []
        files.forEach(file => {
            const buffer = getVariable(file.data.get("buffer"))
            const name = file.data.get("name")
            const description = file.data.get("description")
            attachments.push(new AttachmentBuilder(buffer, { name, description }))
        })
        const flags = [MessageFlags.IsComponentsV2]
        const ch = getVariable(data.get("ch"))
        let r = await ch.send({
            components: list,
            files: attachments,
            flags,
        })
        setVariable(data.get("message"), r);
        const btncollector = r.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });
        const menucollector = r.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
        btncollector.on('collect', (i) => {
            const btn = buttons.find(b => b.id === i.customId)
            const int = btn.data.get("binteraction")
            const msg = btn.data.get("bmessage")
            const mem = btn.data.get("bmember")
            const user = btn.data.get("buser")
            const ch = btn.data.get("bchannel")
            const sv = btn.data.get("bserver")
            setVariable(int, i)
            setVariable(msg, i.message)
            setVariable(mem, i.member)
            setVariable(user, i.user)
            setVariable(ch, i.channel)
            setVariable(sv, i.guild)
            actionManager.runNext(id, `${i.customId} (on click)`)
        });
        menucollector.on('collect', (i) => {
            const menu = selectmenus.find(s => s.id === i.customId)
            const int = menu.data.get("sinteraction")
            const opts = menu.data.get("seloptions")
            const msg = menu.data.get("smessage")
            const mem = menu.data.get("smember")
            const user = menu.data.get("suser")
            const ch = menu.data.get("schannel")
            const sv = menu.data.get("sserver")
            setVariable(int, i)
            setVariable(opts, i.options)
            setVariable(msg, i.message)
            setVariable(mem, i.member)
            setVariable(user, i.user)
            setVariable(ch, i.channel)
            setVariable(sv, i.guild)
            actionManager.runNext(id, `${i.customId} (on select)`)
        });
        actionManager.runNext(id, "action")
        function hexToNumber(hex) {
            if (hex.startsWith('#')) {
                hex = hex.slice(1);
            }
            return parseInt(hex, 16);
        }
    }
}