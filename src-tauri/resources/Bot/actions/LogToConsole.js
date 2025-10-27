export default class LogToConsole {
    static type = "Log To Console"
    static title(data) {
        return `Log ${data.get("text").split("\n").length} lines to console`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Text"></dbe-label>
            <dbe-input name="text" class="col-span-3"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const text = data.get("text")
        console.log(`LOG: ${text}`)
        actionManager.runNext()
    }
}