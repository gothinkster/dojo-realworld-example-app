import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import { ArticlePreview } from './ArticlePreview';

export interface FeedsProperties {
	articles: any[];
	getGlobalArticles: any;
	getFeedArticles: any;
	feedCategory: string;
	isAuthenticated: boolean;
	onFav: Function;
}

export class Feeds extends WidgetBase<FeedsProperties> {
	protected render() {
		const { articles, isAuthenticated, feedCategory, getFeedArticles, getGlobalArticles, onFav } = this.properties;

		let articleList = v('div', { classes: 'article-preview' }, ['Loading...']);
		if (articles && articles.length === 0) {
			articleList = v('div', { classes: 'article-preview' }, ['No articles here, yet!']);
		} else if (articles && articles.length > 0) {
			articleList = v(
				'div',
				this.properties.articles.map((article, index) => {
					return w(ArticlePreview, { key: index, article, onFav, view: 'feed' });
				})
			);
		}

		return v('div', { classes: 'col-md-9' }, [
			v('div', { classes: 'feed-toggle' }, [
				v('ul', { classes: ['nav', 'nav-pills', 'outline-active'] }, [
					isAuthenticated
						? v('li', { classes: 'nav-item' }, [
								v(
									'a',
									{
										href: '#/',
										onclick: getFeedArticles,
										classes: ['nav-link', feedCategory === 'user' ? 'active' : null]
									},
									['Your Feeds']
								)
							])
						: null,
					v('li', { classes: 'nav-item' }, [
						v(
							'a',
							{
								href: '#/',
								onclick: getGlobalArticles,
								classes: ['nav-link', feedCategory === 'global' ? 'active' : null]
							},
							['Global Feeds']
						)
					])
				])
			]),
			articleList
		]);
	}
}
