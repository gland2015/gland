import { Map } from 'immutable';

class ChessGame {
    constructor(props) {
        this.initSituation(props);
        if (!this.situation) {
            throw new Error('error type');
        }
    }
    situation: Array<Array<any>>;
    nextMove: string;


    initSituation(props) {
        if (props.type === 'fen') {
            this.situation = this.getSituationByFen(props.data) as any;
            this.nextMove = null;
        } else if (props.type === 'array') {
            this.situation = this.getSituationByArray(props.data) as any;
            this.nextMove = null;
        }
    }

    move(x, y?, x1?, y1?) {
        if (typeof x === 'string') {
            y = parseInt(x[1]);
            x1 = x[2].charCodeAt(0) - 97;
            y1 = parseInt(x[3]);
            x = x[0].charCodeAt(0) - 97;
        }
        let piece = this.situation[x][y];
        if (!piece) return false;
        if (!this.nextMove) this.nextMove = piece.camp;
        if (piece.camp !== this.nextMove) return false;
        if (!piece.set(x, y, x1, y1)) return false;
        this.nextMove = this.nextMove === 'red' ? 'black' : 'red';
        return this.situation;
    }

    getSituationByArray(arr) {
        const situation = this.getEmptySituation();
        for (let x = 0; x < arr.length; x++) {
            for (let y = 0; y < arr[x].length; y++) {
                let str = arr[x][y];
                if (!str) continue;
                if (this.insertPiece(str, situation, x, y)) continue;
                return false;
            }
        }
        return situation;
    }

    getFenBySituation(situation) {
        let fen = '';
        for (let y = 0; y < 10; y++) {
            let rows = '';
            let i = 0;
            for (let x = 0; x < 9; x++) {
                if (situation[x][y]) {
                    if (i) {
                        rows += i;
                        i = 0;
                    }
                    rows += situation[x][y].camp;
                } else i++;
            }
            if (i) {
                rows += i;
            }
            if (y === 9) {
                rows += ' w'
            } else {
                rows += '/'
            }
            fen += rows;
        }
        return fen;
    }

    getSituationByFen(fen: string) {
        const situation = this.getEmptySituation();
        let rows = fen.split('/');
        if (rows.length !== 10) return false;
        for (let y = 0; y < rows.length; y++) {
            let string = rows[y];
            if (y === 9) string = string.substr(0, 9);
            if (string.length > 9) return false;
            for (let x = 0; x < string.length; x++) {
                let str = string[x];
                if (str.match(/[1-9]/)) {
                    x += parseInt(str) - 1;
                    continue;
                }
                if (this.insertPiece(str, situation, x, y)) continue;
                return false;
            }
        }
        return situation;
    }


    getEmptySituation() {
        let result = [];
        for (let i = 0; i < 9; i++) {
            result.push(new Array(10).fill(null));
        }
        return result;
    }

    insertPiece(str, situation, x, y) {
        if (str.match(/[rR]/)) {
            situation[x][y] = new 车(x, y, situation, str === 'r' ? 'red' : 'black');
            return true;
        }
        if (str.match(/[nN]/)) {
            situation[x][y] = new 马(x, y, situation, getCamp(str));
            return true;
        }
        if (str.match(/[bB]/)) {
            situation[x][y] = new 相(x, y, situation, getCamp(str));
            return true;
        }
        if (str.match(/[aA]/)) {
            situation[x][y] = new 士(x, y, situation, getCamp(str));
            return true;
        }
        if (str.match(/[kK]/)) {
            situation[x][y] = new 将(x, y, situation, getCamp(str));
            return true;
        }
        if (str.match(/[cC]/)) {
            situation[x][y] = new 炮(x, y, situation, getCamp(str));
            return true;
        }
        if (str.match(/[pP]/)) {
            situation[x][y] = new 兵(x, y, situation, getCamp(str));
            return true;
        }
        return false;

        function getCamp(str: string) {
            if (str.toUpperCase() === str) return 'black';
            return 'red';
        }
    }
}

class SituationController {

    constructor(props) {
        
    }

    getPiece(camp, str) {

    }
}


type IComp = 'red' | 'black';

abstract class Piece {
    constructor(x, y, situation, camp: IComp) {
        this.x = x;
        this.y = y;
        this.situation = situation;
        this.camp = camp;
        if (!this.isAllowedXY(x, y)) {
            this.throwPositionError(x, y);
        }
        this.situation[x][y] = this;
    }
    x: number; y: number; situation: Array<Array<any>>; camp: IComp;
    abstract name: string;
    abstract fen: string;
    abstract isAllowedNext(x, y): boolean;

    isAllowedXY(x, y): boolean {
        if (x >= 0 && x <= 8 && y >= 0 && y <= 9) return true;
        return false;
    }

    throwPositionError(x, y) {
        throw new Error('error position: x-' + x + ',y-' + y + ' from ' + this.name);
    }

    get(x, y) {
        return this.situation[x][y];
    }

    remove(x, y): void {
        this.situation[x][y] = null;
    }

    set(x, y): boolean {
        if (x === this.x && y === this.y) return false;
        if (!this.isAllowedNext(x, y)) return false;
        if (this.isAllowedNext(x, y)) {
            if (this.get(x, y)) {
                if (this.get(x, y).camp === this.camp) return false;
            }
            this.situation[x][y] = this;
            this.remove(this.x, this.y);
            this.x = x;
            this.y = y;
            return true;
        }
        return false;
    }

    helpNumAtLine(x, y, x1, y1) {
        let num = 0;
        if (x === x1) {
            let start = y < y1 ? y : y1, end = y < y1 ? y1 : y;
            for (let i = start + 1; i < end; i++) {
                if (this.get(x, i)) {
                    num += 1;
                }
            }
            return num;
        }
        if (y === y1) {
            let start = x < x1 ? x : x1, end = x < x1 ? x1 : x;
            for (let i = start + 1; i < end; i++) {
                if (this.get(i, y)) {
                    num += 1;
                }
            }
            return num;
        }
        return null;
    }

    helpNumAtSlant(x, y, x1, y1) {
        let dx = x1 - x;
        let dy = y1 - y;
        if (Math.abs(dx) === 1 && Math.abs(dy) === 2) {
            if (this.get(x + dx, y + dy / 2)) return 1;
            return 0;
        }
        if (Math.abs(dx) === 2 && Math.abs(dy) === 1) {
            if (this.get(x + dx / 2, y + dy)) return 1;
            return 0;
        }
        return null;
    }



}

class 车 extends Piece {
    constructor(x: number, y: number, situation: Array<Array<any>>, camp: IComp) {
        super(x, y, situation, camp);
        if (camp === 'black') this.fen = 'R';
        this.fen = 'r';
    }
    name = '车'
    fen: string;
    isAllowedNext(x, y) {
        if (this.helpNumAtLine(this.x, this.y, x, y) === 0) {
            return true;
        }
        return false;
    }
}

class 马 extends Piece {
    constructor(x: number, y: number, situation: Array<Array<any>>, camp: IComp) {
        super(x, y, situation, camp);
        if (camp === 'black') this.fen = 'N';
        this.fen = 'n';
    }
    name = '马';
    fen: string;
    isAllowedNext(x, y) {
        if (this.helpNumAtSlant(this.x, this.y, x, y) === 0) return true;
        return false;
    }
}

class 炮 extends Piece {
    constructor(x: number, y: number, situation: Array<Array<any>>, camp: IComp) {
        super(x, y, situation, camp);
        if (camp === 'black') this.fen = 'C';
        this.fen = 'c';
    }
    name = '炮';
    fen: string;
    isAllowedNext(x, y) {
        if (this.helpNumAtLine(this.x, this.y, x, y) === 1) return true;
        return false;
    }
}

class 将 extends Piece {
    constructor(x: number, y: number, situation: Array<Array<any>>, camp: IComp) {
        super(x, y, situation, camp);
        if (camp === 'black') this.fen = 'K';
        this.fen = 'k';
    }
    name = '将';
    fen: string;
    isAllowedXY(x, y) {
        if (this.camp = 'black') {
            y = 9 - y;
        }
        if (x >= 3 && x <= 5 && y >= 0 && y <= 2) return true;
        return false;
    }
    isAllowedNext(x, y) {
        let dx = Math.abs(x - this.x);
        let dy = Math.abs(y - this.y);
        if (dx === 1 && dy === 0) return true;
        if (dx === 0 && dy === 1) return true;
        return false;
    }
}

class 相 extends Piece {
    constructor(x: number, y: number, situation: Array<Array<any>>, camp: IComp) {
        super(x, y, situation, camp);
        if (camp === 'black') this.fen = 'B';
        this.fen = 'b';
    }
    name = '相';
    fen: string;
    isAllowedXY(x, y) {
        if (this.camp === 'black') {
            y = 9 - y;
        }
        if ((x === 0 && y === 2) ||
            ((x === 2 || x === 6) && (y === 0) || y === 4) ||
            (x === 4 && y === 2)
        ) return true;
        return false;
    }

    isAllowedNext(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
            if (!this.get(x + dx / 2, y + dy / 2)) return true;
        };
        return false;
    }
}

class 士 extends Piece {
    constructor(x: number, y: number, situation: Array<Array<any>>, camp: IComp) {
        super(x, y, situation, camp);
        if (camp === 'black') this.fen = 'A';
        this.fen = 'a';
    }
    name = '士';
    fen: string;
    isAllowedXY(x, y) {
        if (this.camp = 'black') {
            y = 9 - y;
        }
        if ((x === 3 || x === 5) && (y === 0 || y === 2)) return true;
        if (x === 4 && y === 1) return true;
        return false;
    }
    isAllowedNext(x, y) {
        let dx = Math.abs(x - this.x);
        let dy = Math.abs(y - this.y);
        if (dx === 1 && dy === 1) return true;
        return false;
    }
}

class 兵 extends Piece {
    constructor(x: number, y: number, situation: Array<Array<any>>, camp: IComp) {
        super(x, y, situation, camp);
        if (camp === 'black') this.fen = 'P';
        this.fen = 'p';
    }
    name = '兵'
    fen: string;
    isAllowedXY(x, y) {
        if (this.camp === 'black') {
            y = 9 - y;
        }
        if ((y === 4 || y === 3) && (x === 0 || x === 2 || x === 4 || x === 6 || x === 8)) return true;
        if (y >= 5 && y <= 9 && x >= 0 && x <= 8) return true;
        return false;
    }

    isAllowedNext(x, y) {
        let dx = Math.abs(x - this.x);
        let dy = y - this.y;
        if ((dx === 0 && dy === 1) || (dx === 1 && dy === 0)) return true;
        return false;
    }
}


