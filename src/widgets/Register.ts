import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';

export interface RegisterProperties {
	onPasswordInput: Function;
	onEmailInput: Function;
	onUsernameInput: Function;
	onRegister: Function;
	email: string;
	password: string;
	username: string;
	inProgress?: boolean;
	errors: any[];
}

export class Register extends WidgetBase<RegisterProperties> {
	private _onEmailInput(event: any) {
		this.properties.onEmailInput(event.target.value);
	}

	private _onPasswordInput(event: any) {
		this.properties.onPasswordInput(event.target.value);
	}

	private _onUsernameInput(event: any) {
		this.properties.onUsernameInput(event.target.value);
	}

	private _onRegister(event: any) {
		event.preventDefault();
		this.properties.onRegister();
	}

	protected render() {
		const { email, password, username, inProgress = false, errors = [] } = this.properties;

		return v('div', { classes: 'auth-page' }, [
			v('div', { classes: ['container', 'page'] }, [
				v('div', { classes: 'row' }, [
					v('div', { classes: ['col-md-6', 'offset-md-3', 'col-xs-12'] }, [
						v('h1', { classes: 'text-xs-center' }, ['Sign Up']),
						v('p', { classes: 'text-xs-center' }, [w(Link, { to: 'login' }, ['Have an account?'])]),
						v('ul', { classes: 'error-messages' }, errors.map((error: any) => v('li', [error]))),
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
									['Sign In']
								)
							])
						])
					])
				])
			])
		]);
	}
}
