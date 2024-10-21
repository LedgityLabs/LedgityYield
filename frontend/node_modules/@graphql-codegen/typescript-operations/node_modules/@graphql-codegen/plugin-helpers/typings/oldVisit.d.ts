import { ASTNode, visit } from 'graphql';
type VisitFn = typeof visit;
type NewVisitor = Partial<Parameters<VisitFn>[1]>;
type OldVisitor = {
    enter?: Partial<Record<keyof NewVisitor, NonNullable<NewVisitor[keyof NewVisitor]>['enter']>>;
    leave?: Partial<Record<keyof NewVisitor, NonNullable<NewVisitor[keyof NewVisitor]>['leave']>>;
} & NewVisitor;
export declare function oldVisit(root: ASTNode, { enter: enterVisitors, leave: leaveVisitors, ...newVisitor }: OldVisitor): any;
export {};
