<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Pages from '$lib/components/Pages.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={data.icon} />
	<title>{data.name}</title>
</svelte:head>
<div class="h-screen w-screen overflow-hidden">
	<Navbar {data} />
	{@render children?.()}
</div>
