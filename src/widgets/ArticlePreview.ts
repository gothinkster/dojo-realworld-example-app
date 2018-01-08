import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';

export interface ArticlePreviewProperties {
	article: any;
	onFav: Function;
	view: string;
}

export class ArticlePreview extends WidgetBase<ArticlePreviewProperties> {
	private _onFav() {
		const { view, article: { slug, favorited } } = this.properties;
		this.properties.onFav(slug, favorited, view);
	}

	protected render() {
		const { article, article: { author, favorited } } = this.properties;

		let buttonClasses = ['btn', 'btn-outline-primary', 'btn-sm', 'pull-xs-right'];
		if (favorited) {
			buttonClasses = ['btn', 'btn-primary', 'btn-sm', 'pull-xs-right'];
		}

		return v('div', { classes: 'article-preview' }, [
			v('div', { classes: 'article-meta' }, [
				w(Link, { to: 'user', params: { id: author.username } }, [v('img', { src: author.image })]),
				v('div', { classes: 'info' }, [
					w(Link, { classes: 'author', to: 'user', params: { id: author.username } }, [author.username]),
					v('span', { classes: 'date' }, [new Date(article.createdAt).toDateString()])
				]),
				v('button', { onclick: this._onFav, classes: buttonClasses }, [
					v('i', { classes: 'ion-heart' }),
					v('span', [` ${article.favoritesCount}`])
				]),
				w(Link, { classes: 'preview-link', to: 'article', params: { slug: article.slug } }, [
					v('h1', [article.title]),
					v('p', [article.description]),
					v('span', ['Read more...'])
				])
			])
		]);
	}
}
