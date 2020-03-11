import { create, tsx } from '@dojo/framework/core/vdom';
import ActiveLink from '@dojo/framework/routing/ActiveLink';

interface HeaderProperties {
	isAuthenticated: boolean;
	username: string;
}

const factory = create().properties<HeaderProperties>();

export const Header = factory(function Header({ properties }) {
	const { isAuthenticated, username } = properties();

	return (
		<nav classes={['navbar', 'navbar-light']}>
			<div classes={['container']}>
				<a classes={['navbar-brand']}>conduit</a>
				<ul classes={['nav', 'navbar-nav pull-xs-right']}>
					<li classes={['nav-item']}>
						<ActiveLink classes={['nav-link']} activeClasses={['active']} to="home">
							Home
						</ActiveLink>
					</li>
					{isAuthenticated && (
						<li classes={['nav-item']}>
							<ActiveLink
								classes={['nav-link']}
								params={{ slug: 'new' }}
								activeClasses={['active']}
								to="editor"
							>
								New Post
								<i classes={['ion-compose']} />
							</ActiveLink>
						</li>
					)}
					{isAuthenticated && (
						<li classes={['nav-item']}>
							<ActiveLink classes={['nav-link']} activeClasses={['active']} to="settings">
								Settings
								<i classes={['ion-gear']} />
							</ActiveLink>
						</li>
					)}
					{isAuthenticated && (
						<li classes={['nav-item']}>
							<ActiveLink
								classes={['nav-link']}
								activeClasses={['active']}
								to="user"
								params={{ username: username }}
							>
								{username}
								<i classes={['ion-gear']} />
							</ActiveLink>
						</li>
					)}
					{!isAuthenticated && (
						<li classes={['nav-item']}>
							<ActiveLink classes={['nav-link']} activeClasses={['active']} to="login">
								Login
							</ActiveLink>
						</li>
					)}
					{!isAuthenticated && (
						<li classes={['nav-item']}>
							<ActiveLink classes={['nav-link']} activeClasses={['active']} to="register">
								Register
							</ActiveLink>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
});

export default Header;
