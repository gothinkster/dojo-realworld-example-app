import { Container } from '@dojo/widget-core/Container';
import { Store } from '@dojo/stores/Store';
import { Editor, EditorProperties } from './../widgets/Editor';
import {
	publishArticle,
	addTag,
	contentInput,
	descInput,
	removeTag,
	tagInput,
	titleInput,
	getArticleForEditor
} from './../processes/editorProcesses';

function getProperties(store: Store<any>, properties: EditorProperties): EditorProperties {
	const { get, path } = store;

	if (properties.slug && properties.slug !== get(path('editor', 'slug'))) {
		getArticleForEditor(store)(properties.slug);
	}

	return {
		title: get(path('editor', 'title')),
		description: get(path('editor', 'description')),
		content: get(path('editor', 'body')),
		tag: get(path('editor', 'tag')),
		tags: get(path('editor', 'tagList')),
		onContentInput: contentInput(store),
		onDescriptionInput: descInput(store),
		onTagCreate: addTag(store),
		onTagDelete: removeTag(store),
		onTagInput: tagInput(store),
		onTitleInput: titleInput(store),
		onPublishPost: publishArticle(store),
		errors: get(path('editor', 'errors'))
	};
}

export const EditorContainer = Container(Editor, 'state', { getProperties });
