import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import ErrorList from './ErrorList';
import { baseUrl } from '../config';
import session from '../session';
import routing from '../routing';
import { getHeaders } from '../utils';

export interface EditorProperties {
	slug: string;
}

interface EditorState {
	article: any;
	tag: any;
	errors: any;
}

const icache = createICacheMiddleware<EditorState>();

const factory = create({ icache, session, routing })
	.properties<EditorProperties>()
	.key('slug');

export const Editor = factory(function Editor({ middleware: { icache, session, routing }, properties }) {
	const { slug } = properties();
	const errors = icache.get('errors');
	const tag = icache.getOrSet('tag', '');
	const article = icache.getOrSet('article', () => {
		if (slug !== 'new') {
			return fetch(`${baseUrl}/articles/${slug}`)
				.then((response) => {
					return response.json();
				})
				.then((json) => {
					return json.article;
				});
		}
		return {
			tagList: []
		};
	});
	if (slug !== 'new' && !article) {
		return null;
	}

	return (
		<div classes={['editor-page']}>
			<div classes={['container', 'page']}>
				<div classes={['row']}>
					<div classes={['col-md-10', 'offset-md-1', 'col-xs-12']}>
						{errors && <ErrorList errors={errors} />}
						<form>
							<fieldset>
								<fieldset classes={['form-group']}>
									<input
										value={article.title}
										oninput={(event: KeyboardEvent) => {
											const target = event.target as HTMLInputElement;
											icache.set('article', { ...article, title: target.value });
										}}
										placeholder="Article Title"
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<input
										value={article.description}
										oninput={(event: KeyboardEvent) => {
											const target = event.target as HTMLInputElement;
											icache.set('article', { ...article, description: target.value });
										}}
										placeholder="What's this article about?"
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<textarea
										value={article.body}
										oninput={(event: KeyboardEvent) => {
											const target = event.target as HTMLInputElement;
											icache.set('article', { ...article, body: target.value });
										}}
										rows={8}
										placeholder="Write your article (in markdown)"
										classes={['form-control']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<input
										onkeydown={(event: KeyboardEvent) => {
											if (event.keyCode === 13) {
												event.preventDefault();
												const target = event.target as HTMLInputElement;
												icache.set('article', {
													...article,
													tagList: [...article.tagList, target.value]
												});
												icache.set('tag', '');
											}
										}}
										oninput={(event: KeyboardEvent) => {
											const target = event.target as HTMLInputElement;
											icache.set('tag', target.value);
										}}
										value={tag}
										placeholder="Enter Tag"
										classes={['form-control']}
									/>
									<div classes={['tag-list']}>
										{article.tagList &&
											article.tagList.map((tag: string, i: number) => (
												<span key={`${i}-${tag}`} classes={['tag-default', 'tag-pill']}>
													<i
														onclick={() => {
															const tagList = [...article.tagList];
															tagList.splice(i, 1);
															icache.set('article', { ...article, tagList });
														}}
														classes={['ion-close-round']}
													/>
													{tag}
												</span>
											))}
									</div>
								</fieldset>
								<button
									disabled={article.isLoaded && article.isLoading}
									onclick={(event: MouseEvent) => {
										event.preventDefault();
										const { slug } = properties();
										const article = icache.getOrSet('article', {});

										const url = slug ? `${baseUrl}/articles/${slug}` : `${baseUrl}/articles`;
										fetch(url, {
											method: slug ? 'put' : 'post',
											headers: getHeaders(session.token()),
											body: JSON.stringify(article)
										}).then(async (response) => {
											const json = await response.json();
											if (response.ok) {
												routing.goto('article', { slug: json.article.slug });
											} else {
												icache.set('errors', json.errors);
											}
										});
									}}
									classes={['btn', 'btn-lg', 'pull-xs-right', 'btn-primary']}
								>
									Publish Article
								</button>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Editor;
