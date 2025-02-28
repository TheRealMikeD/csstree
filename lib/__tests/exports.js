import assert from 'assert';
import * as tokenizer from 'css-tree/tokenizer';
import parse from 'css-tree/parser';
import parseSelector from 'css-tree/selector-parser';
import walk from 'css-tree/walker';
import generate from 'css-tree/generator';
import convertor from 'css-tree/convertor';
import * as lexer from 'css-tree/lexer';
import * as definitionSyntax from 'css-tree/definition-syntax';
import data from 'css-tree/definition-syntax-data';
import dataPatch from 'css-tree/definition-syntax-data-patch';
import * as utils from 'css-tree/utils';


const stringifyWithNoInfo = ast => JSON.stringify(ast, (key, value) => key !== 'loc' ? value : undefined, 4);
const css = '.a{}';
const expectedAst = {
    type: 'StyleSheet',
    children: [
        {
            type: 'Rule',
            prelude: {
                type: 'SelectorList',
                children: [
                    {
                        type: 'Selector',
                        children: [
                            {
                                type: 'ClassSelector',
                                name: 'a'
                            }
                        ]
                    }
                ]
            },
            block: {
                type: 'Block',
                children: []
            }
        }
    ]
};

describe('exports / entry points', () => {
    it('tokenizer', () => {
        assert.deepStrictEqual(Object.keys(tokenizer).sort(), [
            'AtKeyword',
            'BadString',
            'BadUrl',
            'CDC',
            'CDO',
            'Colon',
            'Comma',
            'Comment',
            'Delim',
            'DigitCategory',
            'Dimension',
            'EOF',
            'EofCategory',
            'Function',
            'Hash',
            'Ident',
            'LeftCurlyBracket',
            'LeftParenthesis',
            'LeftSquareBracket',
            'NameStartCategory',
            'NonPrintableCategory',
            'Number',
            'OffsetToLocation',
            'Percentage',
            'RightCurlyBracket',
            'RightParenthesis',
            'RightSquareBracket',
            'Semicolon',
            'String',
            'TokenStream',
            'Url',
            'WhiteSpace',
            'WhiteSpaceCategory',
            'charCodeCategory',
            'cmpChar',
            'cmpStr',
            'consumeBadUrlRemnants',
            'consumeEscaped',
            'consumeName',
            'consumeNumber',
            'decodeEscaped',
            'findDecimalNumberEnd',
            'findWhiteSpaceEnd',
            'findWhiteSpaceStart',
            'getNewlineLength',
            'isBOM',
            'isDigit',
            'isHexDigit',
            'isIdentifierStart',
            'isLetter',
            'isLowercaseLetter',
            'isName',
            'isNameStart',
            'isNewline',
            'isNonAscii',
            'isNonPrintable',
            'isNumberStart',
            'isUppercaseLetter',
            'isValidEscape',
            'isWhiteSpace',
            'tokenNames',
            'tokenTypes',
            'tokenize'
        ]);
    });

    it('parser', () => {
        const ast = parse(css);
        assert.strictEqual(stringifyWithNoInfo(ast), stringifyWithNoInfo(expectedAst));
    });

    it('selector-parser', () => {
        const ast = parseSelector('.a');
        assert.strictEqual(stringifyWithNoInfo(ast), stringifyWithNoInfo(expectedAst.children[0].prelude));
    });

    it('generator', () => {
        assert.strictEqual(generate(expectedAst), css);
    });

    it('walker', () => {
        const types = [];

        walk(expectedAst, node => types.push(node.type));

        assert.deepStrictEqual(types, [
            'StyleSheet',
            'Rule',
            'SelectorList',
            'Selector',
            'ClassSelector',
            'Block'
        ]);
    });

    it('convertor', () => {
        const ast = parse(css);

        assert.strictEqual(ast.children instanceof utils.List, true);
        assert.strictEqual(ast.children.first.prelude.children instanceof utils.List, true);

        convertor.toPlainObject(ast);

        assert.strictEqual(Array.isArray(ast.children), true);
        assert.strictEqual(Array.isArray(ast.children[0].prelude.children), true);

        convertor.fromPlainObject(ast);

        assert.strictEqual(ast.children instanceof utils.List, true);
        assert.strictEqual(ast.children.first.prelude.children instanceof utils.List, true);

        assert.deepStrictEqual(Object.keys(convertor).sort(), [
            'fromPlainObject',
            'toPlainObject'
        ]);
    });

    it('lexer', () => {
        assert(typeof lexer.Lexer === 'function');
        assert.deepStrictEqual(Object.keys(lexer).sort(), [
            'Lexer'
        ]);
    });

    it('definitionSyntax', () => {
        assert.deepStrictEqual(Object.keys(definitionSyntax).sort(), [
            'SyntaxError',
            'generate',
            'parse',
            'walk'
        ]);
    });

    it('data', () => {
        assert.deepStrictEqual(Object.keys(data).sort(), [
            'atrules',
            'properties',
            'types'
        ]);
    });

    it('data-patch', () => {
        assert.deepStrictEqual(Object.keys(dataPatch).sort(), [
            'atrules',
            'properties',
            'types'
        ]);
    });

    it('utils', () => {
        assert.deepStrictEqual(Object.keys(utils).sort(), [
            'List',
            'clone',
            'ident',
            'isCustomProperty',
            'keyword',
            'property',
            'string',
            'url',
            'vendorPrefix'
        ]);
        assert.strictEqual(utils.string.encode('foo'), '"foo"');
        assert.strictEqual(utils.keyword('-webkit-foo').basename, 'foo');
    });
});
