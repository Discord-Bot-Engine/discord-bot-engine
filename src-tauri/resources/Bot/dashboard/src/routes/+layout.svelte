<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={data.icon} />
</svelte:head>
<div class="w-screen h-screen overflow-hidden">
	<Navbar data={data} />
	{@render children?.()}
</div>
