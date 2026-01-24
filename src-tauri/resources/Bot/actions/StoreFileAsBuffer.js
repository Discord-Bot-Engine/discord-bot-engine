import fs from "node:fs";
import { buffer } from "node:stream/consumers";

export default class StoreFileAsBuffer {
    static type = "Store File As Buffer";

    static variableTypes = ["Buffer"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="File"></dbe-label>
            <dbe-input name="file" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store file buffer in variable"></dbe-label>
            <dbe-variable-list name="buffer" class="col-span-3" variableType="Buffer"></dbe-variable-list>
        </div>
    `;

    static load(context) {}

    static async run({ id, data, actionManager, setVariable }) {
        setVariable(data.get("buffer"), await buffer(fs.createReadStream(data.get("file"))));
        actionManager.runNext(id, "action");
    }
}
