import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Feeds, FeedsProperties } from './../widgets/Feeds';
import { fetchFeedProcess, favoriteFeedArticleProcess } from './../processes/feedProcesses';

import { State } from './../interfaces';

function getProperties(store: Store<State>, properties: FeedsProperties): FeedsProperties {
	const { get, path } = store;
	const loading = get(path('feed', 'loading'));
	const isAuthenticated = !!get(path('user', 'token'));
	const username = properties.username || get(path('user', 'username'));
	const type = properties.type
		? properties.type
		: isAuthenticated ? get(path('feed', 'category')) || 'feed' : 'global';

	return {
		items: get(path('feed', 'items')),
		type,
		fetchFeed: fetchFeedProcess(store),
		loading,
		username,
		isAuthenticated,
		tagName: get(path('feed', 'tagName')),
		favoriteArticle: favoriteFeedArticleProcess(store)
	};
}

export const FeedsContainer = Container(Feeds, 'state', { getProperties });
