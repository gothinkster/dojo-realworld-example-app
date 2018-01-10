import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';

import { ArticlePreview } from './ArticlePreview';
import { ArticleItem } from '../interfaces';

export interface FeedsProperties {
	fetchFeed: Function;
	favoriteArticle: Function;
	items: ArticleItem[];
	loading: boolean;
	type: string;
	tagName: string;
	username: string;
	isAuthenticated: boolean;
}

export class Feeds extends WidgetBase<FeedsProperties> {
	onAttach() {
		const { type, username } = this.properties;
		this.properties.fetchFeed(type, username, 1);
	}

	private _onGlobalFeedClick() {
		const { username } = this.properties;
		this.properties.fetchFeed('global', username, 1);
	}

	private _onFeedClick() {
		const { username } = this.properties;
		this.properties.fetchFeed('feed', username, 1);
	}

	private _onFavoriteFeedClick() {
		const { username } = this.properties;
		this.properties.fetchFeed('favorites', username, 1);
	}

	private _onUserFeedClick() {
		const { username } = this.properties;
		this.properties.fetchFeed('user', username, 1);
	}

	private _buildTabs(children: DNode): DNode {
		const { isAuthenticated, type, username, tagName } = this.properties;
		const isProfile = type === 'user' || type === 'favorites';

		return v('div', { classes: 'col-md-9' }, [
			v('div', { classes: 'feed-toggle' }, [
				v('ul', { classes: ['nav', 'nav-pills', 'outline-active'] }, [
					isAuthenticated && !isProfile
						? v('li', { key: 'feeds', classes: 'nav-item' }, [
								v(
									'a',
									{
										href: '#/',
										onclick: this._onFeedClick,
										classes: ['nav-link', type === 'feed' ? 'active' : null]
									},
									['Your Feeds']
								)
							])
						: null,
					!isProfile
						? v('li', { key: 'global', classes: 'nav-item' }, [
								v(
									'a',
									{
										href: '#/',
										onclick: this._onGlobalFeedClick,
										classes: ['nav-link', type === 'global' ? 'active' : null]
									},
									['Global Feeds']
								)
							])
						: null,
					type === 'tag'
						? v('li', { key: 'tags', classes: 'nav-item' }, [
								v(
									'a',
									{
										href: '#/',
										classes: ['nav-link', 'active']
									},
									[`#${tagName}`]
								)
							])
						: null,
					isProfile
						? v('li', { key: 'articles', classes: 'nav-item' }, [
								v(
									'a',
									{
										onclick: this._onUserFeedClick,
										href: `#user/${username}`,
										classes: ['nav-link', type === 'user' ? 'active' : null]
									},
									['My Articles']
								)
							])
						: null,
					isProfile
						? v('li', { key: 'favs', classes: 'nav-item' }, [
								v(
									'a',
									{
										onclick: this._onFavoriteFeedClick,
										href: `#user/${username}/favorites`,
										classes: ['nav-link', type === 'favorites' ? 'active' : null]
									},
									['Favorited Articles']
								)
							])
						: null
				])
			]),
			children
		]);
	}

	protected render() {
		const { loading = true, items, favoriteArticle } = this.properties;

		if (loading || items === undefined) {
			return this._buildTabs(v('div', { classes: 'article-preview' }, ['Loading...']));
		}

		if (items.length === 0) {
			return this._buildTabs(v('div', { classes: 'article-preview' }, ['No articles here, yet!']));
		}

		const articleList = v(
			'div',
			items.map((article, index) => {
				return w(ArticlePreview, { key: index, article, favoriteArticle });
			})
		);

		return this._buildTabs(articleList);
	}
}
