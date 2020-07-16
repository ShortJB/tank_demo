import { _decorator, Component, Node, Prefab, instantiate, Vec3, random, CCObject } from "cc";
import { Constants } from "./data/constants";
import { utils } from "./utils/utils";
import { PoolManager } from "./pool_manager";
import { boardFactory } from "./board/board_factory";
import { BoardBasic } from "./board/board_basic";


const { ccclass, property } = _decorator;

// 负责创建跳板 更新跳板位置
// 检测小球否落在跳板上
// 
@ccclass("BoardManager")
export class BoardManager extends Component {

    /** 跳板列表 */
    boardList_: Node[] = [];

    @property(boardFactory)
    boardFactory: boardFactory = null;

    /** 当前板子 */
    curBoard: Node = null;

    /** @type {number} - 间隔多少个板，再根据难度随机新版本 */
    boardGroupCount = 0;

    /** @type {number}  难度等级 */
    diffLevel = 50;

    /** @type {boolean} - 当前已存在冲刺板 */
    hasSprint = false;

    /** @type {number} - 跳板的编号 */
    //boardIdx = 0;

    /** @type {number} - 当前跳板编号(小球落在那个板子，那个板子就是当前的编号) */
    currBoardIdx = 0;

    tempIdx: number = 0;

    onLoad() {
        let pos = Constants.BOARD_INIT_POS.clone();
        for (let i = 0; i < Constants.BOARD_NUM; ++i) {
            let boardNode = this.boardFactory.create_board(Constants.BOARD_TYPE.NORMAL, 0);
            boardNode.parent = this.node.parent;
            boardNode.setPosition(pos);
            this.boardList_.push(boardNode);
            pos = this.get_next_board(boardNode, 1);
        }
    }

    /** 重现开始游戏 */
    reset() {

    }

    /** 复活 */
    revive() {

    }

    /** 
     * 下一跳板位置 
     * @param {Node} boardNode - 跳板
     * @param {number} diff - 难度
     * @returns {Vec3}
     */
    get_next_board(boardNode: Node, diff: number) {
        let pos = boardNode.position.clone();
        let o = utils.getDiffCoeff(diff, 1, 2);
        pos.x = (Math.random() - 0.5) * Constants.SCENE_MAX_OFFSET_X * o;
        pos.y += Constants.BOARD_GAP;
        return pos;
    }

    /** 跳板的数量 */
    get_board_list_count() {
        return this.boardList_.length;
    }

    /** @returns {Node} */
    get_board_list_by_idx(idx) {
        return this.boardList_[idx];
    }

    /**
     * 设置当前的板子
     * @param {cc.Node} boardNode
     */
    setCurrBoard(boardNode) {
        this.curBoard = boardNode;
    }

    /**
     * @returns {Node}
     */
    getCurrBoard() {
        return this.curBoard;
    }

    // 创建新跳板信息
    newBoard() {
        let type = Constants.BOARD_TYPE.NORMAL;
        if (this.boardGroupCount <= 0) {
            const coeff = utils.getDiffCoeff(this.diffLevel, 1, 10);
            const t = Math.random() * coeff;
            if (t < 4.2) {
                type = Constants.BOARD_TYPE.NORMAL;
                this.boardGroupCount = 2;
            } else if (t <= 5.5) {
                type = Constants.BOARD_TYPE.BIG;
                this.boardGroupCount = 3;
            } else if (t <= 6.2) {
                type = Constants.BOARD_TYPE.SPRING;
                if (Math.random() > 0.5) {
                    this.boardGroupCount = 2;
                }
            } else if (t <= 7) {
                type = Constants.BOARD_TYPE.DROP;
                this.boardGroupCount = 3
            } else if (t <= 7.5 && false === this.hasSprint) {
                type = Constants.BOARD_TYPE.SPRINT;
                this.hasSprint = true;
            } else {
                type = Constants.BOARD_TYPE.NORMAL;
            }
        }
        this.boardGroupCount--;
        this.newBoardByType(type, this.diffLevel);
    }

    // 游戏过程中新增板
    newBoardByType(newType: number, diffLevel: number) {
        let node = this.boardList_[this.boardList_.length - 1];
        if (!node) {
            console.error("数组为空啊");
            return;
        }
        const pos = this.get_next_board(node, diffLevel);
        let boardNode = this.boardFactory.create_board(newType, diffLevel);
        boardNode.parent = this.node.parent;
        boardNode.setPosition(pos);
        this.boardList_.push(boardNode);
    }

    delete_board(node: Node) {
        this.boardFactory.delete_board(node)
    }

    /** 设置当前板子在数组的编号 */
    setCurrBoardIdx(node: Node) {
        let index = this.boardList_.indexOf(node);
        if (index >= 0) {
            this.currBoardIdx = index;
        }
    }

    update(dt) {
        // 增删板子
        this.tempIdx = this.currBoardIdx;
        for (let i = this.tempIdx - Constants.BOARD_NEW_INDEX; i > 0; i--) {
            let node = this.boardList_.shift();
            this.delete_board(node);
            this.currBoardIdx--;
            this.newBoard();
        }
    }
}
