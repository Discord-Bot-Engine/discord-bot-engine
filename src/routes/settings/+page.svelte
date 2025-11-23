<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import {Button} from "$lib/components/ui/button/index.js";
	import {FolderOpenIcon, SaveIcon, LinkIcon} from "@lucide/svelte";
	import {Input} from "$lib/components/ui/input/index.js";
	import {Label} from "$lib/components/ui/label/index.js";
	import {open} from "@tauri-apps/plugin-dialog";
	import {Checkbox} from "$lib/components/ui/checkbox/index.js";
	import {BotManager} from "$lib/classes/BotManager.svelte.js";
	import {App} from "$lib/classes/App.svelte.js";
	import {goto} from "$app/navigation";
	import Translation from "$lib/components/Translation.svelte";
	if(!BotManager.selectedBot) {
		App.translate("Please select a project!", App.selectedLanguage).then(text => {
			alert(text)
			goto("/");
		})
	}
	let botName = $state(BotManager.selectedBot?.name ?? "")
	let botPath = $state(BotManager.selectedBot?.path ?? "")
	let botToken = $state(BotManager.selectedBot?.token ?? "")
	let dashboardPort = $state(BotManager.selectedBot?.port ?? "3000")
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
		if(!botName.trim() || !botPath.trim() || !botToken.trim() || !clientSecret.trim() || !dashboardPort.trim()) return
		if(BotManager.bots.find(b =>  b.name === botName.trim() || b.path === botPath.trim()) && botName.trim() !== BotManager.selectedBot.name && botPath.trim() !== BotManager.selectedBot.path) return App.translate("Bot already exists!", App.selectedLanguage).then(text => {
			alert(text)
		})
		BotManager.saveBotSettings(botName, botPath, botToken, clientSecret, dashboardPort, presenceIntent, membersIntent, messageContentIntent)
	}
	function copyInviteLink() {
		const inviteLink = `https://discord.com/oauth2/authorize?client_id=${BotManager.selectedBot.clientId}&permissions=8&integration_type=0&scope=bot+applications.commands`
		navigator.clipboard.writeText(inviteLink).then(() => {
			App.translate("Invite link copied!", App.selectedLanguage).then(text => {
				alert(text)
			})
		});
	}
</script>
{#snippet saveBtn(text)}
<Button class="float-right mt-3 mr-3" title={text} onclick={save}><SaveIcon></SaveIcon></Button>
{/snippet}
<Translation text="Save" el={saveBtn}/>
<div class="w-full h-full flex flex-col gap-4 p-3">
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="name" class="text-right"><Translation text="Name"/></Label>
		<Input id="name" class="col-span-4 invalid:ring-2 invalid:ring-destructive" required bind:value={botName} />
	</div>
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="path" class="text-right"><Translation text="Folder"/></Label>
		<div class="flex col-span-4 gap-2">
			<Input id="path" class="flex-auto invalid:ring-2 invalid:ring-destructive" required bind:value={botPath}/>
			{#snippet folderBtn(text)}
				<Button title={text} onclick={selectFolder}><FolderOpenIcon/></Button>
			{/snippet}
			<Translation text="Choose Folder" el={folderBtn}/>
		</div>
	</div>
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="token" class="text-right"><Translation text="Bot Token"/></Label>
		<Input id="token" type="password" class="col-span-4 invalid:ring-2 invalid:ring-destructive" required bind:value={botToken} />
	</div>
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="secret" class="text-right"><Translation text="Client Secret"/></Label>
		<Input id="secret" type="password" class="col-span-4 invalid:ring-2 invalid:ring-destructive" required bind:value={clientSecret} />
	</div>
	<div class="grid grid-cols-5 items-center gap-4">
		<Label for="port" class="text-right"><Translation text="Dashboard Port"/></Label>
		<Input id="port" class="col-span-4 invalid:ring-2 invalid:ring-destructive" required bind:value={dashboardPort} />
	</div>
	{#if BotManager.selectedBot.clientId}
		{#snippet inviteBtn(text)}
			<Button variant="secondary" class="self-end w-fit" title={text} onclick={copyInviteLink}><LinkIcon/></Button>
		{/snippet}
		<Translation text="Copy Invite Link" el={inviteBtn}/>
	{/if}
		<Card.Root class="w-full h-fit gap-3">
		<Card.Header>
			<Card.Title class="text-xl">
				<Translation text="Intents"/>
			</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-3">
			<div class="flex items-center gap-3">
				<Checkbox id="presence" bind:checked={presenceIntent} />
				<Label for="presence" class="mt-auto mb-auto"><Translation text="Presence"/></Label>
			</div>
			<div class="flex items-center gap-3">
				<Checkbox id="members" bind:checked={membersIntent} />
				<Label for="members" class="mt-auto mb-auto"><Translation text="Server Members"/></Label>
			</div>
			<div class="flex items-center gap-3">
				<Checkbox id="messageContent" bind:checked={messageContentIntent} />
				<Label for="messageContent" class="mt-auto mb-auto"><Translation text="Message Content"/></Label>
			</div>
		</Card.Content>
	</Card.Root>
</div>
