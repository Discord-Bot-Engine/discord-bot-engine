<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	const { data } = $props();
	import Guild from '$lib/components/Guild.svelte';
</script>

<ScrollArea>
	<div class="grid h-full w-full gap-3 p-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
		{#each data.guilds as guild (guild.id)}
			<Guild {guild} />
		{/each}
	</div>
</ScrollArea>
