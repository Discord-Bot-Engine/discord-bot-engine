<script>
    import * as Card from '$lib/components/ui/card/index.js';
    import {Button} from "$lib/components/ui/button/index.js";
    import {TrashIcon} from "@lucide/svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {PluginManager} from "$lib/classes/PluginManager.svelte.js";
    let { plugin, upToDate } = $props();
    let isUpToDate = $state(upToDate(plugin.name))
    let isDownloaded = $state(downloaded(plugin.name))
    function color() {
        if(isUpToDate) return "outline"
        if(isDownloaded) return "secondary"
        return undefined
    }
    function title() {
        if(isUpToDate) return "Downloaded"
        if(isDownloaded) return "Update"
        return "Download"
    }
    function downloaded(name) {
        if(plugin.type === "action") {
            return PluginManager.isActionDownloaded(name);
        } else if (plugin.type === "trigger") {
            return PluginManager.isTriggerDownloaded(name);
        } else if (plugin.type === "extension") {
            return PluginManager.isExtensionDownloaded(name);
        }
    }
    function download(name) {
        if(plugin.type === "action") {
            PluginManager.downloadAction(name, BotManager.selectedBot.path);
        } else if (plugin.type === "trigger") {
            PluginManager.downloadTrigger(name, BotManager.selectedBot.path);
        } else if (plugin.type === "extension") {
            PluginManager.downloadExtension(name, BotManager.selectedBot.path);
        }
        isDownloaded = true
        isUpToDate = true
    }
    function remove(name) {
        if(plugin.type === "action") {
            PluginManager.removeAction(name, BotManager.selectedBot.path);
        } else if (plugin.type === "trigger") {
            PluginManager.removeTrigger(name, BotManager.selectedBot.path);
        } else if (plugin.type === "extension") {
            PluginManager.removeExtension(name, BotManager.selectedBot.path);
        }
        isDownloaded = false
        isUpToDate = false
    }
</script>
<Card.Root class="w-full h-fit">
    <Card.Header>
        <Card.Title>
            {plugin.name}
        </Card.Title>
        <Card.Description>
            {plugin.type[0].toUpperCase()}{plugin.type.slice(1).toLowerCase()}
        </Card.Description>
    </Card.Header>
    <Card.Footer class="flex-row gap-2">
        <Button onclick={() => {
            download(plugin.name)
        }} variant={color()} disabled={isUpToDate} class="flex-auto">{title()}</Button>
        <Button variant="destructive" onclick={() => remove(plugin.name)}><TrashIcon/></Button>
    </Card.Footer>
</Card.Root>