import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

export interface ArticleProperties {
	article?: any;
	loaded?: boolean;
}

export class Article extends WidgetBase<ArticleProperties> {
	protected render() {
		const { loaded = false, article: { title, author = {}, createdAt } } = this.properties;

		if (!loaded) {
			return null;
		}

		return v('div', { classes: 'article-page' }, [
			v('div', { classes: 'banner' }, [
				v('div', { classes: 'container' }, [
					v('h1', [title]),
					v('div', { classes: 'article-meta' }, [
						v('a', { href: '' }, [v('img', { src: author.image })]),
						v('div', { classes: 'info' }, [
							v('a', { href: '', classes: 'author' }, [author.username]),
							v('span', { classes: 'date' }, [new Date(createdAt).toDateString()])
						])
					])
				])
			])
		]);
	}
}
