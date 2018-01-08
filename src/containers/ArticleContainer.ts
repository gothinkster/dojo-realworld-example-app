import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Article } from './../widgets/Article';
import { getArticle } from './../processes/articleProcesses';

function getProperties(store: Store<any>, properties: any) {
	const { get, path } = store;
	const articleSlug = get(path('article', 'article', 'slug'));
	const isLoading = get(path('article', 'loading'));

	if (properties.slug !== articleSlug && !isLoading) {
		getArticle(store)(properties.slug);
	}

	return {
		article: get(path('article', 'article')),
		loaded: get(path('article', 'loaded'))
	};
}

export const ArticleContainer = Container(Article, 'state', { getProperties });
