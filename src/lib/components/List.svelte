<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { PlusIcon, EllipsisVerticalIcon, MinusIcon } from '@lucide/svelte';
	import { dndzone } from "svelte-dnd-action";

	let {
		title,
		items,
		hideControls,
		allowMoving = true,
		ondelete = () => {},
		onadd = () => {},
		ondblclick = () => {},
		itemTitle = () => {},
		selected = $bindable()
	} = $props();

	function handleDnd({ detail }) {
		items.splice(0, items.length)
		detail.items.forEach(item => {
			items.push(item)
		})
	}
</script>

<Card.Root class="w-full h-full min-h-40 p-1 relative">
	<Card.Content class="p-1">
		<div class="flex h-fit overflow-hiddenDashboard.js">
			<label class="mr-auto opacity-50 text-sm">{title}</label>
				<Button variant="ghost" size="icon" class="size-6 {hideControls ? 'hidden' : ''}" onclick={onadd}><PlusIcon /></Button>
				<Button variant="ghost" size="icon" class="size-6 {hideControls ? 'hidden' : ''}" onclick={() => {ondelete(); selected = null }}><MinusIcon /></Button>
		</div>
		<ScrollArea>
			{#if allowMoving}
			<div
					use:dndzone={{ items, flipDurationMs: 150 }}
					onconsider={handleDnd}
					onfinalize={handleDnd}
			>
				{#each items as item, i (item.id)}
					<div>
						<div class="flex flex-row w-full">
							<div class="py-1.25 opacity-50">
								<EllipsisVerticalIcon size={18} />
							</div>
							<Button
									noVariables
									variant={selected === item ? undefined : "ghost"}
									class="size-7 flex-1 hover:{selected === item ? '!bg-primary' : '!bg-accent'} overflow-hidden"
									ondblclick={() => { selected = item; ondblclick(item) }}
									onclick={() => selected = item}
							>
								{itemTitle(item, i)}
							</Button>
						</div>
						<Separator />
					</div>
				{/each}
			</div>
				{:else}
				{#each items as item, i}
					<div>
							<Button
									variant={selected === item ? undefined : "ghost"}
									class="size-7 w-full"
									ondblclick={() => { selected = item; ondblclick(item) }}
									onclick={() => selected = item}
							>
								{itemTitle(item, i)}
							</Button>
						</div>
						<Separator />
				{/each}
			{/if}
		</ScrollArea>
	</Card.Content>
</Card.Root>
