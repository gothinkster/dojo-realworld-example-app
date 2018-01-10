import global from '@dojo/shim/global';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Registry } from '@dojo/widget-core/Registry';
import { Injector } from '@dojo/widget-core/Injector';
import { Store } from '@dojo/stores/Store';
import { registerRouterInjector } from '@dojo/routing/RouterInjector';

import { App } from './App';
import { getTags } from './processes/tagProcesses';
import { setSession } from './processes/loginProcesses';
import { changeRouteProcess } from './processes/routeProcesses';
import { getProfileProcess } from './processes/profileProcesses';
import { Params } from '@dojo/routing/interfaces';
import { State } from './interfaces';
import { getArticleForEditor } from './processes/editorProcesses';

class StoreInjector extends Injector {
	constructor(payload: any) {
		super(payload);
		payload.on('invalidate', () => {
			this.emit({ type: 'invalidate' });
		});
	}
}

const store = new Store<State>();
const registry = new Registry();

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
		onEnter: (params: Params) => {
			getProfileProcess(store)(params.id as any);
		},
		children: [
			{
				path: 'favorites',
				outlet: 'favorites'
			}
		]
	},
	{
		path: 'article/{slug}',
		outlet: 'article'
	},
	{
		path: 'settings',
		outlet: 'settings'
	},
	{
		path: 'editor/{slug}',
		outlet: 'edit-post',
		onEnter: (params: Params) => {
			getArticleForEditor(store)(params.slug as any);
		}
	},
	{
		path: 'editor',
		outlet: 'new-post'
	},
	{
		path: '/',
		outlet: 'home',
		defaultRoute: true
	}
];

const router = registerRouterInjector(config, registry);

registry.define('editor', async () => {
	const module = await import('./containers/EditorContainer');
	return module.EditorContainer;
});
registry.define('article', async () => {
	const module = await import('./containers/ArticleContainer');
	return module.ArticleContainer;
});
registry.define('login', async () => {
	const module = await import('./containers/LoginContainer');
	return module.LoginContainer;
});
registry.define('register', async () => {
	const module = await import('./containers/RegisterContainer');
	return module.RegisterContainer;
});
registry.define('profile', async () => {
	const module = await import('./containers/ProfileContainer');
	return module.ProfileContainer;
});
registry.define('settings', async () => {
	const module = await import('./containers/SettingsContainer');
	return module.SettingsContainer;
});

const session = global.sessionStorage.getItem('conduit-session');

getTags(store)();
if (session) {
	setSession(store)(JSON.parse(session));
}

router.on('nav', ({ path: fullPath, outlet, context }: any) => {
	(changeRouteProcess(store) as any)(outlet, context);
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

registry.defineInjector('state', new StoreInjector(store));

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });

projector.append();
