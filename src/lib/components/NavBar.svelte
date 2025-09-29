<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { CodeXmlIcon, HouseIcon, SettingsIcon, BlocksIcon } from '@lucide/svelte';

	let selectedItem = $state(0);

	// Menu items.
	const items = [
		{
			title: 'Home',
			url: '/',
			icon: HouseIcon
		},
		{
			title: 'Editor',
			url: '/editor',
			icon: CodeXmlIcon
		},
		{
			title: 'Settings',
			url: '/settings',
			icon: SettingsIcon
		},
		{
			title: 'Plugins',
			url: '/plugins',
			icon: BlocksIcon
		}
	];
</script>

<Sidebar.Root class="border-none" collapsible="icon">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Discord Bot Engine</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item, i (i)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class={selectedItem === i ? "!bg-primary" : ""}>
								{#snippet child({ props })}
									<a
										onclick={() => selectedItem = i}
										title={item.title}
										href={item.url}
										{...props}>
										<item.icon />
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