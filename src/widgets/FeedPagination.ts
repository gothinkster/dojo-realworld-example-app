import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';

interface FeedPaginationProperties {
	type: string;
	username: string;
	tag: string;
	total: number;
	currentPage: number;
	fetchFeed: Function;
}

export class FeedPagination extends WidgetBase<FeedPaginationProperties> {
	protected render() {
		const { total, currentPage, fetchFeed, type, username, tag } = this.properties;

		let pageNumbers: DNode[] = [];
		for (let i = 0; i < Math.ceil(total / 10); i++) {
			const isActive = currentPage === i;
			const onclick = (event: MouseEvent) => {
				event.preventDefault();
				if (i !== currentPage) {
					fetchFeed(type, username, i, tag);
				}
			};
			pageNumbers.push(
				v('li', { key: i, classes: ['page-item', isActive ? 'active' : null] }, [
					v('a', { href: '', onclick, classes: 'page-link' }, [`${i + 1}`])
				])
			);
		}

		return v('nav', [v('ul', { classes: 'pagination' }, pageNumbers)]);
	}
}
