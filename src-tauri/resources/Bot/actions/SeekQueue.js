import {  useQueue } from "discord-player";

export default class SeekQueue {
    static type = "Seek Queue"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Duration"></dbe-label>
            <dbe-input name="duration" class="col-span-3" value="0"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const duration = Number(data.get("duration"))
        await queue.node.seek(duration)
        queue.filters.ffmpeg.toggle()
        actionManager.runNext(id, "action")
    }
}