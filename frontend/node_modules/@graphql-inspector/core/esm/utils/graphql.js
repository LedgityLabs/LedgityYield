import { getNamedType, GraphQLError, isInputObjectType, isInterfaceType, isListType, isNonNullType, isObjectType, isScalarType, isUnionType, isWrappingType, Kind, TypeInfo, visit, visitWithTypeInfo, } from 'graphql';
import { isDeprecated } from './is-deprecated.js';
export function safeChangeForField(oldType, newType) {
    if (!isWrappingType(oldType) && !isWrappingType(newType)) {
        return oldType.toString() === newType.toString();
    }
    if (isNonNullType(newType)) {
        const ofType = isNonNullType(oldType) ? oldType.ofType : oldType;
        return safeChangeForField(ofType, newType.ofType);
    }
    if (isListType(oldType)) {
        return ((isListType(newType) && safeChangeForField(oldType.ofType, newType.ofType)) ||
            (isNonNullType(newType) && safeChangeForField(oldType, newType.ofType)));
    }
    return false;
}
export function safeChangeForInputValue(oldType, newType) {
    if (!isWrappingType(oldType) && !isWrappingType(newType)) {
        return oldType.toString() === newType.toString();
    }
    if (isListType(oldType) && isListType(newType)) {
        return safeChangeForInputValue(oldType.ofType, newType.ofType);
    }
    if (isNonNullType(oldType)) {
        const ofType = isNonNullType(newType) ? newType.ofType : newType;
        return safeChangeForInputValue(oldType.ofType, ofType);
    }
    return false;
}
export function getKind(type) {
    const node = type.astNode;
    return node?.kind || '';
}
export function getTypePrefix(type) {
    const kind = getKind(type);
    const kindsMap = {
        [Kind.SCALAR_TYPE_DEFINITION]: 'scalar',
        [Kind.OBJECT_TYPE_DEFINITION]: 'type',
        [Kind.INTERFACE_TYPE_DEFINITION]: 'interface',
        [Kind.UNION_TYPE_DEFINITION]: 'union',
        [Kind.ENUM_TYPE_DEFINITION]: 'enum',
        [Kind.INPUT_OBJECT_TYPE_DEFINITION]: 'input',
    };
    return kindsMap[kind.toString()];
}
export function isPrimitive(type) {
    return ['String', 'Int', 'Float', 'Boolean', 'ID'].includes(typeof type === 'string' ? type : type.name);
}
export function isForIntrospection(type) {
    return [
        '__Schema',
        '__Type',
        '__TypeKind',
        '__Field',
        '__InputValue',
        '__EnumValue',
        '__Directive',
        '__DirectiveLocation',
    ].includes(typeof type === 'string' ? type : type.name);
}
export function findDeprecatedUsages(schema, ast) {
    const errors = [];
    const typeInfo = new TypeInfo(schema);
    visit(ast, visitWithTypeInfo(typeInfo, {
        Argument(node) {
            const argument = typeInfo.getArgument();
            if (argument) {
                const reason = argument.deprecationReason;
                if (reason) {
                    const fieldDef = typeInfo.getFieldDef();
                    if (fieldDef) {
                        errors.push(new GraphQLError(`The argument '${argument?.name}' of '${fieldDef.name}' is deprecated. ${reason}`, [node]));
                    }
                }
            }
        },
        Field(node) {
            const fieldDef = typeInfo.getFieldDef();
            if (fieldDef && isDeprecated(fieldDef)) {
                const parentType = typeInfo.getParentType();
                if (parentType) {
                    const reason = fieldDef.deprecationReason;
                    errors.push(new GraphQLError(`The field '${parentType.name}.${fieldDef.name}' is deprecated.${reason ? ' ' + reason : ''}`, [node]));
                }
            }
        },
        EnumValue(node) {
            const enumVal = typeInfo.getEnumValue();
            if (enumVal && isDeprecated(enumVal)) {
                const type = getNamedType(typeInfo.getInputType());
                if (type) {
                    const reason = enumVal.deprecationReason;
                    errors.push(new GraphQLError(`The enum value '${type.name}.${enumVal.name}' is deprecated.${reason ? ' ' + reason : ''}`, [node]));
                }
            }
        },
    }));
    return errors;
}
export function removeFieldIfDirectives(node, directiveNames) {
    if (node.directives?.some(d => directiveNames.includes(d.name.value))) {
        return null;
    }
    return node;
}
export function removeDirectives(node, directiveNames) {
    if (node.directives) {
        return {
            ...node,
            directives: node.directives.filter(d => !directiveNames.includes(d.name.value)),
        };
    }
    return node;
}
export function getReachableTypes(schema) {
    const reachableTypes = new Set();
    const collect = (type) => {
        const typeName = type.name;
        if (reachableTypes.has(typeName)) {
            return;
        }
        reachableTypes.add(typeName);
        if (isScalarType(type)) {
            return;
        }
        if (isInterfaceType(type) || isObjectType(type)) {
            if (isInterfaceType(type)) {
                const { objects, interfaces } = schema.getImplementations(type);
                for (const child of objects) {
                    collect(child);
                }
                for (const child of interfaces) {
                    collect(child);
                }
            }
            const fields = type.getFields();
            for (const fieldName in fields) {
                const field = fields[fieldName];
                collect(resolveOutputType(field.type));
                const args = field.args;
                for (const argName in args) {
                    const arg = args[argName];
                    collect(resolveInputType(arg.type));
                }
            }
        }
        else if (isUnionType(type)) {
            const types = type.getTypes();
            for (const child of types) {
                collect(child);
            }
        }
        else if (isInputObjectType(type)) {
            const fields = type.getFields();
            for (const fieldName in fields) {
                const field = fields[fieldName];
                collect(resolveInputType(field.type));
            }
        }
    };
    for (const type of [
        schema.getQueryType(),
        schema.getMutationType(),
        schema.getSubscriptionType(),
    ]) {
        if (type) {
            collect(type);
        }
    }
    return reachableTypes;
}
function resolveOutputType(output) {
    if (isListType(output) || isNonNullType(output)) {
        return resolveOutputType(output.ofType);
    }
    return output;
}
function resolveInputType(input) {
    if (isListType(input) || isNonNullType(input)) {
        return resolveInputType(input.ofType);
    }
    return input;
}
