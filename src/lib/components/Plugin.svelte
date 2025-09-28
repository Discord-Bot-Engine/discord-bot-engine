<script>
    import * as Card from '$lib/components/ui/card/index.js';
    import {Button} from "$lib/components/ui/button/index.js";
    import {TrashIcon} from "@lucide/svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {PluginManager} from "$lib/classes/PluginManager.svelte.js";
    let { plugin } = $props();
    let isUpToDate = $state(upToDate(plugin.name))
    function upToDate(name) {
        if(plugin.type === "action") {
            const actions = BotManager.selectedBot.actionClasses
            const action = actions.find(act => act.file.slice(40) === name)
            return PluginManager.isActionUpToDate(action?.file);
        } else if (plugin.type === "triggers") {
            const triggers = BotManager.selectedBot.triggerClasses
            const trigger = triggers.find(t => t.file.slice(40) === name)
            return PluginManager.isTriggerUpToDate(trigger?.file);
        } else if (plugin.type === "extensions") {
            const extensions = BotManager.selectedBot.extensionClasses
            const extension = extensions.find(ext => ext.file.slice(40) === name)
            return PluginManager.isExtensionUpToDate(extension?.file);
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
        }} variant={isUpToDate ? "outline" : undefined} disabled={isUpToDate} class="flex-auto">{isUpToDate ? "Installed" : "Install"}</Button>
        <Button variant="destructive" onclick={() => remove(plugin.name)}><TrashIcon/></Button>
    </Card.Footer>
</Card.Root>