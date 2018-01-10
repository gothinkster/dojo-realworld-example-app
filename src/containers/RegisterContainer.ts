import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Register, RegisterProperties } from './../widgets/Register';
import {
	register,
	registerEmailInput,
	registerPasswordInput,
	registerUsernameInput
} from './../processes/loginProcesses';
import { State } from '../interfaces';

function getProperties(store: Store<State>, properties: RegisterProperties): RegisterProperties {
	const { get, path } = store;
	return {
		email: get(path('register', 'email')),
		password: get(path('register', 'password')),
		username: get(path('register', 'username')),
		errors: get(path('errors')),
		inProgress: get(path('register', 'loading')),
		onEmailInput: registerEmailInput(store),
		onPasswordInput: registerPasswordInput(store),
		onUsernameInput: registerUsernameInput(store),
		onRegister: register(store)
	};
}

export const RegisterContainer = Container(Register, 'state', { getProperties });
