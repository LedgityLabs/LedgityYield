import { MaybeArray } from '../../types.cjs';
import { ExecutionResultWithSerializer } from '../types.cjs';
export declare function jsonStringifyResultWithoutInternals(result: MaybeArray<ExecutionResultWithSerializer>): string;
export declare function omitInternalsFromResultErrors(result: ExecutionResultWithSerializer): ExecutionResultWithSerializer;
