import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Feeds } from './../widgets/Feeds';
import { getGlobalArticles, getFeedArticles } from './../processes/feedProcesses';

function getProperties(store: Store<any>, properties: any) {
	const { get, path } = store;
	return {
		articles: get(path('articles')),
		getGlobalArticles: getGlobalArticles(store),
		getFeedArticles: getFeedArticles(store),
		feedCategory: get(path('feedCategory')),
		isAuthenticated: get(path('session', 'isAuthenticated'))
	};
}

export const FeedsContainer = Container(Feeds, 'state', { getProperties });
