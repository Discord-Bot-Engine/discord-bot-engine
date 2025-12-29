import { ActionManager } from "../classes/ActionManager.js";

export default class StoreUserAsMember {
    static type = "Store User As Member";
    static variableTypes = ["Member", "User", "Server"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="User"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store member in variable"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
    `;

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const server = getVariable(data.get("server"));
        const user = getVariable(data.get("user"));
        setVariable(data.get("member"), await server.members.fetch(user.id));
        actionManager.runNext(id, "action");
    }
}
