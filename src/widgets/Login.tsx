import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Link from '@dojo/framework/routing/Link';

import routing from '../routing';
import session from '../session';
import ErrorList from './ErrorList';
import { baseUrl } from '../config';
import { getHeaders } from '../utils';

interface LoginState {
	email: string;
	password: string;
	loginInProgress: boolean;
	errors: { [index: string]: string[] };
}

interface LoginProperties {
	onLogin: () => void;
}

const icache = createICacheMiddleware<LoginState>();

const factory = create({ icache, routing, session }).properties<LoginProperties>();

export const Login = factory(function Login({ properties, middleware: { icache, routing, session } }) {
	const { onLogin } = properties();
	const email = icache.getOrSet('email', '');
	const password = icache.getOrSet('password', '');
	const inProgress = icache.getOrSet('loginInProgress', false);
	const errors = icache.get('errors');

	return (
		<div classes={['auth-page']}>
			<div classes={['container', 'page']}>
				<div classes={['row']}>
					<div classes={['col-md-6', 'offset-md-3', 'col-xs-12']}>
						<h1 classes={['text-xs-center']}>Sign In</h1>
						<p classes={['text-xs-center']}>
							<Link to="register">Need an account?</Link>
						</p>
						{errors && <ErrorList errors={errors} />}
						<form
							onsubmit={(event: Event) => {
								event.preventDefault();
								const email = icache.getOrSet('email', '');
								const password = icache.getOrSet('password', '');
								icache.set('loginInProgress', true);
								fetch(`${baseUrl}/users/login`, {
									method: 'post',
									body: JSON.stringify({ user: { email, password } }),
									headers: getHeaders()
								}).then(async (response) => {
									const json = await response.json();
									if (!response.ok) {
										icache.set('errors', json.errors);
									} else {
										session.set(json.user);
										onLogin();
										routing.goto('home');
									}
									icache.set('loginInProgress', false);
								});
							}}
						>
							<fieldset>
								<fieldset classes={['form-group']}>
									<input
										autocomplete="email"
										value={email}
										placeholder="Email"
										type="email"
										oninput={(event) => {
											icache.set('email', (event.target as HTMLInputElement).value);
										}}
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
								<fieldset classes={['form-group']}>
									<input
										autocomplete="current-password"
										value={password}
										placeholder="Password"
										type="password"
										oninput={(event) => {
											icache.set('password', (event.target as HTMLInputElement).value);
										}}
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
							</fieldset>
							<button
								disabled={inProgress}
								type="submit"
								classes={['btn btn-lg', 'btn-primary', 'pull-xs-right']}
							>
								Sign In
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Login;
