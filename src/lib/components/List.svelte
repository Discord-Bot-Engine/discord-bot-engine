<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from "$lib/components/ui/button/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { PlusIcon, EllipsisVerticalIcon, MinusIcon } from '@lucide/svelte';
	import { dndzone } from "svelte-dnd-action";

	let {
		title,
		items,
		hideControls,
			extraControl,
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
</script>

<Card.Root class="w-full h-full min-h-40 min-w-40 p-1 relative {props.class}">
	<Card.Content class="p-1 !px-0.5">
		<div class="flex h-fit -mr-1.5 mb-1 px-0.5">
			<label class="mr-auto text-md overflow-hidden text-ellipsis">{title}</label>
				<Button variant="ghost" size="icon" class="!p-1 !w-fit !h-fit !bg-transparent !cursor-pointer {hideControls ? 'hidden' : ''}" onclick={onadd}><PlusIcon /></Button>
				<Button variant="ghost" size="icon" class="!p-1 !w-fit !h-fit !bg-transparent !cursor-pointer {hideControls ? 'hidden' : ''}" onclick={() => {ondelete(); selected = null }}><MinusIcon /></Button>
		</div>
		<Separator />
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
									class="!p-1 !h-fit flex-1 hover:{selected === item ? '!bg-primary' : '!bg-accent'} block text-ellipsis overflow-hidden"
									ondblclick={() => { selected = item; ondblclick(item) }}
									onclick={() => { selected = item; onclick(item)}}
							>
								{#if html}
									{@render html(item, i)}
								{/if}
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
									class="!p-1 !h-fit w-full hover:{selected === item ? '!bg-primary' : '!bg-accent'} block text-ellipsis overflow-hidden"
									ondblclick={() => { selected = item; ondblclick(item) }}
									onclick={() => { selected = item; onclick(item) }}
							>
								{#if html}
									{@render html(item, i)}
								{/if}
								{itemTitle(item, i)}
							</Button>
						</div>
						<Separator />
				{/each}
			{/if}
		</ScrollArea>
	</Card.Content>
</Card.Root>
