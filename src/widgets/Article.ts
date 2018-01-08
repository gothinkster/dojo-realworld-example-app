import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';
import * as marked from 'marked';

import { Comment } from './Comment';

export interface ArticleProperties {
	article?: any;
	comments: any;
	loaded?: boolean;
	isAuthenticated: boolean;
	loggedInUser: string;
	addComment: any;
	deleteComment: any;
	onNewCommentInput: any;
	newComment: string;
}

export class Article extends WidgetBase<ArticleProperties> {
	private _addComment(event: any) {
		event.preventDefault();
		this.properties.addComment(this.properties.article.slug, this.properties.newComment);
	}

	private _onNewCommentInput(event: any) {
		this.properties.onNewCommentInput(event.target.value);
	}

	protected render() {
		const {
			isAuthenticated,
			newComment,
			deleteComment,
			loaded = false,
			comments,
			loggedInUser,
			article,
			article: { title, author = {}, createdAt }
		} = this.properties;

		if (!loaded) {
			return null;
		}

		console.log(comments);

		return v('div', { classes: 'article-page' }, [
			v('div', { classes: 'banner' }, [
				v('div', { classes: 'container' }, [
					v('h1', [title]),
					v('div', { classes: 'article-meta' }, [
						w(Link, { to: 'user', params: { id: author.username } }, [v('img', { src: author.image })]),
						v('div', { classes: 'info' }, [
							w(Link, { to: 'user', classes: 'author', params: { id: author.username } }, [
								author.username
							]),
							v('span', { classes: 'date' }, [new Date(createdAt).toDateString()])
						]),
						isAuthenticated
							? v(
									'button',
									{
										classes: [
											'btn',
											'btn-sm',
											author.following ? 'btn-secondary' : 'btn-outline-secondary'
										]
									},
									[
										v('i', { classes: 'ion-plus-round' }),
										`${author.following ? ' Unfollow' : ' Follow'} ${author.username}`
									]
								)
							: null,
						isAuthenticated
							? v(
									'button',
									{
										classes: [
											'btn',
											'btn-sm',
											article.favorited ? 'btn-primary' : 'btn-outline-primary'
										]
									},
									[
										v('i', { classes: 'ion-heart' }),
										`${article.favorited ? ' Unfavorite' : ' Favorite'}`,
										v('span', { classes: 'counter' }, [`(${article.favoritesCount})`])
									]
								)
							: null
					])
				])
			]),
			v('div', { classes: ['container', 'page'] }, [
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
					v('div', { classes: 'article-meta' }, [
						v('a', { href: '' }, [v('img', { src: author.image })]),
						v('div', { classes: 'info' }, [
							v('a', { href: '', classes: 'author' }, [author.username]),
							v('span', { classes: 'date' }, [new Date(createdAt).toDateString()])
						]),
						isAuthenticated
							? v(
									'button',
									{
										classes: [
											'btn',
											'btn-sm',
											author.following ? 'btn-secondary' : 'btn-outline-secondary'
										]
									},
									[
										v('i', { classes: 'ion-plus-round' }),
										`${author.following ? ' Unfollow' : ' Follow'} ${author.username}`
									]
								)
							: null,
						isAuthenticated
							? v(
									'button',
									{
										classes: [
											'btn',
											'btn-sm',
											article.favorited ? 'btn-primary' : 'btn-outline-primary'
										]
									},
									[
										v('i', { classes: 'ion-heart' }),
										`${article.favorited ? ' Unfavorite' : ' Favorite'}`,
										v('span', { classes: 'counter' }, [`(${article.favoritesCount})`])
									]
								)
							: null
					])
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
							comments.map((comment: any) => {
								return w(Comment, { comment, loggedInUser, deleteComment, slug: article.slug });
							})
						)
					])
				])
			])
		]);
	}
}
