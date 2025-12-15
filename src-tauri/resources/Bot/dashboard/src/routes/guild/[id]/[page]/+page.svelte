<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Input from '$lib/components/Input.svelte';
	import Pages from '$lib/components/Pages.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	const { data } = $props();
	let pages = $derived([...new Set(data.inputs.map((i) => i.page?.toUpperCase() ?? 'GENERAL'))]);
	async function setValue(name, value) {
		const res = await fetch(`./${data.guild.id}/update`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, value })
		});

		if (!res.ok) {
			const text = await res.text();
			alert('Error: ' + text);
		}
	}
</script>

<Sidebar.Provider>
	<Pages guild={data.guild} items={pages.map((p) => ({ title: p, url: `./${p}` }))} />
	<div class="h-full w-full p-3">
		<h1 class="text-xl font-bold">{data.page.toUpperCase()}</h1>
		<ScrollArea class="h-full w-full">
			<div class="mt-3 grid w-full gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
				{#each data.inputs
					.filter((i) => (i.page?.toLowerCase() ?? 'general') === data.page.toLowerCase())
					.sort((a, b) => a.name.localeCompare(b.name)) as input (input.name)}
					<Input
						roles={data.roles}
						members={data.members}
						channels={data.channels}
						{input}
						onChange={setValue}
					/>
				{/each}
			</div>
		</ScrollArea>
	</div>
</Sidebar.Provider>
