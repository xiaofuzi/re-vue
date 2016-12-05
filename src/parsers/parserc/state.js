class State {
    constructor(input){
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

    advance (num) {
        this.index += num;
        this.matched += this.rested.substring(0, num);
        this.rested = this.rested.substring(num);
        this.length = this.rested.length;

        this.pos.col += num;

        return this;
    }

    trimLeft () {
        let s = this.rested;
        let m = s.match(/^\s+/);

        if (m) {
            this.advance(m[0].length);
            this.pos.col += m[0].length;
        }

        return this;
    }

    posMsg () {
        return 'col: ' + this.pos.col + ', row: ' + this.pos.row;
    }

    substring (start, length) {
        return this.rested.substring(start, length);
    }

    at (index) {
        return this.rested.charAt(index);
    }
}

export default function parseState (str) {
    return new State(str);
}