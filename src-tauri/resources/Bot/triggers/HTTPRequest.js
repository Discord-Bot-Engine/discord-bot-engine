export default class HTTPRequest {
    static type = "HTTP Request"
    static variableTypes = ["HTTP Request", "HTTP Response", "Text", "JSON"]
    static event = "httpRequest"
    static runIf = ({data, actionManager}, req, res) => req.path === actionManager.trigger.name && req.method === (data.get("type") ?? "GET")
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Type"></dbe-label>
            <dbe-select name="type" class="col-span-3" change="(v) => handlers.onChange(v)" values="GET,POST" value="GET"></dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store request in variable"></dbe-label>
            <dbe-variable-list name="req" class="col-span-3" variableType="HTTP Request"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store response in variable"></dbe-label>
            <dbe-variable-list name="res" class="col-span-3" variableType="HTTP Response"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4" id="body">
            <dbe-label name="Store request body in variable"></dbe-label>
            <dbe-variable-list name="body" class="col-span-3" variableType="JSON"></dbe-variable-list>    
        </div>
        <dbe-list name="params" title="Query Parameters" modalId="paramsModal" itemTitle="(item, i) => item.data.get('name') ?? ('Parameter #'+i)"></dbe-list>
        <dbe-list name="headers" title="Headers" modalId="paramsModal" itemTitle="(item, i) => item.data.get('name') ?? ('Header #'+i)"></dbe-list>
        <template id="paramsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Name"></dbe-label>
                <dbe-input name="name" class="col-span-3"></dbe-input>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Store text in variable"></dbe-label>
                <dbe-variable-list name="var" class="col-span-3" variableType="Text"></dbe-variable-list>
            </div>
        </template>
    `
    static open(action, handlers) {
        const body = document.getElementById("body");
        handlers.onChange = (value) => {
            if(value === "POST") {
                body.style.display = ""
            } else body.style.display = "none";
        }
    }
    static load({data, actionManager, setVariable}) {}
    static run({id, data, actionManager, setVariable}, req, res) {
        const params = data.get("params")
        const headers = data.get("headers")
        params?.forEach(param => {
            setVariable(param.data.get("var"), req.query[param.data.get("name")])
        })
        headers?.forEach(header => {
            setVariable(header.data.get("var"), req.get(header.data.get("name")))
        })
        setVariable(data.get("req"), req)
        setVariable(data.get("res"), res)
        actionManager.runNext(id, "action")
    }
}