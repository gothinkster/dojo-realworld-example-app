import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';

export interface FeedsProperties {
	article: any;
}

export class ArticlePreview extends WidgetBase<FeedsProperties> {
	protected render() {
		const { article, article: { author } } = this.properties;

		return v('div', { classes: 'article-preview' }, [
			v('div', { classes: 'article-meta' }, [
				w(Link, { to: 'user', params: { id: author.username } }, [v('img', { src: author.image })]),
				v('div', { classes: 'info' }, [
					w(Link, { classes: 'author', to: 'user', params: { id: author.username } }, [author.username]),
					v('span', { classes: 'date' }, [new Date(article.createdAt).toDateString()])
				]),
				v('button', { classes: ['btn', 'btn-outline-primary', 'btn-sm', 'pull-xs-right'] }, [
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
