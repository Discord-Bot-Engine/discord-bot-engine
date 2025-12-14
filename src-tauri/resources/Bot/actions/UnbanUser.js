import { ActionManager } from "../classes/ActionManager.js";

export default class UnbanUser {
    static type = "Unban User";

    static variableTypes = ["Server", "User"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list
                name="server"
                class="col-span-3"
                variableType="Server">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="User"></dbe-label>
            <dbe-variable-list
                name="user"
                class="col-span-3"
                variableType="User">
            </dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Reason"></dbe-label>
            <dbe-input
                name="reason"
                class="col-span-3">
            </dbe-input>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const guild = getVariable(data.get("server"));
        let user = getVariable(data.get("user"));
        let reason = data.get("reason")?.trim();
        await guild.members.unban(user.id, reason || undefined)
        actionManager.runNext(id, "action");
    }
}
