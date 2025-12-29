import { ActionManager } from "../classes/ActionManager.js";

export default class StoreMemberAsUser {
    static type = "Store Member As User";
    static variableTypes = ["Member", "User"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store user in variable"></dbe-label>
            <dbe-variable-list name="user" class="col-span-3" variableType="User"></dbe-variable-list>
        </div>
    `;

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const member = getVariable(data.get("member"));
        setVariable(data.get("user"), member.user);
        actionManager.runNext(id, "action");
    }
}
