import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Article } from './../widgets/Article';

function getProperties(store: Store<any>, properties: any) {
	const { get, path } = store;

	if (properties.id && properties.id !== get(path('article', 'slug'))) {
		// get article
	}

	return {
		article: get(path('article')) || {}
	};
}

export const ArticleContainer = Container(Article, 'state', { getProperties });
