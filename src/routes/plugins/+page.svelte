<script>
	import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
	import {PluginManager} from "$lib/classes/PluginManager.svelte.js";
	import {BotManager} from "$lib/classes/BotManager.svelte.js";
	import Plugin from "$lib/components/Plugin.svelte";
	import {Input} from "$lib/components/ui/input/index.js";
	let name = $state("")
	let plugins = $derived(PluginManager.plugins.filter(p => p.name.toLowerCase().includes(name.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)))
</script>
<div class="w-full p-3 pb-0">
	<Input bind:value={name} placeholder="Search plugin..."/>
</div>
<ScrollArea>
	{#if !BotManager.selectedBot.isLoading}
		<div class="w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 gap-3">
			{#each plugins as plugin}
				<Plugin {plugin}/>
			{/each}
		</div>
	{/if}
</ScrollArea>