import { useQueue } from "discord-player";

export default class SetQueueFFMPEGFilters {
    static type = "Set Queue FFMPEG Filters"
    static title(data) {
        return `Set "${data.get("server")}" queue FFMPEG filters to ${data.get("filters").length} filters`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Filters"></dbe-label>
            <dbe-select name="filters" class="col-span-3" type="multiple" values="Bassboost Low,Bassboost,Bassboost High,8D,Vaporwave,Nightcore,Phaser,Tremolo,Vibrato,Reverse,Treble,Normalizer,Normalizer 2,Surrounding,Pulsator,Subboost,Karaoke,Flanger,Gate,Haas,Mcompand,Mono,Mstlr,Mstrr,Compressor,Expander,Softlimiter,Chorus,Chorus 2D,Chorus 3D,Fadein,Dim,Earrape,Lofi,Silenceremove"></dbe-select>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        await queue.filters.ffmpeg.setFilters(data.get("filters").map(el => el.toLowerCase().replaceAll(" ", "_")))
        actionManager.runNext()
    }
}