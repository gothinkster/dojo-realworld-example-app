import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';
import * as marked from 'marked';

import { Comment } from './Comment';
import { ArticleItem, Comment as CommentItem, AuthorProfile, WithTarget } from '../interfaces';
import { ArticleMeta } from './ArticleMeta';

export interface ArticleProperties {
	article: ArticleItem;
	authorProfile: AuthorProfile;
	comments: CommentItem[];
	loaded: boolean;
	isAuthenticated: boolean;
	loggedInUser: string;
	newComment: string;
	slug: string;
	username: string;
	favoriteArticle: (opts: { slug: string; favorited: boolean }) => void;
	followUser: (opts: { username: string; following: boolean }) => void;
	deleteArticle: (opts: { slug: string }) => void;
	deleteComment: (opts: { slug: string; id: number }) => void;
	onNewCommentInput: (opts: { newComment: string }) => void;
	addComment: (options: { slug: string; newComment: string }) => void;
}

export class Article extends WidgetBase<ArticleProperties> {
	private _addComment(event: WithTarget<MouseEvent>) {
		event.preventDefault();
		if (this.properties.article) {
			const { article: { slug }, newComment } = this.properties;
			this.properties.addComment({ slug, newComment });
		}
	}

	private _onNewCommentInput(event: WithTarget<MouseEvent>) {
		this.properties.onNewCommentInput({ newComment: event.target.value });
	}

	protected render() {
		const {
			username,
			deleteArticle,
			followUser,
			favoriteArticle,
			isAuthenticated,
			newComment,
			deleteComment,
			comments,
			loaded,
			loggedInUser,
			article
		} = this.properties;

		if (!loaded) {
			return v('div', { classes: 'article-page' }, [v('div', { key: 'banner', classes: 'banner' })]);
		}

		const { createdAt, slug, favorited, favoritesCount, author: authorProfile } = article;

		return v('div', { classes: 'article-page' }, [
			v('div', { key: 'banner', classes: 'banner' }, [
				v('div', { classes: 'container' }, [
					v('h1', [article.title]),
					isAuthenticated
						? w(ArticleMeta, {
								authorProfile,
								slug,
								createdAt,
								favoriteArticle,
								followUser,
								deleteArticle,
								username,
								favorited,
								favoritesCount
							})
						: null
				])
			]),
			v('div', { key: 'page', classes: ['container', 'page'] }, [
				v('div', { classes: ['row', 'article-content'] }, [
					v('div', { classes: 'col-xs-12' }, [
						v('div', { innerHTML: marked(article.body, { sanitize: true }) }),
						v(
							'ul',
							{ classes: 'tag-list' },
							article.tagList.map((tag: string) => {
								return v('li', { classes: ['tag-default', 'tag-pill', 'tag-outline'] }, [tag]);
							})
						)
					])
				]),
				v('hr'),
				v('div', { classes: 'article-actions' }, [
					isAuthenticated
						? w(ArticleMeta, {
								authorProfile,
								slug,
								createdAt,
								favoriteArticle,
								followUser,
								deleteArticle,
								username,
								favorited,
								favoritesCount
							})
						: null
				]),
				v('div', { classes: 'row' }, [
					v('div', { classes: ['col-xs-12', 'col-md-8', 'offset-md-2'] }, [
						isAuthenticated
							? v('form', { classes: ['card', 'comment-form'] }, [
									v('div', { classes: 'card-block' }, [
										v('textarea', {
											value: newComment,
											oninput: this._onNewCommentInput,
											classes: 'form-control',
											placeholder: 'Write a comment...',
											rows: 3
										})
									]),
									v('div', { classes: 'card-footer' }, [
										v('img', { classes: 'comment-author-img', src: '' }),
										v(
											'button',
											{ onclick: this._addComment, classes: ['btn', 'btn-sm', 'btn-primary'] },
											['Post Comment']
										)
									])
								])
							: v('p', [
									w(Link, { to: 'login' }, ['Sign In']),
									' or ',
									w(Link, { to: 'register' }, ['Sign Up']),
									' to add comments on this article.'
								]),
						v(
							'div',
							comments.map((comment: CommentItem, index: number) => {
								return w(Comment, {
									key: index,
									comment,
									loggedInUser,
									deleteComment,
									slug: article.slug
								});
							})
						)
					])
				])
			])
		]);
	}
}
