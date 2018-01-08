import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Article } from './../widgets/Article';
import {
	getArticle,
	deleteCommentProcess,
	addCommentProcess,
	newCommentInputProcess
} from './../processes/articleProcesses';

function getProperties(store: Store<any>, properties: any) {
	const { get, path } = store;
	const articleSlug = get(path('article', 'article', 'slug'));
	const isLoading = get(path('article', 'loading'));

	if (properties.slug !== articleSlug && !isLoading) {
		getArticle(store)(properties.slug);
	}

	return {
		article: get(path('article', 'article')),
		comments: get(path('article', 'comments')),
		newComment: get(path('article', 'newComment')),
		loaded: get(path('article', 'loaded')),
		isAuthenticated: get(path('session', 'isAuthenticated')),
		loggedInUser: get(path('session', 'username')),
		deleteComment: deleteCommentProcess(store),
		addComment: addCommentProcess(store),
		onNewCommentInput: newCommentInputProcess(store)
	};
}

export const ArticleContainer = Container(Article, 'state', { getProperties });
