<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import {Button} from "$lib/components/ui/button/index.js";
	import {FolderOpenIcon, SaveIcon, LinkIcon} from "@lucide/svelte";
	import {Input} from "$lib/components/ui/input/index.js";
	import {Label} from "$lib/components/ui/label/index.js";
	import {open} from "@tauri-apps/plugin-dialog";
	import {Checkbox} from "$lib/components/ui/checkbox/index.js";
	let botName = $state(BotManager.selectedBot?.name ?? "")
	let botPath = $state(BotManager.selectedBot?.path ?? "")
	let botToken = $state(BotManager.selectedBot?.token ?? "")
	let clientSecret = $state(BotManager.selectedBot?.clientSecret ?? "")
	let presenceIntent = $state(BotManager.selectedBot?.presenceIntent ?? false)
	let membersIntent = $state(BotManager.selectedBot?.membersIntent ?? false)
	let messageContentIntent = $state(BotManager.selectedBot?.messageContentIntent ?? false)
	function selectFolder() {
		open({
			multiple: false,
			directory: true,
		}).then((path) => {
			botPath = path
		})
	}
	function save() {
		if(!botName.trim() || !botPath.trim() || !botToken.trim() || !clientSecret.trim()) return
		if(BotManager.bots.find(b =>  b.name === botName.trim() || b.path === botPath.trim()) && botName.trim() !== BotManager.selectedBot.name && botPath.trim() !== BotManager.selectedBot.path) return alert("Bot already exists!")
		BotManager.saveBotSettings(botName, botPath, botToken, clientSecret, presenceIntent, membersIntent, messageContentIntent)
	}
	function copyInviteLink() {
		const inviteLink = `https://discord.com/oauth2/authorize?client_id=${BotManager.selectedBot.clientId}&permissions=8&integration_type=0&scope=bot+applications.commands`
		navigator.clipboard.writeText(inviteLink).then(() => {
			alert("Invite link copied!")
		});
	}
</script>
<Button class="float-right mt-3 mr-3" title="Save" onclick={save}><SaveIcon></SaveIcon></Button>
<div class="w-full h-full flex flex-col gap-4 p-3">
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="name" class="text-right">Name</Label>
		<Input id="name" class="col-span-4 invalid:ring-2 invalid:ring-destructive" required bind:value={botName} />
	</div>
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="path" class="text-right">Folder</Label>
		<div class="flex col-span-4 gap-2">
			<Input id="path" class="flex-auto invalid:ring-2 invalid:ring-destructive" required bind:value={botPath}/>
			<Button title="Choose Folder" onclick={selectFolder}><FolderOpenIcon/></Button>
		</div>
	</div>
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="token" class="text-right">Bot Token</Label>
		<Input id="token" type="password" class="col-span-4 invalid:ring-2 invalid:ring-destructive" required bind:value={botToken} />
	</div>
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="secret" class="text-right">Client Secret</Label>
		<Input id="secret" type="password" class="col-span-4 invalid:ring-2 invalid:ring-destructive" required bind:value={clientSecret} />
	</div>
	{#if BotManager.selectedBot.clientId}
		<Button variant="secondary" class="self-end w-fit" title="Copy Invite Link" onclick={copyInviteLink}><LinkIcon/></Button>
	{/if}
		<Card.Root class="w-full h-fit gap-3">
		<Card.Header>
			<Card.Title>
				Intents
			</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-3">
			<div class="flex items-center gap-3">
				<Checkbox id="presence" bind:checked={presenceIntent} />
				<Label for="presence">Presence</Label>
			</div>
			<div class="flex items-center gap-3">
				<Checkbox id="members" bind:checked={membersIntent} />
				<Label for="members">Server Members</Label>
			</div>
			<div class="flex items-center gap-3">
				<Checkbox id="messageContent" bind:checked={messageContentIntent} />
				<Label for="messageContent">Message Content</Label>
			</div>
		</Card.Content>
	</Card.Root>
</div>
