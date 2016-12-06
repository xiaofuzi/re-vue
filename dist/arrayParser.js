/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _parser = __webpack_require__(1);
	
	var _state = __webpack_require__(2);
	
	var _state2 = _interopRequireDefault(_state);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * the parser for array path
	 */
	
	/**
	 * atom parser
	 */
	function leftParen() {
	    return (0, _parser.ch)('[');
	}
	
	function rightParen() {
	    return (0, _parser.ch)(']');
	}
	
	function quote() {
	    return (0, _parser.ch)("'");
	}
	
	function quotes() {
	    return (0, _parser.ch)('"');
	}
	
	/**
	 * identifer parser
	 * array name
	 * a-z/A-Z/[_]
	 */
	function identifer() {
	    var result = (0, _parser.repeat1)((0, _parser.choice)((0, _parser.range)('a', 'z'), (0, _parser.range)('A', 'Z'), (0, _parser.ch)('_'), (0, _parser.ch)('$')));
	    if (!result) return false;
	
	    return (0, _parser.action)(result, function (ast) {
	        return {
	            type: 'identifer',
	            value: ast.join('')
	        };
	    });
	}
	
	/**
	 * identifer key
	 */
	function identiferKey() {
	    var result = identifer();
	
	    if (!result) return false;
	
	    return (0, _parser.action)(result, function (ast) {
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
	function stringKey() {
	    return function (state) {
	        var result = (0, _parser.choice)((0, _parser.sequence)(quote(), identifer(), quote()), (0, _parser.sequence)(quotes(), identifer(), quotes()))(state);
	
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
	
	function pointKey() {
	    return function (state) {
	        var result = (0, _parser.sequence)((0, _parser.ch)('.'), identiferKey())(state);
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
	
	function parenKey() {
	    return function (state) {
	        var result = (0, _parser.sequence)(leftParen(), (0, _parser.choice)(getExpresion(), identiferKey(), stringKey()), rightParen())(state);
	
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
	function getExpresion() {
	    var result = (0, _parser.sequence)(identifer(), (0, _parser.repeat1)((0, _parser.choice)(pointKey(), parenKey())));
	
	    if (!result) return false;
	
	    return (0, _parser.action)(result, function (ast) {
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
	exports.default = getExpresion;
	
	//console.log(stringKey()(ps('"item"')));
	//console.log(parenKey()(ps('[info.item]')));
	
	console.log('getter: ', getExpresion()((0, _state2.default)('obj[info.a].name[age]["weight"]')));
	//console.log('complex: ', complexGetExpression()(ps('person[name][info][obj["name"]]')));

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ch = ch;
	exports.token = token;
	exports.ignoreWhitespace = ignoreWhitespace;
	exports.range = range;
	exports.sequence = sequence;
	exports.wsequence = wsequence;
	exports.choice = choice;
	exports.not = not;
	exports.optional = optional;
	exports.repeat1 = repeat1;
	exports.action = action;
	/**
	 * @privite
	 */
	
	function toParser(p) {
	    return typeof p == 'string' ? token(p) : p;
	}
	
	function makeResult(remaining, matched, ast) {
	    return {
	        remaining: remaining,
	        matched: matched,
	        ast: ast
	    };
	}
	
	/**
	 * primitive parsers
	 */
	function ch(c) {
	    return function (state) {
	        var r = state.length >= 1 && state.at(0) == c;
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
	
	function token(str) {
	    return function (state) {
	        var r = state.length >= str.length && state.substring(0, str.length) == str;
	
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
	
	function ignoreWhitespace(p) {
	    p = toParser(p);
	
	    return function (state) {
	        return p(state.trimLeft());
	    };
	}
	
	function range(lower, upper) {
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
	
	function sequence() {
	    var parsers = [];
	    for (var i = 0; i < arguments.length; i++) {
	        parsers.push(toParser(arguments[i]));
	    }
	
	    return function (state) {
	        var ast = [];
	        var matched = '';
	        var result = {};
	        var j = 0;
	        for (j = 0; j < parsers.length; j++) {
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
	function wsequence() {
	    var parsers = [];
	    for (var i = 0; i < arguments.length; ++i) {
	        parsers.push(ignoreWhitespace(toParser(arguments[i])));
	    }
	    return sequence.apply(null, parsers);
	}
	
	function choice() {
	    var parsers = [];
	    for (var i = 0; i < arguments.length; ++i) {
	        parsers.push(toParser(arguments[i]));
	    }return function (state) {
	        var j;
	        var result;
	        for (j = 0; j < parsers.length; j++) {
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
	
	function not(p) {
	    p = toParser(p);
	
	    return function (state) {
	        var result = false;
	        if (state.length >= 1) {
	            if (!p(state)) {
	                result = makeResult(state.advance(1), state.at(0), state.at(0));
	            }
	        }
	
	        return result;
	    };
	}
	
	function optional(p) {
	    p = toParser(p);
	
	    return function (state) {};
	}
	
	function repeat1(p) {
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
	
	function action(p, f) {
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.default = parseState;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var State = function () {
	    function State(input) {
	        _classCallCheck(this, State);
	
	        this.input = input;
	        this.index = 0;
	        this.matched = '';
	        this.rested = this.input;
	        this.length = this.rested.length;
	        this.pos = {
	            col: 0,
	            row: 0
	        };
	    }
	
	    _createClass(State, [{
	        key: 'advance',
	        value: function advance(num) {
	            this.index += num;
	            this.matched += this.rested.substring(0, num);
	            this.rested = this.rested.substring(num);
	            this.length = this.rested.length;
	
	            this.pos.col += num;
	
	            return this;
	        }
	    }, {
	        key: 'trimLeft',
	        value: function trimLeft() {
	            var s = this.rested;
	            var m = s.match(/^\s+/);
	
	            if (m) {
	                this.advance(m[0].length);
	                this.pos.col += m[0].length;
	            }
	
	            return this;
	        }
	    }, {
	        key: 'posMsg',
	        value: function posMsg() {
	            return 'col: ' + this.pos.col + ', row: ' + this.pos.row;
	        }
	    }, {
	        key: 'substring',
	        value: function substring(start, length) {
	            return this.rested.substring(start, length);
	        }
	    }, {
	        key: 'at',
	        value: function at(index) {
	            return this.rested.charAt(index);
	        }
	    }]);
	
	    return State;
	}();
	
	function parseState(str) {
	    return new State(str);
	}

/***/ }
/******/ ]);
//# sourceMappingURL=arrayParser.js.map