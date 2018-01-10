import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Article, ArticleProperties } from './../widgets/Article';
import {
	getArticle,
	deleteCommentProcess,
	addCommentProcess,
	newCommentInputProcess,
	favoriteArticleProcess,
	followUserProcess,
	deleteArticleProcess
} from './../processes/articleProcesses';
import { State } from '../interfaces';

function getProperties(store: Store<State>, properties: ArticleProperties): ArticleProperties {
	const { get, path } = store;

	const article = get(path('article', 'item'));
	const authorProfile = get(path('article', 'item', 'author'));

	return {
		article,
		authorProfile,
		comments: get(path('article', 'comments')) || [],
		newComment: get(path('article', 'newComment')),
		loaded: get(path('article', 'loaded')),
		isAuthenticated: !!get(path('user', 'token')),
		loggedInUser: get(path('user', 'username')),
		deleteComment: deleteCommentProcess(store),
		addComment: addCommentProcess(store),
		onNewCommentInput: newCommentInputProcess(store),
		slug: properties.slug,
		getArticle: getArticle(store),
		favoriteArticle: favoriteArticleProcess(store),
		followUser: followUserProcess(store),
		deleteArticle: deleteArticleProcess(store),
		username: get(path('user', 'username'))
	};
}

export const ArticleContainer = Container(Article, 'state', { getProperties });
