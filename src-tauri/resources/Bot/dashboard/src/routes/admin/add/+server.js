export async function POST({ request, locals }) {
	const { name, type, value, values } = await request.json();

	const isAdmin = locals.isAdmin

	if (!isAdmin) {
		return new Response("Forbidden: Not admin", { status: 403 });
	}
	if(locals.dashboard.inputs.find(input => input.name === name)) {
		return new Response("Forbidden: Input Exists", { status: 403 });
	}
	locals.dashboard.addInput(name, type.toLowerCase(), value, values);

	return new Response("ok");
}
