<script>
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	import { convertFileSrc } from '@tauri-apps/api/core';
	let { children } = $props();
	import {App} from "$lib/classes/App.svelte.js"
	document.addEventListener('keydown', function (event) {
		if (
				event.key === 'F5' ||
				(event.ctrlKey && event.key === 'r') ||
				(event.metaKey && event.key === 'r')
		) {
			event.preventDefault();
		}
	});
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
{#if App.theme}
	<link rel="stylesheet" href="{convertFileSrc(App.theme)}">
{/if}