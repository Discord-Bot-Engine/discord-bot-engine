import { Bot } from "../classes/Bot.js";
import { Player, useMainPlayer, useQueue } from "discord-player";
import { DisTubeExtractor } from "discord-player-distube";

export default class PlayYouTubeSong {
    static type = "Play YouTube Song"
    static variableTypes = ["Channel"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Voice channel"></dbe-label>
            <dbe-variable-list name="vc" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Song"></dbe-label>
            <dbe-input name="song" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Clear queue?"></dbe-label>
            <dbe-select name="clear" values="True,False" value="False" class="col-span-3"></dbe-select>
        </div>
    `
    static load(context) {
        if(!Bot.player) {
            Bot.player = new Player(Bot.client);
            Bot.player.events.on("error", console.log)
            Bot.player.events.on("playerError", console.log)
        }
        if(!Bot.player.extractors.get(DisTubeExtractor.identifier)) Bot.player.extractors.register(DisTubeExtractor, {});
    }
    static async run({id, data, actionManager, getVariable}) {
        const player = useMainPlayer()
        const vc = getVariable(data.get("vc"))
        const song = data.get("song")
        const clear = data.get("clear") === "True"
        if(clear) {
            const queue = useQueue(vc.guild.id)
            queue.delete()
        }
        await player.play(vc, song, {
            nodeOptions: {
                disableSeeker: false
            }
        })
        actionManager.runNext(id, "action")
    }
}