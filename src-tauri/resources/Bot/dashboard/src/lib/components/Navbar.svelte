<script>
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	const { data } = $props();
</script>

<div class="flex w-full overflow-hidden bg-sidebar p-2 px-3">
	<div class="w-full max-w-1/3 overflow-hidden">
		<a class="{buttonVariants({ variant: 'ghost' })} truncate">{data.guildCount} Servers</a>
	</div>
	<div class="flex w-full max-w-1/3 justify-center overflow-hidden">
		<img class="h-9 w-9 rounded-xl" src={data.icon} />
		<a class="{buttonVariants({ variant: 'ghost' })} truncate" href="/">{data.name}</a>
	</div>
	<div class="flex w-full max-w-1/3 justify-end overflow-hidden">
		{#if data.isAdmin}
			<a class="{buttonVariants({ variant: 'ghost' })} truncate" href="/admin">Edit</a>
		{/if}
	</div>
</div>
