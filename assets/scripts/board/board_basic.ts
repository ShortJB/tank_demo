import { _decorator, Component, Node, SphereColliderComponent, Vec3 } from "cc";
import { Constants } from "../data/constants";
import { utils } from "../utils/utils";
const { ccclass, property } = _decorator;

/** 跳板基类 */

@ccclass("BoardBasic")
export abstract class BoardBasic extends Component {
    /** 跳板类型 */
    boardType: number = Constants.BOARD_TYPE.NORMAL;
    /** 是否有钻石 */
    isHadDiamond: boolean = false;
    /** 是否能左右移动 */
    isMoving: boolean = false;
    /** 往右边移动 */
    isMovingRight: boolean = true;
    /** 撞击帧数 */
    bumpFrame_: number = Constants.BOARD_BUMP_FRAMES;
    /** 跳板的半径 */
    get_radius() {
        return Constants.BOARD_RADIUS;
    }

    /** 跳板的厚度 */
    getHeight() {
        return Constants.BOARD_HEIGTH;
    }

    /**
     * 类型 
     * @returns {number} 
     */
    get_type() {
        return this.boardType;
    }

    reuse(board_type: number, pos: Vec3, level: number) {
        this.boardType = board_type;
        // 按概率来决定是否是移动板
        if (this.boardType === Constants.BOARD_TYPE.NORMAL || this.boardType === Constants.BOARD_TYPE.DROP || this.boardType === Constants.BOARD_TYPE.SPRING) {
            this.isMoving = this.setMove(level);
        }

    }

    update(dt) {
        if (this.isMoving) {
            this.effectMove();
        }
        //this.effectBump();
    }

    unuse() {

    }

    setMove(coeff: number): boolean {
        const t = utils.getDiffCoeff(coeff, 1, 10);
        return Math.random() * t > 5;
    }

    /** 先往右边移动，移动到最大距离，再往左边移动，来回左右移动 */
    effectMove() {
        let pos = this.node.getPosition().clone();
        let x = pos.x;
        if (this.isMovingRight && x >= Constants.SCENE_MAX_OFFSET_X) {
            this.isMovingRight = false;
            x = Constants.SCENE_MAX_OFFSET_X;
        } else if (this.isMovingRight) {
            x += Constants.BOARD_MOVING_STEP;
        }

        if (!this.isMovingRight && x <= - Constants.SCENE_MAX_OFFSET_X) {
            x = - Constants.SCENE_MAX_OFFSET_X;
            this.isMovingRight = true;
        } else if (!this.isMovingRight) {
            x -= Constants.BOARD_MOVING_STEP
        }

        this.node.setPosition(x, pos.y, pos.z);
    }

    /** 开始撞击 */
    setBump() {
        this.bumpFrame_ = 0;
    }

    /** 撞击效果 */
    effectBump() {
        if (this.bumpFrame_ < Constants.BOARD_BUMP_FRAMES) {
            let pos = this.node.getPosition();
            pos.y += Constants.BOARD_BUMP_STEP[this.bumpFrame_];
            this.node.setPosition(pos);
            this.bumpFrame_++;
        }

    }

}
