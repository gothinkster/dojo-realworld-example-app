import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';
import { AuthorProfile } from '../interfaces';
import { ArticleControls } from './ArticleControls';
import { ArticleAuthorControls } from './ArticleAuthorControls';

interface ArticleMetaProperties {
	authorProfile: AuthorProfile;
	favoriteArticle: Function;
	followUser: Function;
	deleteArticle: Function;
	username: string;
	favorited: boolean;
	favoritesCount: number;
	createdAt: string;
	slug: string;
}

export class ArticleMeta extends WidgetBase<ArticleMetaProperties> {
	protected render() {
		const {
			favoriteArticle,
			followUser,
			deleteArticle,
			username,
			favorited,
			favoritesCount,
			createdAt,
			slug,
			authorProfile
		} = this.properties;

		return v('div', { classes: 'article-meta' }, [
			w(Link, { to: 'user', params: { id: authorProfile.username } }, [v('img', { src: authorProfile.image })]),
			v('div', { classes: 'info' }, [
				w(Link, { to: 'user', classes: 'author', params: { id: authorProfile.username } }, [
					authorProfile.username
				]),
				v('span', { classes: 'date' }, [new Date(createdAt).toDateString()])
			]),
			username === authorProfile.username
				? w(ArticleAuthorControls, {
						slug,
						deleteArticle
					})
				: w(ArticleControls, {
						favorited,
						followUser,
						favoriteArticle,
						favoritesCount,
						slug,
						following: authorProfile.following,
						authorUsername: authorProfile.username
					})
		]);
	}
}
