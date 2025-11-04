<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { CodeXmlIcon, HouseIcon, SettingsIcon, BlocksIcon, PaletteIcon, CheckIcon } from '@lucide/svelte';
	import { page } from '$app/state';
	import {Button} from "$lib/components/ui/button/index.js";
	import {App} from "$lib/classes/App.svelte.js"
	import {cn} from "$lib/utils.js";

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
	function setTheme(t) {
		localStorage.setItem('theme', t);
		if(t === null) localStorage.removeItem('theme');
		App.theme = t;
	}
</script>

<Sidebar.Root class="border-none" collapsible="icon">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Discord Bot Engine</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item, i (i)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class={page.url.pathname === item.url ? "!bg-primary" : ""}>
								{#snippet child({ props })}
									<a
										title={item.title}
										href={item.url}
										{...props}>
										<item.icon />
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
					<Sidebar.MenuItem>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger><Sidebar.MenuButton>
								{#snippet child({ props })}
									<Button title="Theme" class="w-8 h-8" variant="ghost"
											>
										<PaletteIcon/>
									</Button>
								{/snippet}
							</Sidebar.MenuButton></DropdownMenu.Trigger>
							<DropdownMenu.Content side="right">
								<DropdownMenu.Group>
									<DropdownMenu.Item class="!text-xs" onclick={() => setTheme(null)}><CheckIcon
											class={cn(`mr-2 size-4 ${App.theme === null ? "" : "opacity-0"}`)}
									/>Default</DropdownMenu.Item>
									{#each App.themes as theme}
										<DropdownMenu.Item class="!text-xs" onclick={() => setTheme(theme)}><CheckIcon
												class={cn(`mr-2 size-4 ${App.theme === theme ? "" : "opacity-0"}`)}
										/>{theme.split("\\").join("/").split("/").at(-1)}</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>