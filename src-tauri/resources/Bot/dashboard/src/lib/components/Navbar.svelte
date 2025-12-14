<script>
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	const { data } = $props();
</script>

<div class="flex w-full gap-1 bg-sidebar p-2 px-3">
	<div class="flex w-1/3 gap-1">
		<img class="h-9 w-9 rounded-xl" src={data.icon} />
		<a class={buttonVariants({ variant: 'ghost' })} href="/">{data.name}'s dashboard</a>
	</div>
	<a class="{buttonVariants({ variant: 'ghost' })} mr-auto ml-auto">{data.guildCount} Servers</a>
	<div class="flex w-1/3 gap-1">
		{#if data.isAdmin}
			<a class={buttonVariants({ variant: 'ghost' })} href="/admin">Edit</a>
		{/if}
	</div>
</div>
