import global from '@dojo/shim/global';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Registry } from '@dojo/widget-core/Registry';
import { Injector } from '@dojo/widget-core/Injector';
import { Store } from '@dojo/stores/Store';
import { registerRouterInjector } from '@dojo/routing/RouterInjector';

import { App } from './App';
import { getGlobalArticles, getFeedArticles, setFeedCategory } from './processes/feedProcesses';
import { getTags } from './processes/tagProcesses';
import { setToken } from './processes/loginProcesses';
import { changeRouteProcess } from './processes/routeProcesses';

class StoreInjector extends Injector {
	constructor(payload: any) {
		super(payload);
		payload.on('invalidate', () => {
			this.emit({ type: 'invalidate' });
		});
	}
}

const config = [
	{
		path: 'login',
		outlet: 'login'
	},
	{
		path: 'register',
		outlet: 'register'
	},
	{
		path: 'user/{id}',
		outlet: 'user',
		children: [
			{
				path: 'favorites',
				outlet: 'favorites'
			}
		]
	},
	{
		path: 'user/{id}',
		outlet: 'user'
	},
	{
		path: 'article/{id}',
		outlet: 'article'
	},
	{
		path: 'settings',
		outlet: 'settings'
	},
	{
		path: 'new-post',
		outlet: 'new-post'
	},
	{
		path: '/',
		outlet: 'home',
		defaultRoute: true
	}
];

const registry = new Registry();
const store = new Store<any>();
const router = registerRouterInjector(config, registry);

const authenticationToken = global.sessionStorage.getItem('access_jwt');

(changeRouteProcess(store) as any)((router as any)._history.current);
getTags(store)();

if (authenticationToken && authenticationToken !== 'undefined') {
	setToken(store)(authenticationToken);
	setFeedCategory(store)('user');
	getFeedArticles(store)();
} else {
	setFeedCategory(store)('global');
	getGlobalArticles(store)();
}

router.on('navstart', ({ path: fullPath }: any) => {
	const [path] = fullPath.split('?');
	(changeRouteProcess(store) as any)(path);
});

store.on('invalidate', () => {
	const currentRoute = store.get(store.path('route'));
	if (currentRoute) {
		router.setPath(currentRoute);
	}
});

registry.defineInjector('state', new StoreInjector(store));

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });

projector.append();
