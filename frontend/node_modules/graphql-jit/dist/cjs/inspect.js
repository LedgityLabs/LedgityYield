"use strict";
/**
 * Based on https://github.com/graphql/graphql-js/blob/master/src/jsutils/inspect.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodejsCustomInspectSymbol = void 0;
exports.nodejsCustomInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
function createInspect(maxArrayLength = 10, maxRecursiveDepth = 2) {
    /**
     * Used to print values in error messages.
     */
    return function inspect(value) {
        return formatValue(value, []);
    };
    function formatValue(value, seenValues) {
        switch (typeof value) {
            case "string":
                return JSON.stringify(value);
            case "function":
                return value.name ? `[function ${value.name}]` : "[function]";
            case "object":
                return formatObjectValue(value, seenValues);
            default:
                return String(value);
        }
    }
    function formatObjectValue(value, previouslySeenValues) {
        if (previouslySeenValues.indexOf(value) !== -1) {
            return "[Circular]";
        }
        const seenValues = [...previouslySeenValues, value];
        if (value) {
            const customInspectFn = getCustomFn(value);
            if (customInspectFn) {
                // $FlowFixMe(>=0.90.0)
                const customValue = customInspectFn.call(value);
                // check for infinite recursion
                if (customValue !== value) {
                    return typeof customValue === "string"
                        ? customValue
                        : formatValue(customValue, seenValues);
                }
            }
            else if (Array.isArray(value)) {
                return formatArray(value, seenValues);
            }
            return formatObject(value, seenValues);
        }
        return String(value);
    }
    function formatObject(object, seenValues) {
        const keys = Object.keys(object);
        if (keys.length === 0) {
            return "{}";
        }
        if (seenValues.length > maxRecursiveDepth) {
            return "[" + getObjectTag(object) + "]";
        }
        const properties = keys.map((key) => {
            const value = formatValue(object[key], seenValues);
            return key + ": " + value;
        });
        return "{ " + properties.join(", ") + " }";
    }
    function formatArray(array, seenValues) {
        if (array.length === 0) {
            return "[]";
        }
        if (seenValues.length > maxRecursiveDepth) {
            return "[Array]";
        }
        const len = Math.min(maxArrayLength, array.length);
        const remaining = array.length - len;
        const items = [];
        for (let i = 0; i < len; ++i) {
            items.push(formatValue(array[i], seenValues));
        }
        if (remaining === 1) {
            items.push("... 1 more item");
        }
        else if (remaining > 1) {
            items.push(`... ${remaining} more items`);
        }
        return "[" + items.join(", ") + "]";
    }
    function getCustomFn(object) {
        const customInspectFn = object[String(exports.nodejsCustomInspectSymbol)];
        if (typeof customInspectFn === "function") {
            return customInspectFn;
        }
        if (typeof object.inspect === "function") {
            return object.inspect;
        }
    }
    function getObjectTag(object) {
        const tag = Object.prototype.toString
            .call(object)
            .replace(/^\[object /, "")
            .replace(/]$/, "");
        if (tag === "Object" && typeof object.constructor === "function") {
            const name = object.constructor.name;
            if (typeof name === "string") {
                return name;
            }
        }
        return tag;
    }
}
exports.default = createInspect;
//# sourceMappingURL=inspect.js.map