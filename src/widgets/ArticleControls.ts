import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

interface ArticleControlsProperties {
	favoritesCount: number;
	authorUsername: string;
	favorited: boolean;
	following: boolean;
	followUser: Function;
	favoriteArticle: Function;
	slug: string;
}

export class ArticleControls extends WidgetBase<ArticleControlsProperties> {
	private _favoriteArticle() {
		const { slug, favorited } = this.properties;
		this.properties.favoriteArticle(slug, favorited);
	}

	private _followUser() {
		const { authorUsername, following } = this.properties;
		this.properties.followUser(authorUsername, following);
	}

	protected render() {
		const { favoritesCount, favorited, following, authorUsername } = this.properties;

		return v('span', [
			v(
				'button',
				{
					onclick: this._followUser,
					classes: ['btn', 'btn-sm', following ? 'btn-secondary' : 'btn-outline-secondary']
				},
				[v('i', { classes: 'ion-plus-round' }), `${following ? ' Unfollow' : ' Follow'} ${authorUsername}`]
			),
			v(
				'button',
				{
					onclick: this._favoriteArticle,
					classes: ['btn', 'btn-sm', favorited ? 'btn-primary' : 'btn-outline-primary']
				},
				[
					v('i', { classes: 'ion-heart' }),
					`${favorited ? ' Unfavorite' : ' Favorite'}`,
					v('span', { classes: 'counter' }, [`(${favoritesCount})`])
				]
			)
		]);
	}
}
