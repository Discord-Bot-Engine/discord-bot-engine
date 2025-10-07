import { useQueue } from "discord-player";

export default class SetQueueEqualizer {
    static type = "Set Queue Equalizer"
    static title(data) {
        return `Set "${data.get("server")}" queue equalizer to ${data.get("bands").length} bands`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <dbe-list name="bands" title="Bands" modalId="bandsModal" itemTitle="(item, i) => item.data.get('band') ? 'Band: ' + item.data.get('band') + ' Gain: ' + item.data.get('gain') : ('Band #'+i)"></dbe-list>
        <div id="bandsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Band"></dbe-label>
                <dbe-input name="band" class="col-span-3" value="1"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Gain"></dbe-label>
                <dbe-input name="gain" class="col-span-3" value="0.25"></dbe-input>
            </div>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const bands = data.get("bands").map(({data}) => ({band: Number(data.get("band")) - 1, gain: Number(data.get("gain"))}))
        queue.filters.equalizer.setEQ(bands)
        actionManager.runNext()
    }
}