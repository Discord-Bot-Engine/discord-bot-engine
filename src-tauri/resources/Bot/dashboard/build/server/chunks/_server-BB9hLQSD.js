async function POST({ request, locals }) {
  const { name } = await request.json();
  const isAdmin = locals.isAdmin;
  if (!isAdmin) {
    return new Response("Forbidden: Not admin", { status: 403 });
  }
  locals.dashboard.deleteInput(name);
  return new Response("ok");
}

export { POST };
//# sourceMappingURL=_server-BB9hLQSD.js.map
