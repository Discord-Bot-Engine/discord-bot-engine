import fetch from "node-fetch";

export default class StoreResponseFromHTTPRequest {
    static type = "Store Response From HTTP Request"
    static title(data) {
        return `Store response from "${data.get("type")}" request to "${data.get("url")}"`
    }
    static variableTypes = ["Text", "JSON"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="URL"></dbe-label>
            <dbe-input name="url" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Request type"></dbe-label>
            <dbe-select name="type" values="GET,POST" value="GET" class="col-span-3"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Response type"></dbe-label>
            <dbe-select name="restype" values="Text,JSON" value="JSON" class="col-span-3"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store response in variable"></dbe-label>
            <dbe-variable-list name="variable" class="col-span-3" variableType="Text,JSON"></dbe-variable-list>
        </div>
         <dbe-list name="headers" title="Headers" modalId="optionsModal" itemTitle="(item, i) => item.data.get('name') ?? ('Header #'+i)"></dbe-list>
        <template id="optionsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Name"></dbe-label>
                <dbe-input name="name" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Value"></dbe-label>
                <dbe-input name="value" multiline="true" class="col-span-3"></dbe-input>
            </div>
        </template>
    `
    static load(context) {
    }
    static async run({data, actionManager, setVariable}) {
        const url = data.get("url")
        const type = data.get("type")
        const restype = data.get("restype").toLowerCase()
        const variable = data.get("variable")
        const headers = data.get("headers")
        const obj = {}
        headers.forEach(header => {
            const name = header.data.get("name")
            const value = header.data.get("value")
            obj[name] = value
        })
        const res = await fetch(url, {
            method: type,
            headers: obj,
        })
        setVariable(variable, await res[restype]())
        actionManager.runNext()
    }
}