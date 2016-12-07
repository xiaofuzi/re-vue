import {
    ch, token,
    range,
    sequence,
    wsequence,
    choice,
    repeat1,
    action
} from './parserc/parser.js';

import ps from './parserc/state.js';

/**
 * the parser for array path
 */

/**
 * atom parser
 */
function leftParen () {
    return ch('[');
}

function rightParen () {
    return ch(']');
}

function quote () {
    return ch("'");
}

function quotes () {
    return ch('"');
}

/**
 * identifer parser
 * array name
 * a-z/A-Z/[_]
 */
function identifer () {
    let result = repeat1(
                choice(
                        range('a', 'z'),
                        range('A', 'Z'),
                        ch('_'),
                        ch('$')
                    )            
                );
    return action(result, function(ast){
        return {
                type: 'identifer',
                value: ast.join('')
            };
    });
}

/**
 * identifer key
 */
function identiferKey () {
    let result = identifer();

    return action(result, function (ast) {
        return {
            type: 'identiferKey',
            value: ast.value
        };
    });
}

/**
 * string key
 * 'key'/"key"
 */
function stringKey () {
    return function (state) {
        let result = choice(
                sequence(
                        quote(),
                        identifer(),
                        quote()
                    ),
                sequence(
                        quotes(),
                        identifer(),
                        quotes()
                    )
            )(state);

        if (!result) return false;
    
        return {
            remaining: result.remaining,
            matched: result.matched,
            ast: {
                type: 'stringKey',
                value: result.ast[1]
            }
        };
    };
}

function pointKey () {
    return function (state) {
        let result = sequence(
                        ch('.'),
                        identiferKey()
                    )(state);
        console.log('pointKey: ', result);

        if (!result) return false;
        return {
            remaining: result.remaining,
            matched: result.matched,
            ast: {
                type: 'pointKey',
                value: result.ast[1]
            }
        };
    };
}

function parenKey () {
    return function (state) {
        let result = sequence(
                        leftParen(),
                        choice(
                            identiferKey(),
                            stringKey()//,
                            //getExpresion()
                            ),
                        rightParen()
                        )(state);

        console.log('parenKey: ', result);
        if (!result) return false;

        return {
            remaining: result.remaining,
            matched: result.matched,
            ast: {
                type: 'parenKey',
                value: result.ast[1]
            }
        };
    };
}

/**
 * object get expression
 */
function getExpresion () {
    let result = sequence(
            identifer(),
            repeat1(
                choice(
                    parenKey(),
                    pointKey()
                )
            )
        );

    return action(result, function (ast) {
        return {
            type: 'getterExpression',
            value: {
                object: ast[0],
                keys: ast[1]
            }
        };
    });
}

/**
 * arrayParser
 */
function evalArrayPathObject (pathStr, ctx) {
    let currentValue = null,
        ast = getExpresion()(ps(pathStr)).ast;

    if (ast) {
        evalValue(ast);
    }

    return currentValue;

    function evalValue (ast) {
        if (ast.type == 'getterExpression') {
            currentValue = ctx[ast.value.object.value];
            ast.value.keys.forEach((key)=>{
                if (key.value.type === 'identiferKey') {
                    currentValue = currentValue[ctx[key.value.value]];
                } else {
                    currentValue = currentValue[key.value.value.value];
                }
            });
        }
    }
}

/*
let ctx = {
    person: {
        age: 18,
        name: 'yang',
        info: {
            height: 170
        }
    },
    key: 'info'
}

let val = evalArrayPathObject('person[key]["height"]', ctx);

console.log('val: ', val);
*/
export {
    evalArrayPathObject
};

//console.log(stringKey()(ps('"item"')));
console.log('getter: ', getExpresion()(ps('obj[a]')));
console.log(parenKey()(ps('[obj[a]]')));
console.log('getter: ', getExpresion()(ps('obj[info][age]["weight"]')));
//console.log('complex: ', complexGetExpression()(ps('person[name][info][obj["name"]]')));