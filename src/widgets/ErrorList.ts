import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { Errors } from '../interfaces';

interface ErrorListProperties {
	errors: Errors;
}

export class ErrorList extends WidgetBase<ErrorListProperties> {
	protected render() {
		const { errors } = this.properties;
		const errorCategories = Object.keys(errors);
		let errorList: any[] = [];
		for (let i = 0; i < errorCategories.length; i++) {
			errorList = [
				...errorList,
				...errors[errorCategories[i]].map((error: any) => `${errorCategories[i]} ${error}`)
			];
		}
		errorList;

		return v('ul', { classes: 'error-messages' }, errorList.map((error: any) => v('li', [error])));
	}
}
