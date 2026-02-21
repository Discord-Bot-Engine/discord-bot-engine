async function POST({ params, request, locals }) {
  let { name, value } = await request.json();
  if (Array.isArray(value)) {
    value = value.filter((v) => v.trim());
  }
  const guild = locals.guilds?.find((g) => g.id === params.id);
  if (!guild) {
    return new Response("Forbidden: Guild not found", { status: 403 });
  }
  locals.dashboard.setInputValue(params.id, name, value);
  return new Response("ok");
}

export { POST };
//# sourceMappingURL=_server-BYonjeNE.js.map
