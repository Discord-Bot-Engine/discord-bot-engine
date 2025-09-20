<script>
	import '../app.css';
	import {App} from "$lib/classes/App.svelte.js"
	import NavBar from '$lib/components/NavBar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	let { children } = $props();
	if(!App.selectedBot && !["/", "/debugger", "/variables"].includes(page.route.id)) {
		alert("Please select a bot!")
		goto("/");
	}
</script>

{#if ["/debugger", "/variables"].includes(page.route.id)}
	<main class="w-full h-screen overflow-hidden">
		{@render children?.()}
	</main>

{:else}
	<Sidebar.Provider open={false} oncontextmenu={(ev) => {
	if(page.route.id !== "/editor") ev.preventDefault()
}}>
		<NavBar />
		<main class="w-full h-screen overflow-hidden">
			{@render children?.()}
		</main>
	</Sidebar.Provider>
{/if}