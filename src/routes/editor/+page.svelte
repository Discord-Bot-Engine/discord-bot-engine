<script>
	import List from '$lib/components/List.svelte';
	import Triggers from '$lib/components/Triggers.svelte';
	import Actions from "$lib/components/Actions.svelte";
	import DbeActionList from "$lib/components/DbeActionList.svelte";
	import DbeInput from "$lib/components/DbeInput.svelte";
	import DbeLabel from "$lib/components/DbeLabel.svelte";
	import DbeSelect from "$lib/components/DbeSelect.svelte";
	import DbeList from "$lib/components/DbeList.svelte";
	import DbeVariableList from "$lib/components/DbeVariableList.svelte";
	import {App} from "$lib/classes/App.svelte.js"
	import TopBar from "$lib/components/TopBar.svelte";
	import Run from "$lib/components/Run.svelte";
	import Variables from "$lib/components/Variables.svelte";
	import VariablesContextMenu from "$lib/components/VariablesContextMenu.svelte";
	import {onMount} from "svelte";
	onMount(() => {
		window.handlers ??= {}
	})
</script>
<TopBar />
<div class="grid grid-cols-5 grid-rows-7 w-full h-full gap-3 p-3">
	<div class="row-span-4 col-span-1">
		<Triggers />
	</div>
	<div class="row-span-4 col-span-3">
		<Actions title="Actions" actions={App.selectedTrigger?.actions} />
	</div>
	<div class="row-span-4 col-span-1">
		<Variables />
	</div>
	<div class="col-span-full row-span-3 pb-7.5 h-full">
		<Run/>
	</div>
</div>
<VariablesContextMenu />