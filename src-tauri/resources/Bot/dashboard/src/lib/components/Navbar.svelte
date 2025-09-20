<script>
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	const {data} = $props()
</script>
<div class="w-full p-2 px-3 bg-sidebar flex gap-1">
	<img class="w-9 h-9" src={data.icon}/>
	<a class={buttonVariants({variant:"ghost"})} href="/">{data.name}'s dashboard</a>
	{#if data.isAdmin}
		<a class="{buttonVariants({variant:'ghost'})} ml-auto" href="/admin">Edit</a>
	{/if}
</div>