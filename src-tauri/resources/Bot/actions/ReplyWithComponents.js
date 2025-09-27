import {Dashboard} from "../classes/Dashboard.js";
import {Bot} from "../classes/Bot.js";

export default class ReplyWithComponents {
    static type = "Reply With Components"
    static title(data) {
        return `Reply to "${data.get("origin")}" with ${data.get("components").length} components`
    }
    static variableTypes = ["Message", "Command Interaction", "Button Interaction", "Select Menu Interaction"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Message or interaction"></dbe-label>
            <dbe-variable-list name="origin" class="col-span-3" variableType="Message,Command Interaction,Button Interaction,Select Menu Interaction"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message in variable"></dbe-label>
            <dbe-variable-list name="message" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
         <dbe-list name="components" title="Components" modalId="componentsModal" itemTitle="(item, i) => (item.data.get('type') ?? 'Component')+' #'+i"></dbe-list>
        <div id="optionsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Type"></dbe-label>
                <dbe-select name="type" onChange="(value) => document.getElementById('comps').style.display = (value === 'Container' ? '' : 'none')" values="Text,Section,Media Gallery,File,Separator,Container,Button,Select Menu" class="col-span-3"></dbe-select>
            </div>
            <dbe-list name="components" id="comps" title="Components" modalId="componentsModal" itemTitle="(item, i) => (item.data.get('type') ?? 'Component')+' #'+i"></dbe-list>
        </div>
    `
    static load(context) {
    }
    static async run({data,actionManager}) {
        const by = data.get("by")
        const server = actionManager.getVariable(data.get("server"))
        let member
        if(by === "Id") {
            member = await server.members.fetch(data.get("value"))
        } else {
            member = server.members.cache.find(member => member.displayName === data.get("value"))
        }
        actionManager.setVariable(data.get("member"), member)
        actionManager.runNext()
    }
}