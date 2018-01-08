import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Feeds, FeedsProperties } from './../widgets/Feeds';
import { getGlobalArticles, getFeedArticles } from './../processes/feedProcesses';
import { favArticle } from './../processes/articleProcesses';

function getProperties(store: Store<any>, properties: FeedsProperties): FeedsProperties {
	const { get, path } = store;
	const feedLoaded = get(path('feed', 'loaded'));
	const feedLoading = get(path('feed', 'loading'));
	const isAuthenticated = get(path('session', 'isAuthenticated'));

	if (!feedLoaded && !feedLoading) {
		isAuthenticated ? getFeedArticles(store)() : getGlobalArticles(store)();
	}
	return {
		articles: get(path('feed', 'articles')),
		feedCategory: get(path('feed', 'category')),
		isAuthenticated: isAuthenticated,
		getGlobalArticles: getGlobalArticles(store),
		getFeedArticles: getFeedArticles(store),
		onFav: favArticle(store)
	};
}

export const FeedsContainer = Container(Feeds, 'state', { getProperties });
