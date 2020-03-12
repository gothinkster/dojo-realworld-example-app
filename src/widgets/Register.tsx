import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Link from '@dojo/framework/routing/Link';

import routing from '../routing';
import session from '../session';
import ErrorList from './ErrorList';
import { baseUrl } from '../config';
import { getHeaders } from '../utils';

interface LoginState {
	username: string;
	email: string;
	password: string;
	registerInProgress: boolean;
	errors: { [index: string]: string[] };
}

interface LoginProperties {
	onRegister: () => void;
}

const icache = createICacheMiddleware<LoginState>();

const factory = create({ icache, routing, session }).properties<LoginProperties>();

export const Register = factory(function Register({ properties, middleware: { icache, routing, session } }) {
	const { onRegister } = properties();
	const email = icache.getOrSet('email', '');
	const password = icache.getOrSet('password', '');
	const username = icache.getOrSet('username', '');
	const inProgress = icache.getOrSet('registerInProgress', false);
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
								icache.set('registerInProgress', true);
								fetch(`${baseUrl}/users`, {
									method: 'post',
									body: JSON.stringify({ user: { email, password, username } }),
									headers: getHeaders()
								}).then(async (response) => {
									const json = await response.json();
									if (!response.ok) {
										icache.set('errors', json.errors);
									} else {
										session.set(json.user);
										onRegister();
										routing.goto('home');
									}
									icache.set('registerInProgress', false);
								});
							}}
						>
							<fieldset>
								<fieldset classes={['form-group']}>
									<input
										autocomplete="username"
										value={username}
										placeholder="Username"
										oninput={(event) => {
											icache.set('username', (event.target as HTMLInputElement).value);
										}}
										classes={['form-control', 'form-control-lg']}
									/>
								</fieldset>
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

export default Register;
