<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Input from '$lib/components/Input.svelte';

	const {data} = $props()

	async function setValue(name, value) {
		const res = await fetch(`./${data.guild.id}/update`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, value })
		});

		if (!res.ok) {
			const text = await res.text();
			alert("Error: " + text);
		}
	}
</script>
<div class="w-full h-full p-3">
	<h1 class="font-bold text-xl">Editing {data.guild.name}</h1>
<ScrollArea>
	<div class="w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-3 gap-3">
		{#each data.inputs as input (input.name)}
			<Input roles={data.roles} members={data.members} channels={data.channels} {input} onChange={setValue}/>
		{/each}
	</div>
</ScrollArea>
</div>
