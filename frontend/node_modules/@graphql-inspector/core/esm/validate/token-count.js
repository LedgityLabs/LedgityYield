import { GraphQLError, TokenKind, visit } from 'graphql';
import { Parser } from 'graphql/language/parser.js';
class ParserWithLexer extends Parser {
    get tokenCount() {
        return this.__tokenCount;
    }
    constructor(source, options) {
        super(source, options);
        this.__tokenCount = 0;
        const lexer = this._lexer;
        this._lexer = new Proxy(lexer, {
            get: (target, prop, receiver) => {
                if (prop === 'advance') {
                    return () => {
                        const token = target.advance();
                        if (token.kind !== TokenKind.EOF) {
                            this.__tokenCount++;
                        }
                        return token;
                    };
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    }
}
export function calculateTokenCount(args) {
    const parser = new ParserWithLexer(args.source);
    const document = parser.parseDocument();
    let { tokenCount } = parser;
    visit(document, {
        FragmentSpread(node) {
            const fragmentSource = args.getReferencedFragmentSource(node.name.value);
            if (fragmentSource) {
                tokenCount += calculateTokenCount({
                    source: fragmentSource,
                    getReferencedFragmentSource: args.getReferencedFragmentSource,
                });
            }
        },
    });
    return tokenCount;
}
export function validateTokenCount(args) {
    const tokenCount = calculateTokenCount(args);
    if (tokenCount > args.maxTokenCount) {
        return new GraphQLError(`Query exceeds maximum token count of ${args.maxTokenCount} (actual: ${tokenCount})`, args.document, args.source, args.document.loc?.start ? [args.document.loc.start] : undefined);
    }
}
