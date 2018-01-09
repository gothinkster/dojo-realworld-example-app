import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';

import { Comment as CommentItem } from './../interfaces';

interface CommentProperties {
	comment: CommentItem;
	loggedInUser: string;
	deleteComment: any;
	slug: string;
}

export class Comment extends WidgetBase<CommentProperties> {
	private _deleteComment() {
		this.properties.deleteComment(this.properties.slug, this.properties.comment.id);
	}

	protected render() {
		const { comment, loggedInUser } = this.properties;
		return v('div', { classes: 'card' }, [
			v('div', { classes: 'card-block' }, [v('p', { classes: 'card-text' }, [comment.body])]),
			v('div', { classes: 'card-footer' }, [
				w(Link, { to: 'user', classes: 'comment-author', params: { id: comment.author.username } }, [
					v('img', { src: comment.author.image, classes: 'comment-author-img' })
				]),
				w(Link, { to: 'user', classes: 'comment-author', params: { id: comment.author.username } }, [
					` ${comment.author.username}`
				]),
				v('div', { classes: 'date-posted' }, [new Date(comment.createdAt).toDateString()]),
				loggedInUser
					? v('div', { classes: 'mod-options' }, [
							v('i', { classes: 'ion-trash-a', onclick: this._deleteComment })
						])
					: null
			])
		]);
	}
}
