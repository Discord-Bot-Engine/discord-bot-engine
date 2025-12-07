export default class ArchiveThread {
    static type = "Archive Thread";

    static variableTypes = ["Channel"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Thread"></dbe-label>
            <dbe-variable-list name="thread" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Archive?"></dbe-label>
            <dbe-select name="archive" class="col-span-3" value="True" values="True,False"></dbe-select>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const thread = getVariable(data.get("thread"));
        const archive = data.get("archive") === "True";
        await thread.setArchived(archive);
        actionManager.runNext(id, "action");
    }
}
