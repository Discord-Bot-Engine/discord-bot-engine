export async function load({ locals }) {
	return {
		guilds: (
			await locals.bot.client.cluster.broadcastEval(
				(c, { id }) =>
					c.guilds.cache
						.filter(async (g) => {
							const member = await g.members.fetch(id).catch(() => {});
							if (!member) return;
							if (member.permissions.has(0x20)) return g;
						})
						.map((g) => ({ id: g.id, name: g.name, icon: g.icon })),
				{
					context: {
						id: locals.user.id
					}
				}
			)
		).flat()
	};
}
