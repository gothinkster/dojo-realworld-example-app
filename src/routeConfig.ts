import { Store } from '@dojo/stores/Store';
import { State } from './interfaces';
import { Params, MatchType } from '@dojo/routing/interfaces';
import { getArticleForEditor, clearEditorProcess } from './processes/editorProcesses';
import { getUserSettings } from './processes/settingsProcesses';
import { getArticle } from './processes/articleProcesses';
import { getProfileProcess } from './processes/profileProcesses';
import { fetchFeedProcess } from './processes/feedProcesses';

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
			onEnter: ({ username }: Params, type: MatchType) => {
				getProfileProcess(store)({ username });
				if (type === 'index') {
					fetchFeedProcess(store)({ type: 'user', page: 0, filter: username });
				}
			},
			children: [
				{
					path: 'favorites',
					outlet: 'favorites',
					onEnter: ({ username }: Params) => {
						fetchFeedProcess(store)({ type: 'favorites', page: 0, filter: username });
					}
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
			path: 'editor',
			outlet: 'new-post',
			children: [
				{
					path: 'editor/{slug}',
					outlet: 'edit-post',
					onEnter: ({ slug }: Params) => {
						getArticleForEditor(store)({ slug });
					},
					onExit: () => {
						clearEditorProcess(store)({});
					}
				}
			]
		},
		{
			path: '/',
			outlet: 'home',
			onEnter: () => {
				const isAuthenticated = !!store.get(store.path('user', 'token'));
				fetchFeedProcess(store)({ type: isAuthenticated ? 'feed' : 'global', page: 0, filter: '' });
			}
		}
	];
	return config;
}
