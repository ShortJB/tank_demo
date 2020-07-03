import { _decorator, Component, Node, Prefab, instantiate, Vec3, random } from "cc";
import { Constants } from "./data/constants";
import { Board } from "./board";
import { utils } from "./utils/utils";


const { ccclass, property } = _decorator;

// 负责创建跳板 更新跳板位置
// 检测小球否落在跳板上
// 
@ccclass("BoardManager")
export class BoardManager extends Component {

    @property(Prefab)
    boardPrefab_: Prefab = null;

    /** 跳板列表 */
    boardList_: Board[] = [];

    curBoard: Board = null;

    onLoad() {
        let pos = Constants.BOARD_INIT_POS.clone();
        for (let i = 0; i < Constants.BOARD_NUM; ++i) {
            let board_prefab = instantiate(this.boardPrefab_) as Node;
            board_prefab.parent = this.node.parent;
            let board = board_prefab.getComponent(Board);
            board.reset(pos);
            this.boardList_.push(board);
            pos = this.get_next_board(board, 1);
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
     * @param {Board} board - 跳板
     * @param {number} diff - 难度
     * @returns {Vec3}
     */
    get_next_board(board: Board, diff: number) {
        let pos = board.node.position.clone();
        let o = utils.getDiffCoeff(diff, 1, 2);
        pos.x = (Math.random() - 0.5) * Constants.SCENE_MAX_OFFSET_X * o;
        pos.y += Constants.BOARD_GAP;
        return pos;
    }

    /** 跳板的数量 */
    get_board_list_count() {
        return this.boardList_.length;
    }

    /** @returns {Board} */
    get_board_list_by_idx(idx){
        return this.boardList_[idx];
    }


}
