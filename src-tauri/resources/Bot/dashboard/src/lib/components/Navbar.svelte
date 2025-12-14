<script>
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	const { data } = $props();
</script>

<div class="flex w-full justify-between gap-1 bg-sidebar p-2 px-3">
	<div>
		<img class="h-9 w-9 rounded-xl" src={data.icon} />
		<a class={buttonVariants({ variant: 'ghost' })} href="/">{data.name}'s dashboard</a>
	</div>
	<a class={buttonVariants({ variant: 'ghost' })}>{data.guildCount} Servers</a>
	{#if data.isAdmin}
		<a class="{buttonVariants({ variant: 'ghost' })} ml-auto" href="/admin">Edit</a>
	{/if}
</div>
