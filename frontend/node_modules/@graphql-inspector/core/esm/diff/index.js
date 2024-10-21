import * as rules from './rules/index.js';
import { diffSchema } from './schema.js';
export * from './rules/types.js';
export const DiffRule = rules;
export * from './onComplete/types.js';
export function diff(oldSchema, newSchema, rules = [], config) {
    const changes = diffSchema(oldSchema, newSchema);
    return rules.reduce(async (prev, rule) => {
        const prevChanges = await prev;
        return rule({
            changes: prevChanges,
            oldSchema,
            newSchema,
            config,
        });
    }, Promise.resolve(changes));
}
