import {  useQueue } from "discord-player";

export default class SetQueueVolume {
    static type = "Set Queue Volume"
    static title(data) {
        return `Set "${data.get("server")}" queue volume to ${data.get("volume")}`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Volume"></dbe-label>
            <dbe-input name="volume" class="col-span-3" value="100"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const server = actionManager.getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const volume = Number(data.get("volume"))
        queue.node.setVolume(volume)
        actionManager.runNext()
    }
}