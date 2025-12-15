<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	const sidebar = useSidebar();

	const { guild, items } = $props();
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel class="text-md"
				>{#if guild.icon}
					<img
						class="mr-3 h-7 w-7 rounded-xl"
						src="https://cdn.discordapp.com/icons/{guild.id}/{guild.icon}.png?size=100&quality=lossless"
					/>
				{/if}{guild.name}</Sidebar.GroupLabel
			>
			<Sidebar.GroupContent class="mt-3">
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
<Button variant="ghost" class="mt-auto mb-auto" onclick={sidebar.toggle}>
	{#if sidebar.open}
		<ChevronLeftIcon />
	{:else}
		<ChevronRightIcon />
	{/if}
</Button>
