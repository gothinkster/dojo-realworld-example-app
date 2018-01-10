import { Store } from '@dojo/stores/Store';
import { State } from './interfaces';
import { Params } from '@dojo/routing/interfaces';
import { getArticleForEditor } from './processes/editorProcesses';
import { getUserSettings } from './processes/settingsProcesses';
import { getArticle } from './processes/articleProcesses';
import { getProfileProcess } from './processes/profileProcesses';

export function getRouteConfig(store: Store<State>) {
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
			path: 'user/{username}',
			outlet: 'user',
			onEnter: ({ username }: Params) => {
				getProfileProcess(store)({ username });
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
			outlet: 'article',
			onEnter: ({ slug }: Params) => {
				getArticle(store)({ slug });
			}
		},
		{
			path: 'settings',
			outlet: 'settings',
			onEnter: () => {
				getUserSettings(store)({});
			}
		},
		{
			path: 'editor/{slug}',
			outlet: 'edit-post',
			onEnter: ({ slug }: Params) => {
				getArticleForEditor(store)({ slug });
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
	return config;
}
