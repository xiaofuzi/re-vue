/**
 * @privite
 */

function toParser (p) {
    return typeof(p) == 'string' ? token(p) : p;
}

function makeResult (remaining, matched, ast) {
    return {
        remaining: remaining,
        matched: matched,
        ast: ast
    };
}

/**
 * primitive parsers
 */
export function ch (c) {
    return function (state) {
        let r = state.length >= 1 && state.at(0) == c;
        if (r) {
            return {
                remaining: state.advance(1),
                matched: c,
                ast: c
            };
        } else {
            //console.warn('expect ' + c + ', but get ' + state.at(0) + ' at ' + state.index + '.');
            return false;
        }
    };
}

export function token (str) {
    return function (state) {
        let r = state.length >= str.length && state.substring(0, str.length) == str;

        if (r) {
            return {
                remaining: state.advance(str.length),
                matched: str,
                ast: str
            };
        } else {
            return false;
        }
    };
}

export function ignoreWhitespace (p) {
    p = toParser(p);

    return function (state) {
        return p(state.trimLeft());
    };
}

export function range (lower, upper) {
    return function (state) {
        if (state.length < 1) {
            return false;
        } else {
            var ch = state.at(0);
            if (ch >= lower && ch <= upper) {
                return {
                    remaining: state.advance(1),
                    matched: ch,
                    ast: ch
                };
            } else {
                return false;
            }
        }
    };
}


export function sequence () {
    var parsers = [];
    for (var i=0; i<arguments.length; i++) {
        parsers.push(toParser(arguments[i]))
    }

    return function (state) {
        var ast = [];
        var matched = '';
        var result = {};
        var j = 0;
        for (j=0; j<parsers.length; j++) {
            var parser = parsers[j];
            result = parser(state);
            if (result) {
                state = result.remaining;
                if (result.ast != undefined) {
                    ast.push(result.ast);
                    matched = matched + result.matched;
                }
            } else {
                break;
            }
        }
        if (j == parsers.length) {
            return makeResult(result.remaining, matched, ast);
        } else {
            return false;
        }
    };
}

/**
 * Like sequence, but ignores whitespace between individual parsers.
*/
export function wsequence() {
    var parsers = [];
    for(var i=0; i < arguments.length; ++i) {
        parsers.push(ignoreWhitespace(toParser(arguments[i])));
    }
    return sequence.apply(null, parsers);
}

export function choice () {
    var parsers = [];
    for(var i = 0; i < arguments.length; ++i)
        parsers.push(toParser(arguments[i]));

    return function (state) {
        var j;
        var result;
        for (j=0; j<parsers.length; j++) {
            var parser = parsers[j];
            result = parser(state);

            if (result) {
                break;
            }
        }

        if (j == parsers.length) {
            return false;
        }

        return result;
    };
}

export function not (p) {
    p = toParser(p);

    return function(state){
        let result = false;
        if (state.length >= 1) {
            if (!p(state)) {
                result = makeResult(state.advance(1), state.at(0), state.at(0));
            }
        }

        return result;
    };
}

export function optional (p) {
    p = toParser(p);

    return function(state){
        
    };
}

export function repeat1 (p) {
    p = toParser(p);

    return function (state) {
        var ast = [];
        var matched = '';
        var result = p(state);

        if (result) {
            while (result) {
                ast.push(result.ast);
                matched = matched + result.matched;

                state = result.remaining;
                result = p(state);
            }
            result = makeResult(state, matched, ast);
        } else {
            return false;
        }

        return result;
    };
}

export function action (p, f) {
    p = toParser(p);

    return function (state) {
        var result = p(state);

        if (result) {
            result.ast = f(result.ast);
        } else {
            return false;
        }

        return result;
    };
}
