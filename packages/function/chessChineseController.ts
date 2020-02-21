export { ChessChineseController };

function ChessChineseController(props) {
    const { situation, pieceList } = props;
    let Situation = getNewSituation(situation, pieceList);

    return Situation;
}

/**
 * 通过fen字符串获取棋局
 * @param fen
 * @param initPieceList
 */
function getNewSituation(fen?, initPieceList?) {
    let situation: any = getEmptySituation();
    let pieceList;
    if (!fen) {
        fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
    }
    if (!initPieceList) {
        initPieceList = getInitPieceList();
    }
    pieceList = getPieceList(initPieceList);

    let rows = fen.split("/");
    for (let y = 0; y < rows.length; y++) {
        let string = rows[y].substr(0, 9);
        let x = 0;
        for (let i = 0; i < string.length; i++) {
            let str = string[i];
            if (str.match(/[1-9]/)) {
                x += parseInt(str);
                continue;
            }
            let piece = getNotUsedPiece(str);
            situation.set(x, y, piece);
            x++;
        }
    }
    Object.defineProperty(situation, "pieceList", {
        value: pieceList
    });
    return situation;

    function getNotUsedPiece(str: string) {
        let list = pieceList[getCamp(str)][str] || [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].x === -10) {
                return list[i];
            }
        }
        throw new Error("piece is not enough");
    }

    function getEmptySituation() {
        let result = [];
        for (let i = 0; i < 9; i++) {
            result.push(new Array(10).fill(null));
        }
        Object.setPrototypeOf(result, situationPrototype);
        return result;
    }
}

const situationPrototype = {
    getCopy() {
        // 获取棋局的副本
        let arr = this.concat();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].concat();
        }
        return arr;
    },
    get(x, y) {
        if(this[x]) {
            return this[x][y];
        }
    },
    set(x, y, item) {
        if (item) {
            item.x = x;
            item.y = y;
        }
        this[x][y] = item;
    },
    remove(x, y) {
        let piece = this.get(x, y);
        if (piece) {
            piece.x = -1;
            piece.y = -1;
        }
        this[x][y] = null;
    },
    _move(x, y, x1, y1) {
        this.remove(x1, y1);
        this.set(x1, y1, this.get(x, y));
        this.set(x, y, null);
    },
    move(x, y, x1, y1) {
        const piece = this.get(x, y);
        const tarPiece = this.get(x1, y1);
        const nextCamp = piece.camp === "red" ? "black" : "red";
        const _move = this._move.bind(this);
        let restore;
        // 错误走子类型
        if (!piece) return Result(false, 1, "当前位置不存在棋子");
        if (tarPiece && tarPiece.camp === piece.camp) return Result(false, 2, "目标为己方子力");
        if (!this.isAllowedPosition(piece, x, y)) return Result(false, 3, "当前位置棋子位置错误");
        if (!this.isAllowedPosition(piece, x1, y1)) return Result(false, 4, "目标位置非法");
        if (!this.isAllowedRule(x, y, x1, y1)) return Result(false, 5, "走子规则错误");
        // 是否被吃将
        if (tarPiece && tarPiece.fen === "K") {
            return Result(true, 10000, "黑方被吃帅,红方胜利");
        }
        if (tarPiece && tarPiece.fen === "k") {
            return Result(true, 10001, "红方被吃帅,黑方胜利");
        }
        // 尝试走子
        this._move(x, y, x1, y1);
        restore = () => {
            this.set(x, y, piece);
            this.set(x1, y1, tarPiece);
        };
        // 查看是否送将
        let checkState = this.getCheckState(nextCamp);
        if (checkState.type === 11) return Result(false, 11, "将帅照面");
        if (!checkState.normal) return Result(false, 12, "送将");
        // 寻找对面的一个下一步，判断是否形成绝杀
        let nextStep = this.findNextStep(nextCamp);
        if (!nextStep.normal) return Result(true, 1000, "形成绝杀");
        // 查看是否形成将军
        checkState = this.getCheckState(piece.camp);
        if (!checkState.normal) return Result(true, 1002, "将军");
        return Result(true, 100, "正常走子");

        function Result(normal, type, message) {
            if (restore) restore();
            return {
                done: _move.bind(this, x, y, x1, y1),
                normal,
                type,
                message
            };
        }
    },
    /**
     * 判断某方下一步是否能吃对方老将或者已发生将帅照面
     */
    getCheckState(camp) {
        let redPieceList = this.pieceList["red"];
        let blackPieceList = this.pieceList["black"];
        // 首先查看是否照面
        let k = [redPieceList["k"][0].x, redPieceList["k"][0].y]; // 红方帅的位置
        let K = [blackPieceList["K"][0].x, blackPieceList["K"][0].y]; // 黑方将的位置
        if (this.getNumAtLine(...k, ...K) === 0) {
            return {
                normal: false,
                type: 11,
                message: "将帅照面"
            };
        }
        // 车马炮兵是否能吃对面老将
        let tarPieceList = this.pieceList[camp];
        let r, n, c, p;
        let x1, y1;

        if (camp === "red") {
            (r = "r"), (n = "n"), (c = "c"), (p = "p");
            [x1, y1] = K;
        } else {
            (r = "R"), (n = "N"), (c = "C"), (p = "P");
            [x1, y1] = k;
        }
        for (let i = 0; i < tarPieceList[r].length; i++) {
            const { x, y } = tarPieceList[r][i];
            if (x < 0) continue;
            if (this.getNumAtLine(x, y, x1, y1) === 0) {
                return {
                    normal: false,
                    type: 12,
                    message: "将军",
                    payload: tarPieceList[r][i]
                };
            }
        }

        for (let i = 0; i < tarPieceList[n].length; i++) {
            const { x, y } = tarPieceList[n][i];
            if (x < 0) continue;
            if (this.getNumAtSlant(x, y, x1, y1) === 0) {
                return {
                    normal: false,
                    type: 12,
                    message: "将军",
                    payload: tarPieceList[n][i]
                };
            }
        }

        for (let i = 0; i < tarPieceList[c].length; i++) {
            const { x, y } = tarPieceList[c][i];
            if (x < 0) continue;
            if (this.getNumAtLine(x, y, x1, y1) === 1) {
                return {
                    normal: false,
                    type: 12,
                    message: "将军",
                    payload: tarPieceList[c][i]
                };
            }
        }
        for (let i = 0; i < tarPieceList[p].length; i++) {
            const { x, y } = tarPieceList[p][i];
            if (x < 0) continue;
            if (Math.abs(x - x1) + Math.abs(y - y1) === 1) {
                if (camp === "red" && y !== y1 + 1) {
                    return {
                        normal: false,
                        type: 12,
                        message: "将军",
                        payload: tarPieceList[p][i]
                    };
                }
                if (camp === "black" && y !== y1 - 1) {
                    return {
                        normal: false,
                        type: 12,
                        message: "将军",
                        payload: tarPieceList[p][i]
                    };
                }
            }
        }
        return {
            normal: true,
            type: 103,
            message: "未能将军"
        };
    },

    /**
     * 找出一步走法，满足不会被直接吃将
     * @param camp
     */
    findNextStep(camp) {
        let tarPieceList = this.pieceList[camp];
        let r, n, c, p, b, k, a;
        if (camp === "red") {
            (r = "r"), (n = "n"), (c = "c"), (p = "p");
            (k = "k"), (a = "a"), (b = "b");
        } else {
            (r = "R"), (n = "N"), (c = "C"), (p = "P");
            (k = "K"), (a = "A"), (b = "B");
        }
        // 遍历车
        for (let i = 0; i < tarPieceList[r].length; i++) {
            const { x, y } = tarPieceList[r][i];
            if (x < 0) continue;
            let x1, y1;
            x1 = x;
            y1 = y;
            for (let i = 1; i < 11; i++) {
                y1 = y + i;
                let tarPiece = this.get(x1, y1);
                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (tarPiece || result === null) break;
            }
            x1 = x;
            y1 = y;
            for (let i = 1; i < 11; i++) {
                y1 = y - i;
                let tarPiece = this.get(x1, y1);
                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (tarPiece || !result) break;
            }
            x1 = x;
            y1 = y;
            for (let i = 1; i < 11; i++) {
                x1 = x + i;
                let tarPiece = this.get(x1, y1);
                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (tarPiece || result === null) break;
            }
            x1 = x;
            y1 = y;
            for (let i = 1; i < 11; i++) {
                x1 = x - i;
                let tarPiece = this.get(x1, y1);
                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (tarPiece || result === null) break;
            }
        }
        // 遍历炮
        for (let i = 0; i < tarPieceList[c].length; i++) {
            const piece = tarPieceList[c][i];
            const { x, y } = piece;
            if (x < 0) continue;
            let x1, y1;
            (x1 = x), (y1 = y);
            for (let i = 1; i < 11; i++) {
                y1 = y + i;
                let tarPiece = this.get(x1, y1);
                if (tarPiece) {
                    // 尝试发炮
                    for (let j = 1; j < 11; j++) {
                        y1 = y + i + j;
                        let tarPiece = this.get(x1, y1);
                        if (!this.isAllowedPosition(piece, x, y)) break;
                        if (!tarPiece) continue;
                        if (tarPiece) {
                            let result = this.trySafeStep(x, y, x1, y1);
                            if (result && result.normal)
                                return {
                                    normal: true,
                                    x,
                                    y,
                                    x1,
                                    y1
                                };
                            break;
                        }
                    }
                    break;
                }

                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (result === null) break;
            }

            (x1 = x), (y1 = y);
            for (let i = 1; i < 11; i++) {
                y1 = y - i;
                let tarPiece = this.get(x1, y1);
                if (tarPiece) {
                    // 尝试发炮
                    for (let j = 1; j < 11; j++) {
                        y1 = y - i - j;
                        let tarPiece = this.get(x1, y1);
                        if (!this.isAllowedPosition(piece, x, y)) break;
                        if (!tarPiece) continue;
                        if (tarPiece) {
                            let result = this.trySafeStep(x, y, x1, y1);
                            if (result && result.normal)
                                return {
                                    normal: true,
                                    x,
                                    y,
                                    x1,
                                    y1
                                };
                            break;
                        }
                    }
                    break;
                }

                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (result === null) break;
            }

            (x1 = x), (y1 = y);
            for (let i = 1; i < 11; i++) {
                x1 = x + i;
                let tarPiece = this.get(x1, y1);
                if (tarPiece) {
                    // 尝试发炮
                    for (let j = 1; j < 11; j++) {
                        x1 = x + i + j;
                        let tarPiece = this.get(x1, y1);
                        if (!this.isAllowedPosition(piece, x, y)) break;
                        if (!tarPiece) continue;
                        if (tarPiece) {
                            let result = this.trySafeStep(x, y, x1, y1);
                            if (result && result.normal)
                                return {
                                    normal: true,
                                    x,
                                    y,
                                    x1,
                                    y1
                                };
                            break;
                        }
                    }
                    break;
                }

                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (result === null) break;
            }

            (x1 = x), (y1 = y);
            for (let i = 1; i < 11; i++) {
                x1 = x - i;
                let tarPiece = this.get(x1, y1);
                if (tarPiece) {
                    // 尝试发炮
                    for (let j = 1; j < 11; j++) {
                        x1 = x - i - j;
                        let tarPiece = this.get(x1, y1);
                        if (!this.isAllowedPosition(piece, x, y)) break;
                        if (!tarPiece) continue;
                        if (tarPiece) {
                            let result = this.trySafeStep(x, y, x1, y1);
                            if (result && result.normal)
                                return {
                                    normal: true,
                                    x,
                                    y,
                                    x1,
                                    y1
                                };
                            break;
                        }
                    }
                    break;
                }

                let result = this.trySafeStep(x, y, x1, y1);
                if (result && result.normal)
                    return {
                        normal: true,
                        x,
                        y,
                        x1,
                        y1
                    };
                if (result === null) break;
            }
        }

        // 遍历马
        for (let i = 0; i < tarPieceList[n].length; i++) {
            const piece = tarPieceList[n][i]
            const { x, y } = piece;
            if (x < 0) continue;
            let x1, y1;
            let step = [1, -1, -2, 2];
            for (let i = 0; i < step.length; i++) {
                for (let j = 0; j < step.length; j++) {
                    if (Math.abs(i) === Math.abs(j)) continue;
                    y1 = y + i;
                    x1 = x + j;
                    if (!this.isAllowedPosition(piece, x1, y1)) continue;
                    let result = this.trySafeStep(x, y, x1, y1);
                    if (result && result.normal) {
                        if (this.isAllowedRule(x, y, x1, y1)) {
                            return {
                                normal: true,
                                x,
                                y,
                                x1,
                                y1
                            };
                        }
                    }
                }
            }
        }

        // 遍历相
        for (let i = 0; i < tarPieceList[b].length; i++) {
            const piece = tarPieceList[b][i]
            const { x, y } = piece;
            if (x < 0) continue;
            let x1, y1;
            let step = [-2, 2];
            for (let i = 0; i < step.length; i++) {
                for (let j = 0; j < step.length; j++) {
                    y1 = y + i;
                    x1 = x + j;
                    if (!this.isAllowedPosition(piece, x1, y1)) continue;
                    let result = this.trySafeStep(x, y, x1, y1);
                    if (result && result.normal) {
                        if (this.isAllowedRule(x, y, x1, y1)) {
                            return {
                                normal: true,
                                x,
                                y,
                                x1,
                                y1
                            };
                        }
                    }
                }
            }
        }

        // 遍历兵
        for (let i = 0; i < tarPieceList[p].length; i++) {
            const piece = tarPieceList[p][i]
            const { x, y } = tarPieceList[p][i];
            if (x < 0) continue;
            let x1, y1;
            let step = [1, -1, 0];
            for (let i = 0; i < step.length; i++) {
                for (let j = 0; j < step.length; j++) {
                    if (Math.abs(i) === Math.abs(j)) continue;
                    y1 = y + i;
                    x1 = x + j;
                    if (!this.isAllowedPosition(piece, x1, y1)) continue;
                    let result = this.trySafeStep(x, y, x1, y1);
                    if (result && result.normal) {
                        if (this.isAllowedRule(x, y, x1, y1)) {
                            return {
                                normal: true,
                                x,
                                y,
                                x1,
                                y1
                            };
                        }
                    }
                }
            }
        }
        // 遍历士
        for (let i = 0; i < tarPieceList[a].length; i++) {
            const piece = tarPieceList[a][i];
            const { x, y } = piece;
            if (x < 0) continue;
            let x1, y1;
            let step = [1, -1];
            for (let i = 0; i < step.length; i++) {
                for (let j = 0; j < step.length; j++) {
                    y1 = y + i;
                    x1 = x + j;
                    if (!this.isAllowedPosition(piece, x1, y1)) continue;
                    let result = this.trySafeStep(x, y, x1, y1);
                    if (result && result.normal) {
                        if (this.isAllowedRule(x, y, x1, y1)) {
                            return {
                                normal: true,
                                x,
                                y,
                                x1,
                                y1
                            };
                        }
                    }
                }
            }
        }

        // 遍历将
        for (let i = 0; i < tarPieceList[k].length; i++) {
            const piece = tarPieceList[k][i];
            const { x, y } = piece;
            if (x < 0) continue;
            let x1, y1;
            let step = [1, -1, 0];
            for (let i = 0; i < step.length; i++) {
                for (let j = 0; j < step.length; j++) {
                    if (Math.abs(i) === Math.abs(j)) continue;
                    y1 = y + i;
                    x1 = x + j;
                    if (!this.isAllowedPosition(piece, x1, y1)) continue;
                    let result = this.trySafeStep(x, y, x1, y1);
                    if (result && result.normal) {
                        if (this.isAllowedRule(x, y, x1, y1)) {
                            return {
                                normal: true,
                                x,
                                y,
                                x1,
                                y1
                            };
                        }
                    }
                }
            }
        }
        return {
            normal: false,
            message: "未发现下一步"
        };
    },
    /**
     * 尝试下一步，并报告是否会被对方吃将,再还原
     */
    trySafeStep(x, y, x1, y1) {
        let piece = this.get(x, y);
        let tarPiece = this.get(x1, y1);
        if (!this.isAllowedPosition(piece, x1, y1)) return null;

        if (tarPiece && tarPiece.camp === piece.camp) return null;
        let camp = piece.camp === "red" ? "black" : "red";
        this._move(x, y, x1, y1);
        let result = this.getCheckState(camp);
        this.set(x, y, piece);
        this.set(x1, y1, tarPiece);
        return result;
    },
    /**
     * 走子规则是否合法
     * @param piece
     * @param x
     * @param y
     * @param x1
     * @param y1
     */
    isAllowedRule(x, y, x1, y1) {
        const piece = this.get(x, y);
        const fen = piece.fen.toLowerCase();
        if (fen === "r") return this.getNumAtLine(x, y, x1, y1) === 0;
        if (fen === "n") return this.getNumAtSlant(x, y, x1, y1) === 0;
        if (fen === "c") {
            const tarPiece = this.get(x1, y1);
            const num = this.getNumAtLine(x, y, x1, y1);
            return (num === 1 && tarPiece) || (num === 0 && !tarPiece);
        }
        if (fen === "k") return Math.abs(x - x1) + Math.abs(y - y1) === 1;
        if (fen === "b") return Math.abs(x - x1) === 2 && Math.abs(y - y1) === 2 && !this.get((x + x1) / 2, (y + y1) / 2);
        if (fen === "a") return Math.abs(x - x1) === 1 && Math.abs(y - y1) === 1;
        if (fen === "p") {
            if (piece.camp === "black") {
                y = 9 - y;
                y1 = 9 - y1;
            }
            return Math.abs(x - x1) + Math.abs(y - y1) === 1 && y1 - y >= 0;
        }
        return null;
    },
    /**
     * 棋子位置是否合法
     * @param piece
     * @param x
     * @param y
     */
    isAllowedPosition(piece, x, y) {
        const fen = piece.fen.toLowerCase();
        if (piece.camp === "black") y = 9 - y;
        if (fen === "k") {
            if (x >= 3 && x <= 5 && y >= 0 && y <= 2) return true;
            return false;
        }
        if (fen === "b") {
            if ((x === 0 && y === 2) || ((x === 2 || x === 6) && y === 0) || y === 4 || (x === 4 && y === 2)) return true;
            return false;
        }
        if (fen === "a") {
            if ((x === 3 || x === 5) && (y === 0 || y === 2)) return true;
            if (x === 4 && y === 1) return true;
            return false;
        }
        if (fen === "p") {
            if ((y === 4 || y === 3) && (x === 0 || x === 2 || x === 4 || x === 6 || x === 8)) return true;
            if (y >= 5 && y <= 9 && x >= 0 && x <= 8) return true;
            return false;
        }
        if (x >= 0 && x <= 8 && y >= 0 && y <= 9) return true;
        return false;
    },
    throwPositionError(x, y) {
        throw new Error("error position: x-" + x + ",y-" + y + " from " + this.name);
    },
    getFen() {},
    /**
     * 返回直線上棋子數量
     * @param x
     * @param y
     * @param x1
     * @param y1
     */
    getNumAtLine(x, y, x1, y1) {
        let num = 0;
        if (x === x1) {
            let start = y < y1 ? y : y1,
                end = y < y1 ? y1 : y;
            for (let i = start + 1; i < end; i++) {
                if (this.get(x, i)) {
                    num += 1;
                }
            }
            return num;
        }
        if (y === y1) {
            let start = x < x1 ? x : x1,
                end = x < x1 ? x1 : x;
            for (let i = start + 1; i < end; i++) {
                if (this.get(i, y)) {
                    num += 1;
                }
            }
            return num;
        }
        return null;
    },
    /**
     * @description 返回日字方向棋子數量
     * @param x
     * @param y
     * @param x1
     * @param y1
     */
    getNumAtSlant(x, y, x1, y1) {
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
};

Object.setPrototypeOf(situationPrototype, Array.prototype);

function getCamp(str: string) {
    return str.match(/[a-z]/) ? "red" : "black";
}

function getPieceList(obj?: initPieceList) {
    if (!obj) obj = getInitPieceList();
    const result = {
        red: {},
        black: {}
    };
    for (let camp in obj) {
        for (let key in obj[camp]) {
            const name = pieceName[key] || "?";
            result[camp][key] = obj[camp][key].map(function(data, index) {
                return {
                    data,
                    index,
                    name,
                    camp,
                    fen: key,
                    x: -10,
                    y: -10
                };
            });
        }
    }
    return result;
}

interface initPieceList {
    red: {
        r?: Array<any>;
        n?: Array<any>;
        b?: Array<any>;
        a?: Array<any>;
        k: Array<any>;
        c?: Array<any>;
        p?: Array<any>;
    };
    black: {
        R?: Array<any>;
        N?: Array<any>;
        B?: Array<any>;
        A?: Array<any>;
        K: Array<any>;
        C?: Array<any>;
        P?: Array<any>;
    };
}

function getInitPieceList(): initPieceList {
    return {
        red: {
            r: ["2", "2"],
            n: ["2", "2"],
            b: ["2", "2"],
            a: ["2", "2"],
            k: ["2"],
            c: ["2", "2"],
            p: ["2", "2", "2", "2", "2"]
        },
        black: {
            R: ["2", "2"],
            N: ["2", "2"],
            B: ["2", "2"],
            A: ["2", "2"],
            K: ["2"],
            C: ["2", "2"],
            P: ["2", "2", "2", "2", "2"]
        }
    };
}

const pieceName = {
    r: "車",
    R: "車",
    n: "馬",
    N: "馬",
    b: "相",
    B: "象",
    a: "仕",
    A: "士",
    k: "帥",
    K: "將",
    c: "炮",
    C: "炮",
    p: "兵",
    P: "卒"
};

// 功能：1、從數組或者fen字符串新建局面，可
