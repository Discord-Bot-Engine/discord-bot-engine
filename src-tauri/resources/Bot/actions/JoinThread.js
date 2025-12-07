export default class JoinThread {
    static type = "Join Thread";

    static variableTypes = ["Channel"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Thread"></dbe-label>
            <dbe-variable-list name="thread" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const thread = getVariable(data.get("thread"));
        await thread.join();
        actionManager.runNext(id, "action");
    }
}
