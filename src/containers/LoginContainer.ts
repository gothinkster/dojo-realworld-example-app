import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Login, LoginProperties } from './../widgets/Login';
import { login, loginEmailInput, loginPasswordInput } from './../processes/loginProcesses';
import { State } from '../interfaces';

function getProperties(store: Store<State>, properties: LoginProperties): LoginProperties {
	const { get, path } = store;
	return {
		email: get(path('login', 'email')),
		password: get(path('login', 'password')),
		errors: get(path('errors')),
		inProgress: get(path('login', 'loading')),
		onEmailInput: loginEmailInput(store),
		onPasswordInput: loginPasswordInput(store),
		onLogin: login(store)
	};
}

export const LoginContainer = Container(Login, 'state', { getProperties });
