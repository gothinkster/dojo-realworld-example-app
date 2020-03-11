import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { baseUrl } from '../config';

interface TagsProperties {
	onTagSelect(tag: string): void;
}

interface TagsState {
	tags: any[];
}

const icache = createICacheMiddleware<TagsState>();

const factory = create({ icache }).properties<TagsProperties>();

export default factory(function Tags({ properties, middleware: { icache } }) {
	const { onTagSelect } = properties();
	const tags = icache.getOrSet('tags', async () => {
		const response = await fetch(`${baseUrl}/tags`);
		const json = await response.json();
		return json.tags;
	});

	return (
		<div classes={['col-md-3']}>
			<div classes={['sidebar']}>
				<p>Popular Tags</p>
				<div classes={['tag-list']}>
					{tags &&
						tags.map((tag, i) => (
							<a
								href=""
								key={`${i}`}
								onclick={(event: MouseEvent) => {
									event.preventDefault();
									onTagSelect(tag);
								}}
								classes={['tag-pill', 'tag-default']}
							>
								{tag}
							</a>
						))}
				</div>
			</div>
		</div>
	);
});
