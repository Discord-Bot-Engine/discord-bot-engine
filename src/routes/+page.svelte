<script>
	import LoadingScreen from "$lib/components/LoadingScreen.svelte";
	import {PlusIcon, FolderOpenIcon} from "@lucide/svelte";
	import Bot from "$lib/components/Bot.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { open } from '@tauri-apps/plugin-dialog';
	import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
	import {BotManager} from "$lib/classes/BotManager.svelte.js";
	import {App} from "$lib/classes/App.svelte.js";
	import Translation from "$lib/components/Translation.svelte";
	let isLoading = $state(false);
	let isCreating = $state(false)
	let botName = $state("")
	let botPath = $state("")
	async function createBot() {
		if(!botName.trim() || !botPath.trim()) return;
		if(BotManager.bots.find(b => b.name === botName.trim() || b.path === botPath.trim())) return alert("Project already exists!");
		isCreating = false
		isLoading = true;
		await BotManager.createBot(botName, botPath)
		isLoading = false;
	}
	function selectFolder() {
		open({
			multiple: false,
			directory: true,
		}).then((path) => {
			botPath = path
		})
	}
</script>
<Dialog.Root bind:open={isCreating}>
	{#snippet createBtn(text)}
		<Dialog.Trigger title={text} class="absolute top-3 right-3 z-10 {buttonVariants()}"
	><PlusIcon/></Dialog.Trigger
	>
	{/snippet}
<Translation text="Create Project" el={createBtn}/>
	<Dialog.Content class="sm:max-w-[425px] px-4.5" >
		<Dialog.Header>
			<Dialog.Title>
				<Translation text="Create Project" />
			</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">
					<Translation text="Name" />
				</Label>
				<Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={botName} />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="path" class="text-right">
					<Translation text="Folder" />
				</Label>
				<div class="flex col-span-3 gap-2">
					<Input id="path" class="flex-auto invalid:ring-2 invalid:ring-destructive" required bind:value={botPath}/>
					<Button title="Choose Folder" onclick={selectFolder}><FolderOpenIcon/></Button>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Dialog.Close class="{buttonVariants({variant:'secondary'})} !p-3 !h-fit">
				<Translation text="Cancel" />
			</Dialog.Close>
			<Button class="!p-3 !h-fit" onclick={createBot}>
				<Translation text="Create" />
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
	<ScrollArea>
		<div class="w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 gap-3 mt-12">
			{#each BotManager.bots as bot}
				<Bot {bot}/>
			{/each}
		</div>
	</ScrollArea>
<LoadingScreen {isLoading} />