import {useMainPlayer, useQueue} from "discord-player";

export default class StoreQueueLyricsLine {
    static type = "Store Queue Lyrics Line"
    static variableTypes = ["Text"]
    static html = `
          <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store lyrics line in variable"></dbe-label>
            <dbe-variable-list name="variable" class="col-span-3" variableType="Text"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        const server = getVariable(data.get("server"))
        const variable = data.get("variable")
        const player = useMainPlayer()
        const queue = useQueue(server.id)
        const lyrics = await player.lyrics.search({
            trackName: queue.currentTrack.title,
            artistName: queue.currentTrack.author,
        });
        const first = lyrics?.[0]
        if(!first.syncedLyrics) return actionManager.runNext();
        const syncedLyrics = queue.syncedLyrics(first)
        setVariable(variable, syncedLyrics.at(queue.node.getTimestamp().current.value)?.line)
        actionManager.runNext(id, "action")
    }
}