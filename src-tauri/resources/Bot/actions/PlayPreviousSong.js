import { useHistory } from "discord-player";

export default class PlayPreviousSong {
    static type = "Play Previous Song"
    static title(data) {
        return `Play previous song in "${data.get("server")}" queue`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const server = actionManager.getVariable(data.get("server"))
        const history = useHistory(server.id)
        await history.previous()
        actionManager.runNext()
    }
}