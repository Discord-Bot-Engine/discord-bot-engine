async function load({ locals }) {
  const guilds = await locals.bot.client.cluster.broadcastEval(
    async (c, { id }) => {
      const results = await Promise.all(
        c.guilds.cache.map(async (g) => {
          const member = await g.members.fetch(id).catch(() => null);
          if (member?.permissions.has(32)) {
            return { id: g.id, name: g.name, icon: g.icon };
          }
          return null;
        })
      );
      return results.filter(Boolean);
    },
    { context: { id: locals.user.id } }
  );
  return {
    guilds: guilds.flat()
  };
}

var _page_server = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C_pcWSE_.js')).default;
const server_id = "src/routes/+page.server.js";
const imports = ["_app/immutable/nodes/2.DLcH9T54.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DxmLRnxC.js","_app/immutable/chunks/pcOpUFT1.js","_app/immutable/chunks/DHYJ9T3W.js","_app/immutable/chunks/CgjbjgXE.js"];
const stylesheets = ["_app/immutable/assets/card-title.bHHIbcsu.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server as server, server_id, stylesheets };
//# sourceMappingURL=2--0keVhaj.js.map
