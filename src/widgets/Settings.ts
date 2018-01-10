import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

export interface SettingsProperties {
	imageUrl: string;
	onImageUrlInput: Function;
	username: string;
	onUsernameInput: Function;
	bio: string;
	onBioInput: Function;
	email: string;
	onEmailInput: Function;
	password: string;
	onPasswordInput: Function;
	onUpdateSettings: any;
	getUserSettings: Function;
	logout: any;
}

export class Settings extends WidgetBase<SettingsProperties> {
	private _onSubmit(event: MouseEvent) {
		event.preventDefault();
		this.properties.onUpdateSettings();
	}

	private _onImageUrlInput(event: any) {
		this.properties.onImageUrlInput(event.target.value);
	}

	private _onUsernameInput(event: any) {
		this.properties.onUsernameInput(event.target.value);
	}

	private _onBioInput(event: any) {
		this.properties.onBioInput(event.target.value);
	}

	private _onEmailInput(event: any) {
		this.properties.onEmailInput(event.target.value);
	}

	private _onPasswordInput(event: any) {
		this.properties.onPasswordInput(event.target.value);
	}

	onAttach() {
		this.properties.getUserSettings();
	}

	protected render() {
		const { email, password, bio, imageUrl, username, logout } = this.properties;

		return v('div', { classes: 'settings-page' }, [
			v('div', { classes: ['container', 'page'] }, [
				v('div', { classes: 'row' }, [
					v('div', { classes: ['col-md-6', 'offset-md-3', 'col-xs-12'] }, [
						v('h1', { classes: 'text-xs-center' }, ['Your Settings']),
						v('form', [
							v('fieldset', [
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										value: imageUrl,
										classes: 'form-control',
										type: 'text',
										placeholder: 'URL of profile picture',
										oninput: this._onImageUrlInput
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										value: username,
										classes: ['form-control', 'form-control-lg'],
										type: 'text',
										placeholder: 'Your Name',
										oninput: this._onUsernameInput
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('textarea', {
										value: bio,
										classes: ['form-control', 'form-control-lg'],
										rows: 8,
										placeholder: 'Short bio about you',
										oninput: this._onBioInput
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										value: email,
										classes: ['form-control', 'form-control-lg'],
										type: 'email',
										placeholder: 'Email',
										oninput: this._onEmailInput
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										value: password,
										classes: ['form-control', 'form-control-lg'],
										type: 'password',
										placeholder: 'Password',
										oninput: this._onPasswordInput
									})
								]),
								v(
									'button',
									{
										onclick: this._onSubmit,
										type: 'submit',
										classes: ['btn', 'btn-lg', 'btn-primary', 'pull-xs-right']
									},
									['Update Settings']
								)
							])
						]),
						v('hr'),
						v('button', { onclick: logout, classes: ['btn', 'btn-outline-danger'] }, [
							'Or click here to logout'
						])
					])
				])
			])
		]);
	}
}
