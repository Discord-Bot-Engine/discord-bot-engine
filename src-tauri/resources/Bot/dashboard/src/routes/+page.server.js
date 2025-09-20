export async function load({ locals }) {
	return {
		guilds: locals.guilds,
	};
}