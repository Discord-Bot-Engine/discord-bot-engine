export default class SetActionsToJSON {
    static type = "Set Actions To JSON";
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Trigger"></dbe-label>
            <dbe-trigger-list change="(id) => handlers.onChange(id)" name="trigger" class="col-span-3" triggerType="Any"></dbe-trigger-list>
        </div>
         <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="JSON"></dbe-label>
            <dbe-input id="json" name="json" class="col-span-3" multiline="true"></dbe-input>
        </div>
    `
    static open(extension, handlers) {
        const json = document.getElementById("json")
        handlers.onChange = (id) => {
            const t = BotManager.selectedBot.triggers.find(t => t.id === id)
            json.value = JSON.stringify(t?.actions)
        }
    }
    static close(extension) {
        const t = BotManager.selectedBot.triggers.find(t => t.id === extension.data.get("trigger"))
        if(!t) return;
        t.actions = JSON.parse(extension.data.get("json")).map(j => Action.fromJSON(j));
    }
    static load(context) {
    }
}