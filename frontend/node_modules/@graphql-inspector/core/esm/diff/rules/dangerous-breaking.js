import { CriticalityLevel } from '../changes/change.js';
export const dangerousBreaking = ({ changes }) => {
    return changes.map(change => {
        if (change.criticality.level === CriticalityLevel.Dangerous) {
            return {
                ...change,
                criticality: {
                    ...change.criticality,
                    level: CriticalityLevel.Breaking,
                },
            };
        }
        return change;
    });
};
