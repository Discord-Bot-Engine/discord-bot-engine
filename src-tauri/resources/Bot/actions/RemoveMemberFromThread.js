export default class RemoveMemberFromThread {
    static type = "Remove Member From Thread";

    static variableTypes = ["Channel", "Member"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Thread"></dbe-label>
            <dbe-variable-list name="thread" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const thread = getVariable(data.get("thread"));
        const member = getVariable(data.get("member"));

        await thread.members.remove(member.id);

        actionManager.runNext(id, "action");
    }
}
