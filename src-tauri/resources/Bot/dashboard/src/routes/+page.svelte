<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	const {data} = $props()
	import Guild from '$lib/components/Guild.svelte';
</script>
<ScrollArea class="w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-3 gap-3">
{#each data.guilds as guild (guild.id)}
	<Guild guild={guild}/>
{/each}
</ScrollArea>