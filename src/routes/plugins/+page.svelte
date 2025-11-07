<script>
	import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
	import {PluginManager} from "$lib/classes/PluginManager.svelte.js";
	import {BotManager} from "$lib/classes/BotManager.svelte.js";
	import Plugin from "$lib/components/Plugin.svelte";
	import {Input} from "$lib/components/ui/input/index.js";
	import {goto} from "$app/navigation";
	if(!BotManager.selectedBot) {
		alert("Please select a project!")
		goto("/");
	}
	let name = $state("")
	let plugins = $derived(
			PluginManager.plugins
					.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
					.sort((a, b) => a.name.localeCompare(b.name))
					.sort((a, b) => upToDate(a) - upToDate(b))
	)
	function upToDate(plugin) {
		if(plugin.type === "action") {
			const actions = BotManager.selectedBot.actionClasses
			const action = actions.find(act => act.file.slice(40) === plugin.name)
			return PluginManager.isActionUpToDate(action?.file);
		} else if (plugin.type === "trigger") {
			const triggers = BotManager.selectedBot.triggerClasses
			const trigger = triggers.find(t => t.file.slice(40) === plugin.name)
			return PluginManager.isTriggerUpToDate(trigger?.file);
		} else if (plugin.type === "extension") {
			const extensions = BotManager.selectedBot.extensionClasses
			const extension = extensions.find(ext => ext.file.slice(40) === plugin.name)
			return PluginManager.isExtensionUpToDate(extension?.file);
		}
	}
</script>
<div class="w-full p-3 pb-0">
	<Input bind:value={name} placeholder="Search plugin..."/>
</div>
<ScrollArea>
	{#if !BotManager.selectedBot.isLoading}
		<div class="w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 gap-3">
			{#each plugins as plugin}
				<Plugin {plugin} {upToDate}/>
			{/each}
		</div>
	{/if}
</ScrollArea>