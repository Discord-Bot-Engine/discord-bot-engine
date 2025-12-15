<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	const { guild } = $props();
</script>

<Card.Root>
	<div class="flex w-full">
		{#if guild.icon}
			<img
				class="ml-3 h-18 w-18 rounded-lg"
				src="https://cdn.discordapp.com/icons/{guild.id}/{guild.icon}.png?size=100&quality=lossless"
			/>
		{/if}
		<div class="w-full">
			<Card.Header>
				<Card.Title class="mt-3">
					{guild.name}
				</Card.Title>
			</Card.Header>
			<Card.Footer>
				<Button class="ml-auto" onclick={() => (location.href = './guild/' + guild.id + '/GENERAL')}
					>Edit</Button
				>
			</Card.Footer>
		</div>
	</div>
</Card.Root>
