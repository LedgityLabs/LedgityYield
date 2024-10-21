import { ChangeType } from '../changes/change.js';
const descriptionChangeTypes = [
    ChangeType.FieldArgumentDescriptionChanged,
    ChangeType.DirectiveDescriptionChanged,
    ChangeType.DirectiveArgumentDescriptionChanged,
    ChangeType.EnumValueDescriptionChanged,
    ChangeType.FieldDescriptionChanged,
    ChangeType.FieldDescriptionAdded,
    ChangeType.FieldDescriptionRemoved,
    ChangeType.InputFieldDescriptionAdded,
    ChangeType.InputFieldDescriptionRemoved,
    ChangeType.InputFieldDescriptionChanged,
    ChangeType.TypeDescriptionChanged,
];
export const ignoreDescriptionChanges = ({ changes }) => {
    return changes.filter(change => !descriptionChangeTypes.includes(change.type));
};
