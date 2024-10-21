"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreDescriptionChanges = void 0;
const change_js_1 = require("../changes/change.js");
const descriptionChangeTypes = [
    change_js_1.ChangeType.FieldArgumentDescriptionChanged,
    change_js_1.ChangeType.DirectiveDescriptionChanged,
    change_js_1.ChangeType.DirectiveArgumentDescriptionChanged,
    change_js_1.ChangeType.EnumValueDescriptionChanged,
    change_js_1.ChangeType.FieldDescriptionChanged,
    change_js_1.ChangeType.FieldDescriptionAdded,
    change_js_1.ChangeType.FieldDescriptionRemoved,
    change_js_1.ChangeType.InputFieldDescriptionAdded,
    change_js_1.ChangeType.InputFieldDescriptionRemoved,
    change_js_1.ChangeType.InputFieldDescriptionChanged,
    change_js_1.ChangeType.TypeDescriptionChanged,
];
const ignoreDescriptionChanges = ({ changes }) => {
    return changes.filter(change => !descriptionChangeTypes.includes(change.type));
};
exports.ignoreDescriptionChanges = ignoreDescriptionChanges;
