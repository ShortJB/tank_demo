import { _decorator, Component, Node, Prefab, instantiate, Vec3, random, CCObject } from "cc";
import { Constants } from "./data/constants";
import { utils } from "./utils/utils";
import { PoolManager } from "./pool_manager";
import { boardFactory } from "./board/board_factory";


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

    onLoad() {
        let pos = Constants.BOARD_INIT_POS.clone();
        for (let i = 0; i < Constants.BOARD_NUM; ++i) {
            let boardNode = this.boardFactory.create_board(Constants.BOARD_TYPE.SPRINT, pos, 0);
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
    get_board_list_by_idx(idx){
        return this.boardList_[idx];
    }


}
