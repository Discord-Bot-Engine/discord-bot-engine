import {ActionManager} from "../classes/ActionManager.js";

export default class DeleteMessages {
    static type = "Delete Messages";
    static variableTypes = ["Channel", "Message", "Number"]
    static output = ["action", "filter"]
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
            <dbe-variable-list name="value" class="col-span-3" variableType="Message"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store message position in variable"></dbe-label>
            <dbe-variable-list name="pos" class="col-span-3" variableType="Number"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, setVariable, getVariable}) {
        const channel = getVariable(data.get('channel'))
        let number = data.get("number")
        let list = await channel.messages.fetch({limit: 100});
        list = [...list.values()]
        if(!number.trim()) number = list.length;
        if(isNaN(number)) number = list.length;
        number = Number(number);
        const filtered = []
        const onReturn = actionManager.onReturn;
        const onContinue = actionManager.onContinue;
        const onBreak = actionManager.onBreak;
        actionManager.onReturn = (v) => {
            filtered.push(v)
            iterate()
        }
        actionManager.onContinue = () => {
            iterate()
        }
        actionManager.onBreak = async () => {
            await channel.bulkDelete(filtered)
            actionManager.onReturn = onReturn
            actionManager.onBreak = onBreak
            actionManager.onContinue = onContinue
            actionManager.runNext(id, "action");
        }
        let i = 0;
        iterate()
        async function iterate() {
            if(i >= list.length || filtered.length == number) {
                await channel.bulkDelete(filtered)
                actionManager.onReturn = onReturn
                actionManager.onBreak = onBreak
                actionManager.onContinue = onContinue
                actionManager.runNext(id, "action");
                return
            }
            setVariable(data.get("value"), list[i])
            setVariable(data.get("pos"), i + 1)
            i++;
            actionManager.runNext(id, "filter")
        }
    }
}