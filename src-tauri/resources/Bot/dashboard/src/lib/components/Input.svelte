<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	const { input, isAdmin, onChange, onDelete, roles = [], members = [], channels = [] } = $props();
	const mentionables = [...roles, ...members];
	import * as Select from '$lib/components/ui/select/index.js';
	let value = $state(input.value);
	import { TrashIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Card.Root>
	<Card.Header>
		<div class="flex w-full">
			<Card.Title>
				{input.name}
			</Card.Title>
			{#if isAdmin}
				<Button
					class="ml-auto"
					variant="destructive"
					onclick={() => onDelete(input.name)}
					size="icon"><TrashIcon></TrashIcon></Button
				>
			{/if}
		</div>
		{#if input.type === 'text'}
			<Input
				disabled={isAdmin}
				class="mt-1 w-full"
				bind:value
				onchange={(ev) => {
					input.value = ev.target.value;
					onChange(input.name, input.value);
				}}
			></Input>
		{:else if input.type === 'dropdown'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => input.values.includes(value)).length !== 0
							? `${value}`
							: 'Select options'
						: input.values.includes(value)
							? value
							: 'Select an option'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Options</Select.Label>
						{#each input.values as value, i (i)}
							<Select.Item {value} label={value}>
								{value}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else if input.type === 'role'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => roles.find((v) => v.id === value)).length !== 0
							? `${value.map((value) => (roles.find((v) => v.id === value).name === '@everyone' ? '' : '@') + roles.find((v) => v.id === value).name)}`
							: 'Select roles'
						: roles.find((v) => v.id === value)
							? `${(roles.find((v) => v.id === value).name === '@everyone' ? '' : '@') + roles.find((v) => v.id === value).name}`
							: 'Select a role'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Roles</Select.Label>
						{#each roles as value, i (i)}
							<Select.Item
								value={value.id}
								label={(value.name === '@everyone' ? '' : '@') + value.name}
							>
								{(value.name === '@everyone' ? '' : '@') + value.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else if input.type === 'member'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => members.find((v) => v.id === value)).length !== 0
							? `${value.map((value) => '@' + members.find((v) => v.id === value).name)}`
							: 'Select members'
						: members.find((v) => v.id === value)
							? `#${members.find((v) => v.id === value).name}`
							: 'Select a member'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Members</Select.Label>
						{#each members as value, i (i)}
							<Select.Item value={value.id} label={'@' + value.name}>
								@{value.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else if input.type === 'channel'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => channels.find((v) => v.id === value)).length !== 0
							? `${value.map((value) => (channels.find((v) => v.id === value).type === 4 ? '' : '#') + channels.find((v) => v.id === value).name)}`
							: 'Select channels'
						: channels.find((v) => v.id === value)
							? `${channels.find((v) => v.id === value).type === 4 ? '' : '#'}${channels.find((v) => v.id === value).name}`
							: 'Select a channel'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Channels</Select.Label>
						{#each channels as value, i (i)}
							<Select.Item value={value.id} label={(value.type === 4 ? '' : '#') + value.name}>
								{(value.type === 4 ? '' : '#') + value.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else if input.type === 'text channel'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => channels.find((v) => v.id === value)).length !== 0
							? `${value.map((value) => '#' + channels.find((v) => v.id === value).name)}`
							: 'Select channels'
						: channels.find((v) => v.id === value)
							? `#${channels.find((v) => v.id === value).name}`
							: 'Select a channel'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Text Channels</Select.Label>
						{#each channels.filter((c) => c.isTextBased) as value, i (i)}
							<Select.Item value={value.id} label={'#' + value.name}>
								#{value.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else if input.type === 'voice channel'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => channels.find((v) => v.id === value)).length !== 0
							? `${value.map((value) => '#' + channels.find((v) => v.id === value).name)}`
							: 'Select channels'
						: channels.find((v) => v.id === value)
							? `#${channels.find((v) => v.id === value).name}`
							: 'Select a channel'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Voice Channels</Select.Label>
						{#each channels.filter((c) => c.isVoiceBased) as value, i (i)}
							<Select.Item value={value.id} label={'#' + value.name}>
								#{value.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else if input.type === 'category'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => channels.find((v) => v.id === value)).length !== 0
							? `${value.map((value) => channels.find((v) => v.id === value).name)}`
							: 'Select categories'
						: channels.find((v) => v.id === value)
							? `${channels.find((v) => v.id === value).name}`
							: 'Select a category'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Categories</Select.Label>
						{#each channels.filter((c) => c.type === 4) as value, i (i)}
							<Select.Item value={value.id} label={value.name}>
								{value.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else if input.type === 'mentionable'}
			<Select.Root
				disabled={isAdmin}
				type={input.multiple ? 'multiple' : 'single'}
				bind:value
				onValueChange={(value) => {
					input.value = value;
					onChange(input.name, input.value);
				}}
			>
				<Select.Trigger class="w-full">
					{input.multiple
						? value.filter((value) => mentionables.find((v) => v.id === value)).length !== 0
							? `${value.map((value) => '@' + mentionables.find((v) => v.id === value).name)}`
							: 'Select mentionable'
						: mentionables.find((v) => v.id === value)
							? `@${mentionables.find((v) => v.id === value).name}`
							: 'Select a mentionable'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Members</Select.Label>
						{#each members as value, i (i)}
							<Select.Item value={value.id} label={'@' + value.name}>
								@{value.name}
							</Select.Item>
						{/each}
					</Select.Group>
					<Select.Group>
						<Select.Label>Roles</Select.Label>
						{#each roles as value, i (i)}
							<Select.Item value={value.id} label={'@' + value.name}>
								@{value.name}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{/if}
	</Card.Header>
</Card.Root>
