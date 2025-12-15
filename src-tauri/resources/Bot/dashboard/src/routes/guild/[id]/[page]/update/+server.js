export async function POST({ params, request, locals }) {
	const { name, value } = await request.json();

	const guild = locals.guilds?.find(g => g.id === params.id);

	if (!guild) {
		return new Response("Forbidden: Guild not found", { status: 403 });
	}

	locals.dashboard.setInputValue(params.id, name, value);

	return new Response("ok");
}
