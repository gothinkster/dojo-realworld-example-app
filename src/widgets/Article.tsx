import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { Comment } from './Comment';
import { ArticleMeta } from './ArticleMeta';
import { getHeaders } from '../utils';
import { baseUrl } from '../config';
import session from '../session';
import routing from '../routing';
import { ArticleItem, Comment as CommentItem } from '../interfaces';

const snarkdown = require('snarkdown');

export interface ArticleProperties {
	slug: string;
}

interface ArticleState {
	article: ArticleItem;
	comment: string;
	comments: CommentItem[];
}

const icache = createICacheMiddleware<ArticleState>();

const factory = create({ icache, session, routing })
	.properties<ArticleProperties>()
	.key('slug');

export const Article = factory(function Article({ middleware: { icache, session, routing }, properties }) {
	const { slug } = properties();
	const article = icache.getOrSet('article', async () => {
		const { slug } = properties();
		const response = await fetch(`${baseUrl}/articles/${slug}`, {
			headers: getHeaders(session.token())
		});
		const json = await response.json();
		return json.article;
	});
	const comments = icache.getOrSet('comments', async () => {
		const { slug } = properties();
		const response = await fetch(`${baseUrl}/articles/${slug}/comments`, {
			headers: getHeaders(session.token())
		});
		const json = await response.json();
		return json.comments;
	});
	const comment = icache.getOrSet('comment', '');
	if (!article || !comments) {
		return (
			<div classes={['article-page']}>
				<div classes={['banner']} />
			</div>
		);
	}

	const articleMeta = (
		<ArticleMeta
			article={article}
			isAuthenticated={session.isAuthenticated()}
			currentUser={session.username()}
			favoriteArticle={() => {
				fetch(`${baseUrl}/articles/${slug}/favorite`, {
					method: article.favorited ? 'delete' : 'post',
					headers: getHeaders(session.token())
				}).then((response) => {
					if (response.ok) {
						icache.set('article', {
							...article,
							favorited: !article.favorited,
							favoritesCount: article.favorited ? article.favoritesCount - 1 : article.favoritesCount + 1
						});
					}
				});
			}}
			followUser={() => {
				fetch(`${baseUrl}/profiles/${article.author.username}/follow`, {
					method: article.author.following ? 'delete' : 'post',
					headers: getHeaders(session.token())
				}).then((response) => {
					if (response.ok) {
						icache.set('article', {
							...article,
							author: { ...article.author, following: !article.author.following }
						});
					}
				});
			}}
			deleteArticle={() => {
				fetch(`${baseUrl}/articles/${slug}`, {
					method: 'delete',
					headers: getHeaders(session.token())
				}).then((response) => {
					if (response.ok) {
						routing.goto('home');
					}
				});
			}}
		/>
	);

	return (
		<div classes={['article-page']}>
			<div key="banner" classes={['banner']}>
				<div classes={['container']}>
					<h1>{article.title}</h1>
					{articleMeta}
				</div>
			</div>
			<div key="page" classes={['container', 'page']}>
				<div classes={['row', 'article-content']}>
					<div classes={['col-xs-12']}>
						<div innerHTML={snarkdown.default(article.body)} />
						<ul classes={['tag-list']}>
							{article.tagList.map((tag: string) => (
								<li classes={['tag-default', 'tag-pill', 'tag-outline']}>{tag}</li>
							))}
						</ul>
					</div>
				</div>
				<hr />
				<div key="actions" classes={['article-actions']}>
					{articleMeta}
				</div>
				<div key="row" classes={['row']}>
					<div classes={['col-xs-12', 'col-md-8', 'offset-md-2']}>
						{session.isAuthenticated() ? (
							<form classes={['card', 'comment-form']}>
								<div classes={['card-block']}>
									<textarea
										value={comment}
										classes={['form-control']}
										placeholder="Write a comment..."
										rows={3}
										oninput={(event) => {
											const target = event.target as HTMLInputElement;
											icache.set('comment', target.value);
										}}
									/>
								</div>
								<div classes={['card-footer']}>
									<img classes={['comment-author-img']} src="" />
									<button
										onclick={(event) => {
											event.preventDefault();
											const comment = icache.getOrSet('comment', '');
											fetch(`${baseUrl}/articles/${slug}/comments`, {
												method: 'post',
												headers: getHeaders(session.token()),
												body: JSON.stringify({
													comment: {
														body: comment
													}
												})
											}).then(async (response) => {
												if (response.ok) {
													const comments = icache.getOrSet('comments', []);
													const json = await response.json();
													icache.set('comment', '');
													icache.set('comments', [json.comment, ...comments]);
												}
											});
										}}
										classes={['btn', 'btn-sm', 'btn-primary']}
										disabled={!comment}
									>
										Post Comment
									</button>
								</div>
							</form>
						) : (
							<p />
						)}
						<div>
							{comments.map((comment: any) => (
								<Comment
									key={comment.id}
									comment={comment}
									loggedInUser={session.username()}
									deleteComment={() => {
										fetch(`${baseUrl}/articles/${slug}/comments/${comment.id}`, {
											method: 'delete',
											headers: getHeaders(session.token())
										}).then((response) => {
											if (response.ok) {
												const comments = [...icache.getOrSet('comments', [])];
												const index = comments.findIndex(
													(existingComment) => existingComment.id === comment.id
												);
												if (index !== -1) {
													comments.splice(index, 1);
													icache.set('comments', comments);
												}
											}
										});
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Article;
