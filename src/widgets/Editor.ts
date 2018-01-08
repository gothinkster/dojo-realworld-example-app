import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

export interface EditorProperties {
	onPublishPost: () => void;
	onTitleInput: Function;
	onDescriptionInput: Function;
	onContentInput: Function;
	onTagInput: Function;
	onTagCreate: Function;
	onTagDelete: Function;
	title: string;
	description: string;
	content: string;
	tag: string;
	errors?: string[];
	inProgress?: boolean;
	slug?: string;
	tags?: string[];
}

export class Editor extends WidgetBase<EditorProperties> {
	private _onTitleInput(event: any) {
		this.properties.onTitleInput(event.target.value);
	}

	private _onDescriptionInput(event: any) {
		this.properties.onDescriptionInput(event.target.value);
	}

	private _onContentInput(event: any) {
		this.properties.onContentInput(event.target.value);
	}

	private _onTagInput(event: any) {
		this.properties.onTagInput(event.target.value);
	}

	private _onTagCreate(event: any) {
		if (event.keyCode === 13) {
			event.preventDefault();
			this.properties.onTagCreate(event.target.value);
		}
	}

	protected render() {
		const {
			onTagDelete,
			onPublishPost,
			title,
			description,
			content,
			tag,
			errors = [],
			inProgress = false,
			tags = []
		} = this.properties;
		return v('div', { classes: 'editor-page' }, [
			v('div', { classes: ['container', 'page'] }, [
				v('div', { classes: 'row' }, [
					v('div', { classes: ['col-md-10', 'offset-md-1', 'col-xs-12'] }, [
						v('ul', { classes: 'error-messages' }, errors.map((error: any) => v('li', [error]))),
						v('form', [
							v('fieldset', [
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										classes: ['form-control', 'form-control-lg'],
										type: 'text',
										placeholder: 'Article Title',
										value: title,
										oninput: this._onTitleInput
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										classes: 'form-control',
										type: 'text',
										placeholder: "What's this article about?",
										value: description,
										oninput: this._onDescriptionInput
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('textarea', {
										classes: 'form-control',
										type: 'text',
										rows: 8,
										placeholder: 'Write your article (in markdown)',
										value: content,
										oninput: this._onContentInput
									})
								]),
								v('fieldset', { classes: 'form-group' }, [
									v('input', {
										classes: 'form-control',
										type: 'text',
										placeholder: 'Enter tags',
										value: tag,
										oninput: this._onTagInput,
										onkeyup: this._onTagCreate
									}),
									v(
										'div',
										{ classes: 'tag-list' },
										tags.map((tag) => {
											return v('span', { classes: ['tag-default', 'tag-pill'] }, [
												v('i', {
													classes: 'ion-close-round',
													onclick: () => {
														onTagDelete(tag);
													}
												}),
												tag
											]);
										})
									)
								]),
								v(
									'button',
									{
										classes: ['btn', 'btn-lg', 'pull-xs-right', 'btn-primary'],
										type: 'button',
										disabled: inProgress,
										onclick: onPublishPost
									},
									['Publish Article']
								)
							])
						])
					])
				])
			])
		]);
	}
}
