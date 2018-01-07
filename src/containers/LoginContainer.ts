import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Login, LoginProperties } from './../widgets/Login';
import { login, loginEmailInput, loginPasswordInput } from './../processes/loginProcesses';
import { getFeedArticles } from './../processes/feedProcesses';

function getProperties(store: Store<any>, properties: LoginProperties): LoginProperties {
	const { get, path } = store;
	return {
		email: get(path('login', 'email')),
		password: get(path('login', 'password')),
		errors: get(path('login', 'errors')),
		inProgress: get(path('login', 'inProgress')),
		onEmailInput: loginEmailInput(store),
		onPasswordInput: loginPasswordInput(store),
		onLogin: () => {
			login(store)().then((result: any) => {
				const errors = get(path('login', 'errors'));
				if (!errors) {
					result.executor(getFeedArticles);
				}
			});
		}
	};
}

export const LoginContainer = Container(Login, 'state', { getProperties });
