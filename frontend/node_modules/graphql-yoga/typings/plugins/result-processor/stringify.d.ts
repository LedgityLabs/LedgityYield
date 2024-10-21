import { MaybeArray } from '../../types.js';
import { ExecutionResultWithSerializer } from '../types.js';
export declare function jsonStringifyResultWithoutInternals(result: MaybeArray<ExecutionResultWithSerializer>): string;
export declare function omitInternalsFromResultErrors(result: ExecutionResultWithSerializer): ExecutionResultWithSerializer;
