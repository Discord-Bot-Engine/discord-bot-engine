import {ActionManager} from "../classes/ActionManager.js";

export default class DeleteMessages {
    static type = "Delete Messages";
    static title(data) {
        return `Delete messages from "${data.get("channel")}"`
    }
    static variableTypes = ["Channel"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Number"></dbe-label>
            <dbe-input name="number" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message position in variable"></dbe-label>
            <dbe-variable-list name="pos" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
        <dbe-action-list name="Run Actions To Filter" title="Run Actions To Filter"></dbe-action-list>
    `
    static load(context) {
    }
    static async run({data, actionManager, setVariable, getVariable}) {
        const channel = getVariable(data.get('channel'))
        let number = data.get("number")
        let list = await channel.messages.fetch();
        list = [...list.values()]
        if(!number.trim()) number = list.length;
        if(isNaN(number)) number = list.length;
        number = Number(number);
        const filtered = []
        const actions = new ActionManager(actionManager.trigger, data.get("Run Actions To Filter"), () => { iterate() }, (v) => {
            filtered.push(v)
            iterate()
        })
        let i = 0;
        iterate()
        async function iterate() {
            actions.reset()
            if(i >= list.length || filtered.length == number) {
                await channel.bulkDelete(filtered)
                actionManager.runNext();
                return
            }
            setVariable(data.get("value"), list[i])
            setVariable(data.get("pos"), i + 1)
            i++;
            actions.runNext()
        }
    }
}