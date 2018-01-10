import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { WithTarget } from '../interfaces';

export interface SettingsProperties {
	imageUrl: string;
	username: string;
	bio: string;
	email: string;
	password: string;
	onImageUrlInput: (opts: { imageUrl: string }) => void;
	onUsernameInput: (opts: { username: string }) => void;
	onBioInput: (opts: { bio: string }) => void;
	onEmailInput: (opts: { email: string }) => void;
	onPasswordInput: (opts: { password: string }) => void;
	onUpdateSettings: (opts: object) => void;
	logout: (opts: object) => void;
}

export class Settings extends WidgetBase<SettingsProperties> {
	private _onSubmit(event: MouseEvent) {
		event.preventDefault();
		this.properties.onUpdateSettings({});
	}

	private _onImageUrlInput({ target: { value: imageUrl } }: WithTarget) {
		this.properties.onImageUrlInput({ imageUrl });
	}

	private _onUsernameInput({ target: { value: username } }: WithTarget) {
		this.properties.onUsernameInput({ username });
	}

	private _onBioInput({ target: { value: bio } }: WithTarget) {
		this.properties.onBioInput({ bio });
	}

	private _onEmailInput({ target: { value: email } }: WithTarget) {
		this.properties.onEmailInput({ email });
	}

	private _onPasswordInput({ target: { value: password } }: WithTarget) {
		this.properties.onPasswordInput({ password });
	}

	private _logout() {
		this.properties.logout({});
	}

	protected render() {
		const { email, password, bio, imageUrl, username } = this.properties;

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
						v('button', { onclick: this._logout, classes: ['btn', 'btn-outline-danger'] }, [
							'Or click here to logout'
						])
					])
				])
			])
		]);
	}
}
