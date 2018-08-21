import has from '@dojo/framework/has/has';
import global from '@dojo/framework/shim/global';
import { Registry } from '@dojo/framework/widget-core/Registry';
import { renderer } from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import { Store } from '@dojo/framework/stores/Store';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';

import { App } from './App';
import { getTagsProcess } from './processes/tagProcesses';
import { setSessionProcess } from './processes/loginProcesses';
import { changeRouteProcess } from './processes/routeProcesses';
import { State } from './interfaces';
import { getRouteConfig } from './config';

const store = new Store<State>();
const registry = new Registry();

const router = registerRouterInjector(getRouteConfig(store), registry);

let session;

if (!has('build-time-render')) {
	session = global.sessionStorage.getItem('conduit-session');
}

getTagsProcess(store)({});
if (session) {
	setSessionProcess(store)({ session: JSON.parse(session) });
}

router.on('nav', ({ outlet, context }: any) => {
	changeRouteProcess(store)({ outlet, context });
});

function onRouteChange() {
	const outlet = store.get(store.path('routing', 'outlet'));
	const params = store.get(store.path('routing', 'params'));
	if (outlet) {
		const link = router.link(outlet, params);
		if (link !== undefined) {
			router.setPath(link);
		}
	}
}

store.onChange(store.path('routing', 'outlet'), onRouteChange);
store.onChange(store.path('routing', 'params'), onRouteChange);

registry.defineInjector('state', () => () => store);

const r = renderer(() => w(App, {}));
r.mount({ domNode: document.getElementById('app')!, registry });
