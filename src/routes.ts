export default [
	{
		path: 'login',
		outlet: 'login'
	},
	{
		path: 'register',
		outlet: 'register'
	},
	{
		path: 'user/{username}',
		outlet: 'user'
	},
	{
		path: 'user/{username}/favorites',
		outlet: 'favorites'
	},
	{
		path: 'article/{slug}',
		outlet: 'article'
	},
	{
		path: 'settings',
		outlet: 'settings'
	},
	{
		path: 'editor/{slug}',
		outlet: 'editor'
	},
	{
		path: 'home',
		outlet: 'home',
		defaultRoute: true
	}
];
