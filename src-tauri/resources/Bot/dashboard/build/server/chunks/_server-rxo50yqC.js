async function POST({ request, locals }) {
  const { name, page, type, value, values, multiple } = await request.json();
  const isAdmin = locals.isAdmin;
  if (!isAdmin) {
    return new Response("Forbidden: Not admin", { status: 403 });
  }
  if (locals.dashboard.inputs.find((input) => input.name === name)) {
    return new Response("Forbidden: Input Exists", { status: 403 });
  }
  locals.dashboard.addInput(
    name,
    page.toLowerCase().trim(),
    type.toLowerCase(),
    value,
    values,
    type.toLowerCase() === "text" ? false : multiple
  );
  return new Response("ok");
}

export { POST };
//# sourceMappingURL=_server-rxo50yqC.js.map
