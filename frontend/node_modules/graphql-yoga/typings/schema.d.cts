import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { GraphQLSchemaWithContext, YogaInitialContext } from './types.cjs';
export declare function createSchema<TContext = {}>(opts: IExecutableSchemaDefinition<TContext & YogaInitialContext>): GraphQLSchemaWithContext<TContext & YogaInitialContext>;
