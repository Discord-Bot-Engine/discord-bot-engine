async function POST({ params, request, locals }) {
  let { name, value } = await request.json();
  if (Array.isArray(value)) {
    value = value.filter((v) => v.trim());
  }
  const guilds = (await locals.bot.client.cluster.broadcastEval(
    (c, { id }) => c.guilds.cache.filter((g) => {
      const member = g.members.cache.get(id);
      if (!member) return;
      if (member.permissions.has(32)) return g;
    }).map((g) => ({ id: g.id, name: g.name, icon: g.icon })),
    {
      context: {
        id: locals.user.id
      }
    }
  )).flat();
  const guild = guilds?.find((g) => g.id === params.id);
  if (!guild) {
    return new Response("Forbidden: Guild not found", { status: 403 });
  }
  locals.dashboard.setInputValue(params.id, name, value);
  return new Response("ok");
}

export { POST };
//# sourceMappingURL=_server-BejetH7t.js.map
