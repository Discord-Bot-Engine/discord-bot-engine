<script>
	import List from '$lib/components/List.svelte';
	import Triggers from '$lib/components/Triggers.svelte';
	import Actions from "$lib/components/Actions.svelte";
	import DbeInput from "$lib/components/DbeInput.svelte";
	import DbeColor from "$lib/components/DbeColor.svelte";
	import DbeLabel from "$lib/components/DbeLabel.svelte";
	import DbeButton from "$lib/components/DbeButton.svelte";
	import DbeSelect from "$lib/components/DbeSelect.svelte";
	import DbeList from "$lib/components/DbeList.svelte";
	import DbeVariableList from "$lib/components/DbeVariableList.svelte";
	import DbeTriggerList from "$lib/components/DbeTriggerList.svelte";
	import {App} from "$lib/classes/App.svelte.js"
	import TopBar from "$lib/components/TopBar.svelte";
	import Run from "$lib/components/Run.svelte";
	import Variables from "$lib/components/Variables.svelte";
	import VariablesContextMenu from "$lib/components/VariablesContextMenu.svelte";
	import {onMount} from "svelte";
	import Action from "$lib/classes/Action.svelte.js";
	import CustomElement from "$lib/classes/CustomElement.svelte.js";
	import Extension from "$lib/classes/Extension.svelte.js";
	import Trigger from "$lib/classes/Trigger.svelte.js";
	import Bot from "$lib/classes/Bot.svelte.js";
	import {BotManager} from "$lib/classes/BotManager.svelte.js";
	import {Debugger} from "$lib/classes/Debugger.svelte.js";
	import {PluginManager} from "$lib/classes/PluginManager.svelte.js";
	import LoadingScreen from "$lib/components/LoadingScreen.svelte";
	import {goto} from "$app/navigation";
	import {SvelteFlowProvider} from "@xyflow/svelte";
	import {Button} from "$lib/components/ui/button/index.js";
	if(!BotManager.selectedBot) {
		App.translate("Please select a project!", App.selectedLanguage).then(text => {
			alert(text)
			goto("/");
		})
	}
	onMount(() => {
		window.handlers ??= {}
		window.Action = Action;
		window.Trigger = Trigger;
		window.App = App;
		window.Bot = Bot;
		window.BotManager = BotManager;
		window.CustomElement = CustomElement;
		window.Debugger = Debugger;
		window.Extension = Extension;
		window.PluginManager = PluginManager;
	})
	$effect(() => {
		App.updateActivity()
	})
</script>
<TopBar />
<div class="flex flex-col w-full h-full gap-1 p-1">
	<div class="flex gap-1 grow overflow-hidden">
		<Triggers />
		<div class="grow">
			<SvelteFlowProvider>
				<Actions title="Actions" actions={App.selectedTrigger?.actions} />
			</SvelteFlowProvider>
		</div>
		<Variables />
	</div>
	<div class="pb-7.5">
		<Run/>
	</div>
</div>
<VariablesContextMenu />
<LoadingScreen isLoading={BotManager.selectedBot?.isLoading}/>