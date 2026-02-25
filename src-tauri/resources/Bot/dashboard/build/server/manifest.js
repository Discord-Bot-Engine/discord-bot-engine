const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.B3xnlM3q.js",app:"_app/immutable/entry/app.M-CZUiNB.js",imports:["_app/immutable/entry/start.B3xnlM3q.js","_app/immutable/chunks/CuF6MoFF.js","_app/immutable/chunks/_NbspONZ.js","_app/immutable/chunks/DxmLRnxC.js","_app/immutable/entry/app.M-CZUiNB.js","_app/immutable/chunks/DxmLRnxC.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/_NbspONZ.js","_app/immutable/chunks/DHYJ9T3W.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-0GDEtaCz.js')),
			__memo(() => import('./chunks/1-Dm7RBT4S.js')),
			__memo(() => import('./chunks/2-CN0OvfSM.js')),
			__memo(() => import('./chunks/3-DJUmLJaK.js')),
			__memo(() => import('./chunks/4-CPwyixT5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin/add",
				pattern: /^\/admin\/add\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-rxo50yqC.js'))
			},
			{
				id: "/admin/delete",
				pattern: /^\/admin\/delete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-BB9hLQSD.js'))
			},
			{
				id: "/auth/callback",
				pattern: /^\/auth\/callback\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-DhPGFGm4.js'))
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-Cq6HfHag.js'))
			},
			{
				id: "/guild/[id]/[page]",
				pattern: /^\/guild\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"page","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/guild/[id]/[page]/update",
				pattern: /^\/guild\/([^/]+?)\/([^/]+?)\/update\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"page","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-BejetH7t.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
