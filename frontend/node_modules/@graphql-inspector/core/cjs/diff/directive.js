"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changesInDirective = void 0;
const compare_js_1 = require("../utils/compare.js");
const directive_js_1 = require("./changes/directive.js");
function changesInDirective(oldDirective, newDirective, addChange) {
    if ((0, compare_js_1.isNotEqual)(oldDirective.description, newDirective.description)) {
        addChange((0, directive_js_1.directiveDescriptionChanged)(oldDirective, newDirective));
    }
    const locations = {
        added: (0, compare_js_1.diffArrays)(newDirective.locations, oldDirective.locations),
        removed: (0, compare_js_1.diffArrays)(oldDirective.locations, newDirective.locations),
    };
    // locations added
    for (const location of locations.added)
        addChange((0, directive_js_1.directiveLocationAdded)(newDirective, location));
    // locations removed
    for (const location of locations.removed)
        addChange((0, directive_js_1.directiveLocationRemoved)(oldDirective, location));
    (0, compare_js_1.compareLists)(oldDirective.args, newDirective.args, {
        onAdded(arg) {
            addChange((0, directive_js_1.directiveArgumentAdded)(newDirective, arg));
        },
        onRemoved(arg) {
            addChange((0, directive_js_1.directiveArgumentRemoved)(oldDirective, arg));
        },
        onMutual(arg) {
            changesInDirectiveArgument(oldDirective, arg.oldVersion, arg.newVersion, addChange);
        },
    });
}
exports.changesInDirective = changesInDirective;
function changesInDirectiveArgument(directive, oldArg, newArg, addChange) {
    if ((0, compare_js_1.isNotEqual)(oldArg.description, newArg.description)) {
        addChange((0, directive_js_1.directiveArgumentDescriptionChanged)(directive, oldArg, newArg));
    }
    if ((0, compare_js_1.isNotEqual)(oldArg.defaultValue, newArg.defaultValue)) {
        addChange((0, directive_js_1.directiveArgumentDefaultValueChanged)(directive, oldArg, newArg));
    }
    if ((0, compare_js_1.isNotEqual)(oldArg.type.toString(), newArg.type.toString())) {
        addChange((0, directive_js_1.directiveArgumentTypeChanged)(directive, oldArg, newArg));
    }
}
