<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from "$lib/components/ui/button/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { PlusIcon, EllipsisVerticalIcon, MinusIcon, FolderOpenIcon, FolderIcon } from '@lucide/svelte';
	import { dndzone } from "svelte-dnd-action";
	import Translation from "$lib/components/Translation.svelte";
	import {BotManager} from "$lib/classes/BotManager.svelte.js";
	import {App} from "$lib/classes/App.svelte.js";
	import Modal from "$lib/components/Modal.svelte";
	import {Input} from "$lib/components/ui/input/index.js";
	import {Label} from "$lib/components/ui/label/index.js";
	let folderName = $state("")
	let selectedFolderName = $state("")
	let isEditingFolder = $state(false)
	let {
		title,
		items,
		hideControls,
		isTriggers,
		allowMoving = true,
		ondelete = () => {},
		onadd = () => {},
		ondblclick = () => {},
		onclick = () => {},
		itemTitle = () => {},
		ondnd = () => {},
		html,
		selected = $bindable(),
		...props
	} = $props();

	function handleDnd({ detail }) {
		items.splice(0, items.length)
		detail.items.forEach(item => {
			items.push(item)
		})
		ondnd()
	}
	function editFolder() {
		BotManager.selectedBot.triggers.forEach(t => {
			if(t.folder?.toLowerCase().trim() === selectedFolderName?.toLowerCase().trim()) {
				t.folder = folderName?.toLowerCase().trim()
				BotManager.selectedBot.markAsModified(t.id)
			}
		})
		isEditingFolder = false
	}
</script>

<Card.Root class="w-full overflow-hidden h-full min-h-40 min-w-40 p-1 relative {props.class}">
	<Card.Content class="p-1 !px-0.5 h-full w-full overflow-hidden">
		<div class="flex h-fit -mr-1.5 mt-[-0.5em] py-0.5 font-bold">
		<label class="mr-auto text-md overflow-hidden text-ellipsis">
				<Translation text={title} />
			</label>
				<Button variant="ghost" size="icon" class="!p-1 !w-fit !h-fit !bg-transparent !cursor-pointer {hideControls ? 'hidden' : ''}" onclick={onadd}><PlusIcon /></Button>
				<Button variant="ghost" size="icon" class="!p-1 !w-fit !h-fit !bg-transparent !cursor-pointer {hideControls ? 'hidden' : ''}" onclick={() => {ondelete(); selected = null }}><MinusIcon /></Button>
		</div>
		<Separator />
		<ScrollArea class="h-[90%] w-full overflow-hidden">
			{#if allowMoving}
			<div
					use:dndzone={{ items, flipDurationMs: 150 }}
					onconsider={handleDnd}
					onfinalize={handleDnd}
			>
				{#each items as item, i (item.id)}
					<div class="w-full overflow-hidden">
						<div class="flex flex-row w-full overflow-hidden">
							<div class="py-1.25 opacity-50">
								<EllipsisVerticalIcon size={18} />
							</div>
							<Button
									noVariables
									variant={selected === item ? undefined : "ghost"}
									class="!p-1 !h-fit flex-1 hover:{selected === item ? '!bg-primary' : '!bg-accent'} w-full block text-ellipsis overflow-hidden"
									ondblclick={() => { selected = item; ondblclick(item) }}
									onclick={() => { selected = item; onclick(item)}}
							>
								{#if html}
									{@render html(item, i)}
								{/if}
								{#await itemTitle(item, i) then text}
									{text}
								{/await}
							</Button>
						</div>
						<Separator />
					</div>
				{/each}
			</div>
				{:else}
				{#if isTriggers}
				{#each BotManager.selectedBot?.triggerFolders.sort((a,b) => String(a).localeCompare(String(b))) as folder}
					{#if folder}
						<div class="w-full overflow-hidden">
							<Button
									variant="ghost"
									class="!p-1 !h-fit w-full hover:!bg-accent block text-ellipsis overflow-hidden !text-left !font-bold !text-md capitalize"
									ondblclick={() => { folderName = folder; selectedFolderName = folder; isEditingFolder = true }}
									onclick={() => { BotManager.selectedBot.triggerFolderStates[folder] = !BotManager.selectedBot.triggerFolderStates[folder] }}
							>
								{#if BotManager.selectedBot.triggerFolderStates[folder]}
								<FolderOpenIcon class="inline-block"/>{:else}
									<FolderIcon class="inline-block"/>
									{/if}<span class="ml-2 align-middle">{folder}</span>
							</Button>
						</div>
						<Separator />
						{/if}
					{#if BotManager.selectedBot.triggerFolderStates[folder] || !folder}
					{#each BotManager.selectedBot.triggers.filter(t => (t.folder?.toLowerCase().trim() || undefined) === folder?.toLowerCase().trim()) as item, i}
					<div class="w-full overflow-hidden relative">
							<Button
									variant={selected === item ? undefined : "ghost"}
									class="!p-1 !h-fit w-full hover:{selected === item ? '!bg-primary' : '!bg-accent'} block text-ellipsis overflow-hidden"
									ondblclick={() => { selected = item; ondblclick(item) }}
									onclick={() => { selected = item; onclick(item) }}
							>
								{#if html}
									{@render html(item, BotManager.selectedBot.triggers.indexOf(item))}
									{/if}
								{#await itemTitle(item, BotManager.selectedBot.triggers.indexOf(item)) then text}
									{text}
								{/await}
							</Button>
						</div>
						<Separator />
						{/each}
					{/if}
				{/each}
					{:else}

					{#each items as item, i}
						<div class="w-full overflow-hidden">
							<Button
									variant={selected === item ? undefined : "ghost"}
									class="!p-1 !h-fit w-full hover:{selected === item ? '!bg-primary' : '!bg-accent'} block text-ellipsis overflow-hidden"
									ondblclick={() => { selected = item; ondblclick(item) }}
									onclick={() => { selected = item; onclick(item) }}
							>
								{#if html}
									{@render html(item, i)}
								{/if}
								{#await itemTitle(item, i) then text}
									{text}
								{/await}
							</Button>
						</div>
						<Separator />
					{/each}
				{/if}
			{/if}
		</ScrollArea>
	</Card.Content>
</Card.Root>
<Modal bind:open={isEditingFolder} title="{selectedFolderName}" onDone={editFolder}>
	<div class="grid gap-4 py-4 px-1" >
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="name" class="text-right">Name</Label>
			<Input id="name" class="col-span-3 capitalize" bind:value={folderName} noVariables />
		</div>
	</div>
</Modal>