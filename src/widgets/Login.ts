import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';

export interface LoginProperties {
	onPasswordInput: Function;
	onEmailInput: Function;
	onLogin: Function;
	email: string;
	password: string;
	inProgress?: boolean;
	errors: any[];
}

export class Login extends WidgetBase<LoginProperties> {
	private _onEmailInput(event: any) {
		this.properties.onEmailInput(event.target.value);
	}

	private _onPasswordInput(event: any) {
		this.properties.onPasswordInput(event.target.value);
	}

	private _onLogin(event: any) {
		event.preventDefault();
		this.properties.onLogin();
	}

	protected render() {
		const { email, password, inProgress = false, errors = [] } = this.properties;

		return v('div', { classes: 'auth-page' }, [
			v('div', { classes: ['container', 'page'] }, [
				v('div', { classes: 'row' }, [
					v('div', { classes: ['col-md-6', 'offset-md-3', 'col-xs-12'] }, [
						v('h1', { classes: 'text-xs-center' }, ['Sign In']),
						v('p', { classes: 'text-xs-center' }, [w(Link, { to: 'register' }, ['Need an account?'])]),
						v('ul', { classes: 'error-messages' }, errors.map((error: any) => v('li', [error]))),
						v('form', { onsubmit: this._onLogin }, [
							v('fieldset', [
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
