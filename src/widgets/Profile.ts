import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import { ArticlePreview } from './ArticlePreview';

export interface ProfileProperties {
	username: string;
	bio: string;
	image: string;
	email: string;
	articles: any[];
	articleType: string;
	onFav: Function;
}

export class Profile extends WidgetBase<ProfileProperties> {
	protected render() {
		let { username, bio, image, articles, articleType, onFav } = this.properties;

		let articleList = v('div', { classes: 'article-preview' }, ['Loading...']);
		articles = articles ? articles.filter((article) => article.favorited || articleType === 'my') : articles;
		if (articles && articles.length === 0) {
			articleList = v('div', { classes: 'article-preview' }, ['No articles here, yet!']);
		} else if (articles && articles.length > 0) {
			articleList = v(
				'div',
				articles.map((article, index) => {
					return w(ArticlePreview, { key: index, article, onFav, view: 'profile' });
				})
			);
		}

		return v('div', { classes: 'profile-page' }, [
			v('div', { classes: 'user-info' }, [
				v('div', { classes: 'container' }, [
					v('div', { classes: 'row' }, [
						v('div', { classes: ['col-xs-12', 'col-md-10', 'offset-md-1'] }, [
							v('img', { src: image, classes: 'user-img' }),
							v('h4', [username]),
							v('p', [bio]),
							v('button', { classes: ['btn', 'btn-sm', 'btn-outline-secondary', 'action-btn'] }, [
								v('i', { classes: 'ion-plus-round' }),
								` Follow ${username}`
							])
						])
					])
				])
			]),
			v('div', { classes: 'container' }, [
				v('div', { classes: 'row' }, [
					v('div', { classes: ['col-xs-12', 'col-md-10', 'offset-md-1'] }, [
						v('div', { classes: 'articles-toggle' }, [
							v('ul', { classes: ['nav', 'nav-pills', 'outline-active'] }, [
								v('li', { classes: 'nav-item' }, [
									v(
										'a',
										{
											href: `#user/${username}`,
											classes: ['nav-link', articleType === 'my' ? 'active' : null]
										},
										['My Articles']
									)
								]),
								v('li', { classes: 'nav-item' }, [
									v(
										'a',
										{
											href: `#user/${username}/favorites`,
											classes: ['nav-link', articleType === 'fav' ? 'active' : null]
										},
										['Favorited Articles']
									)
								])
							])
						]),
						articleList
					])
				])
			])
		]);
	}
}
