export interface User {
	username: string;
	bio: string;
	image: string;
}

export interface AuthorProfile extends User {
	following: boolean;
	feed: Feed;
}

export interface Session extends User {
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

export interface Settings extends User {
	email: string;
	password?: string;
}

export interface Article {
	item: ArticleItem;
	comments: Comment[];
	newComment: string;
}

export interface Feed {
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

export interface Login {
	email: string;
	password: string;
	failed: boolean;
}

export interface Register {
	username: string;
	password: string;
	email: string;
	failed: boolean;
}

export interface Editor {
	slug: string;
	title: string;
	description: string;
	body: string;
	tag: string;
	tagList: string[];
}

export interface Profile {
	user: AuthorProfile;
	feed: Feed;
}
