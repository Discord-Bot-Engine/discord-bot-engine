<script>
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import CustomInput from '$lib/components/Input.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { PlusIcon } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/select/index.js';
	const { data } = $props();
	let name = $state('');
	let value = $state('');
	let types = [
		'Text',
		'Dropdown',
		'Member',
		'Text Channel',
		'Voice Channel',
		'Category',
		'Channel',
		'Role',
		'Mentionable'
	].sort();
	let type = $state(types[0]);
	let values = $state('');
	let inputs = $state(data.inputs);
	let open = $state(false);
	async function addInput() {
		inputs.push({ name, value, type: type.toLowerCase(), values });
		const res = await fetch(`/admin/add`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, value, type, values })
		});

		if (!res.ok) {
			const text = await res.text();
			alert('Error: ' + text);
		}
		open = false;
	}
	async function deleteInput(name) {
		inputs = inputs.filter((i) => i.name !== name);
		const res = await fetch(`/admin/delete`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name })
		});

		if (!res.ok) {
			const text = await res.text();
			alert('Error: ' + text);
		}
	}
</script>

<div class="h-full w-full p-3">
	<div class="flex">
		<h1 class="text-xl font-bold">Editing {data.botName}</h1>
		<Dialog.Root bind:open>
			<Dialog.Trigger class={buttonVariants({ size: 'icon', class: 'ml-auto' })}
				><PlusIcon></PlusIcon></Dialog.Trigger
			>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Add Input</Dialog.Title>
				</Dialog.Header>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Name</Label>
						<Input id="name" bind:value={name} class="col-span-3" />
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="type" class="text-right">Type</Label>
						<Select.Root id="type" type="single" bind:value={type}>
							<Select.Trigger class="col-span-3 w-full">
								{types.includes(type) ? type : 'Select an option'}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Options</Select.Label>
									{#each types as value, i (i)}
										<Select.Item {value} label={value}>
											{value}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					{#if type === 'Dropdown' || type === 'Text'}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="value" class="text-right">Value</Label>
							<Input id="value" bind:value class="col-span-3" />
						</div>
					{/if}
					{#if type === 'Dropdown'}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="value" class="text-right">Values</Label>
							<Input
								id="value"
								bind:value={values}
								placeholder="Separated by ,"
								class="col-span-3"
							/>
						</div>
					{/if}
				</div>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Cancel</Dialog.Close>
					<Button onclick={addInput}>Done</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
	<ScrollArea>
		<div class="mt-3 grid h-full w-full gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			{#each inputs as input (input.name)}
				<CustomInput {input} isAdmin={true} onDelete={deleteInput} />
			{/each}
		</div>
	</ScrollArea>
</div>
