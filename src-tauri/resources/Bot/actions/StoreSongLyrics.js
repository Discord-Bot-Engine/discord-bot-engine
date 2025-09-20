import {useMainPlayer} from "discord-player";

export default class StoreSongLyrics {
    static type = "Store Song Lyrics"
    static title(data) {
        return `Store "${data.get("song")}" lyrics`
    }
    static variableTypes = ["Text"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Song"></dbe-label>
            <dbe-input name="song" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store lyrics in variable"></dbe-label>
            <dbe-variable-list name="variable" class="col-span-3" variableType="Text"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const song = data.get("song")
        const variable = data.get("variable")
        const player = useMainPlayer()
        const lyrics = await player.lyrics.search({
            q: song,
        });
        actionManager.setVariable(variable, lyrics[0].plainLyrics)
        actionManager.runNext()
    }
}