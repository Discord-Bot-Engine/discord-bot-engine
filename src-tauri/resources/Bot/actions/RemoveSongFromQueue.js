import {  useQueue } from "discord-player";

export default class RemoveSongFromQueue {
    static type = "Remove Song From Queue"
    static title(data) {
        return `Remove "${data.get("server")}" queue song number ${data.get("song")}`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Song number"></dbe-label>
            <dbe-input name="song" class="col-span-3" value="1"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const song = Number(data.get("song")) - 1
        queue.removeTrack(song)
        actionManager.runNext()
    }
}