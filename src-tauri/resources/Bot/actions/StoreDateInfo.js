export default class StoreDateInfo {
    static type = "Store Date Info";

    static variableTypes = ["Text", "Number", "Date"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Date"></dbe-label>
            <dbe-variable-list name="date" class="col-span-3" variableType="Date"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select
                name="info"
                class="col-span-3"
                change="(v) => handlers.onChange(v)"
                values="Timestamp,Year,Month,Day,Weekday,Hours,Minutes,Seconds,Milliseconds,ISO String"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list
                name="value"
                id="var"
                class="col-span-3"
                variableType="Number">
            </dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {
            if (value === "ISO String" || value === "Weekday") {
                varlist.setVariableType("Text");
            } else {
                varlist.setVariableType("Number");
            }
        };
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const date = getVariable(data.get("date"));
        const info = data.get("info");

        let value = null;

        if (info === "Timestamp") {
            value = date.getTime();

        } else if (info === "Year") {
            value = date.getFullYear();

        } else if (info === "Month") {
            value = date.getMonth() + 1; // 1–12

        } else if (info === "Day") {
            value = date.getDate();

        } else if (info === "Weekday") {
            value = date.toLocaleString("en-US", { weekday: "long" });

        } else if (info === "Hours") {
            value = date.getHours();

        } else if (info === "Minutes") {
            value = date.getMinutes();

        } else if (info === "Seconds") {
            value = date.getSeconds();

        } else if (info === "Milliseconds") {
            value = date.getMilliseconds();

        } else if (info === "ISO String") {
            value = date.toISOString();
        }

        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action");
    }
}
