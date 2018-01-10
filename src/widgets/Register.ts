import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';
import { Errors, WithTarget } from '../interfaces';
import { ErrorList } from './ErrorList';

export interface RegisterProperties {
	email: string;
	password: string;
	username: string;
	inProgress?: boolean;
	errors: Errors;
	onPasswordInput: (opts: { password: string }) => void;
	onEmailInput: (opts: { email: string }) => void;
	onUsernameInput: (opts: { username: string }) => void;
	onRegister: (opts: object) => void;
}

export class Register extends WidgetBase<RegisterProperties> {
	private _onEmailInput({ target: { value: email } }: WithTarget) {
		this.properties.onEmailInput({ email });
	}

	private _onPasswordInput({ target: { value: password } }: WithTarget) {
		this.properties.onPasswordInput({ password });
	}

	private _onUsernameInput({ target: { value: username } }: WithTarget) {
		this.properties.onUsernameInput({ username });
	}

	private _onRegister(event: Event) {
		event.preventDefault();
		this.properties.onRegister({});
	}

	protected render() {
		const { errors, email, password, username, inProgress = false } = this.properties;

		return v('div', { classes: 'auth-page' }, [
			v('div', { classes: ['container', 'page'] }, [
				v('div', { classes: 'row' }, [
					v('div', { classes: ['col-md-6', 'offset-md-3', 'col-xs-12'] }, [
						v('h1', { classes: 'text-xs-center' }, ['Sign Up']),
						v('p', { classes: 'text-xs-center' }, [w(Link, { to: 'login' }, ['Have an account?'])]),
						errors ? w(ErrorList, { errors }) : null,
						v('form', { onsubmit: this._onRegister }, [
							v('fieldset', [
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										classes: ['form-control', 'form-control-lg'],
										placeholder: 'Username',
										oninput: this._onUsernameInput,
										value: username
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										classes: ['form-control', 'form-control-lg'],
										type: 'email',
										placeholder: 'Email',
										oninput: this._onEmailInput,
										value: email
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										classes: ['form-control', 'form-control-lg'],
										type: 'password',
										placeholder: 'Password',
										oninput: this._onPasswordInput,
										value: password
									})
								]),
								v(
									'button',
									{
										classes: ['btn btn-lg', 'btn-primary', 'pull-xs-right'],
										disabled: inProgress,
										type: 'submit'
									},
									['Sign Up']
								)
							])
						])
					])
				])
			])
		]);
	}
}
