import { useQueue, BiquadFilterType } from "discord-player";

export default class SetQueueBiquadFilter {
    static type = "Set Queue Biquad Filter"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Filter"></dbe-label>
            <dbe-select name="filter" class="col-span-3" values="Single Pole Low Pass Approx,Single Pole Low Pass,Low Pass,High Pass,Band Pass,Notch,All Pass,Low Shelf,High Shelf,Peaking EQ"></dbe-select>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const filter = data.get("filter")
        const filters = {
            "Single Pole Low Pass Approx": BiquadFilterType.SinglePoleLowPassApprox,
            "Single Pole Low Pass": BiquadFilterType.SinglePoleLowPass,
            "Low Pass": BiquadFilterType.LowPass,
            "High Pass": BiquadFilterType.HighPass,
            "Band Pass": BiquadFilterType.BandPass,
            "Notch": BiquadFilterType.Notch,
            "All Pass": BiquadFilterType.AllPass,
            "Low Shelf": BiquadFilterType.LowShelf,
            "High Shelf": BiquadFilterType.HighShelf,
            "Peaking EQ": BiquadFilterType.PeakingEQ
        }
        await queue.filters.biquad.setFilter(filters[filter])
        actionManager.runNext(id, "action")
    }
}