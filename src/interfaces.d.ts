export type WithTarget<T extends Event = Event, E extends HTMLElement = HTMLInputElement> = T & { target: E };
import { Session } from '../interfaces';
import { OutletContext } from '@dojo/framework/routing/interfaces';

export interface ResourceBased {
	isLoaded: boolean;
	isLoading: boolean;
}

export interface User {
	username: string;
	bio: string;
	image: string;
}

export interface AuthorProfile extends User {
	following: boolean;
	feed: Feed;
}

export interface Session extends User, ResourceBased {
	email: string;
	token: string;
}

export interface Comment {
	id: number;
	createdAt: string;
	updatedAt: string;
	body: string;
	author: AuthorProfile;
}

export interface Routing {
	outlet: string;
	params: { [index: string]: string };
}

export interface ArticleItem {
	slug: string;
	title: string;
	description: string;
	body: string;
	tagList: string[];
	createdAt: string;
	updatedAt: string;
	favorited: boolean;
	favoritesCount: number;
	author: AuthorProfile;
}

export interface Settings extends User, ResourceBased {
	email: string;
	password?: string;
}

export interface Article extends ResourceBased {
	item: ArticleItem;
	comments: Comment[];
	newComment: string;
}

export interface Feed extends ResourceBased {
	category: string;
	tagName: string;
	filter: string;
	items: ArticleItem[];
	offset: number;
	page: number;
	total: number;
}

export interface Errors {
	[index: string]: string[];
}

export interface Login extends ResourceBased {
	email: string;
	password: string;
	failed: boolean;
}

export interface Register extends ResourceBased {
	username: string;
	password: string;
	email: string;
	failed: boolean;
}

export interface Editor extends ResourceBased {
	slug: string;
	title: string;
	description: string;
	body: string;
	tag: string;
	tagList: string[];
}

export interface Profile {
	user: AuthorProfile & ResourceBased;
	feed: Feed;
}

interface State {
	settings: Settings;
	article: {
		[index: string]: Article;
	};
	feed: Feed;
	session: Session;
	profile: Profile;
	routing: Routing;
	tags: string[];
	errors: Errors;
	login: ResourceBased;
	register: ResourceBased;
	editor: Editor;
}

export interface SlugPayload {
	slug: string;
}

export interface TitlePayload {
	title: string;
}

export interface DescriptionPayload {
	description: string;
}

export interface BodyPayload {
	body: string;
}

export interface TagPayload {
	tag: string;
}

export interface BioPayload {
	bio: string;
}

export interface ImagePayload {
	imageUrl: string;
}

export interface EmailPayload {
	email: string;
}

export interface UsernamePayload {
	username: string;
}

export interface PasswordPayload {
	password: string;
}

export interface FollowUserPayload {
	username: string;
	following: boolean;
	slug?: string;
}

export interface FavoriteArticlePayload extends SlugPayload {
	favorited: boolean;
	type?: string;
}

export interface NewCommentPayload {
	newComment: string;
	slug: string;
}

export interface AddCommentPayload extends SlugPayload, NewCommentPayload {}

export interface DeleteCommentPayload extends SlugPayload {
	id: number;
}

export interface FetchFeedPayload {
	type: string;
	filter: string;
	page: number;
}

export interface SetSessionPayload {
	session: Session;
}

export interface ChangeRoutePayload {
	outlet: string;
	context: OutletContext;
}
