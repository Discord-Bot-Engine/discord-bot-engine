export default class GetActionsAsJSON {
    static type = "Get Actions As JSON";
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Trigger"></dbe-label>
            <dbe-trigger-list change="(id) => handlers.onChange(id)" id="trigger" name="trigger" class="col-span-3" triggerType="Any"></dbe-trigger-list>
        </div>
         <div>
         <dbe-button id="copy" name="Copy JSON" class="float-right"></dbe-button>
        </div>
    `
    static open(extension, handlers) {
        const id = document.getElementById("trigger").value
        let json = JSON.stringify(BotManager.selectedBot.triggers.find(t => t.id === id)?.actions ?? "[]")
        const copy = document.getElementById("copy")
        handlers.onChange = (id) => {
            const t = BotManager.selectedBot.triggers.find(t => t.id === id)
            json = JSON.stringify(t?.actions)
            if(t) copy.style.display = ""
            else copy.style.display = "none"
        }
        copy.onclick = () => {
            navigator.clipboard.writeText(json)
            alert("JSON Copied!")
        }
    }
    static load(context) {
    }
}