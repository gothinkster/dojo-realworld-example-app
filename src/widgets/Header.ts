import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';

export interface HeaderProperties {
	isAuthenticated: boolean;
	route: string;
}

export class Header extends WidgetBase<HeaderProperties> {
	private _authenticatedMenu() {
		const { route } = this.properties;
		return [
			v('li', { classes: 'nav-item' }, [
				w(Link, { classes: ['nav-link', route === 'new-post' ? 'active' : null], to: 'new-post' }, [
					v('i', { classes: 'ion-compose' }),
					'New Post'
				])
			]),
			v('li', { classes: 'nav-item' }, [
				v('a', { classes: ['nav-link', route === 'settings' ? 'active' : null], to: 'settings' }, [
					v('i', { classes: 'ion-gear' }),
					'Settings'
				])
			])
		];
	}

	private _unauthenticatedMenu(): any[] {
		const { route } = this.properties;
		return [
			v('li', { classes: 'nav-item' }, [
				w(Link, { classes: ['nav-link', route === 'login' ? 'active' : null], to: 'login' }, ['Sign In'])
			]),
			v('li', { classes: 'nav-item' }, [
				w(Link, { classes: ['nav-link', route === 'register' ? 'active' : null], to: 'register' }, ['Sign Up'])
			])
		];
	}

	protected render() {
		const { isAuthenticated, route } = this.properties;

		return v('nav', { classes: ['navbar', 'navbar-light'] }, [
			v('div', { classes: 'container' }, [
				v('a', { classes: 'navbar-brand' }, ['conduit']),
				v('ul', { classes: ['nav', 'navbar-nav pull-xs-right'] }, [
					v('li', { classes: 'nav-item' }, [
						w(Link, { classes: ['nav-link', route === '/' ? 'active' : null], to: 'home' }, ['Home'])
					]),
					...(isAuthenticated ? this._authenticatedMenu() : this._unauthenticatedMenu())
				])
			])
		]);
	}
}
