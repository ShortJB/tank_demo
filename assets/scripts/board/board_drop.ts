import { _decorator, Component, Node, Vec3 } from "cc";
import { BoardBasic } from "./board_basic";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

var originScale = new Vec3(1, 1, 1);
var tempPos = new Vec3();
/**
 * @description 掉落跳板
 */
@ccclass("BoardDrop")
export class BoardDrop extends BoardBasic {
    currDropFrame = Constants.BOARD_DROP_FRAMES
    onLoad() {
        super.onLoad();
        originScale.set(this.node.scale);
        this.node.setScale(originScale.x, originScale.y * Constants.BOARD_HEIGTH_SCALE_DROP, originScale.z);
    }

    /** 跳板的厚度 */
    getHeight() {
        return Constants.BOARD_HEIGTH * Constants.BOARD_HEIGTH_SCALE_DROP;
    }

    onBallCollideBoard() {
        super.onBallCollideBoard();
        this.setDrop();
    }

    update(dt) {
        super.update(dt);
        this.effectDrop();
    }

    /** 促发掉落 */
    setDrop() {
        this.currDropFrame = 0;
    }

    /** 掉落效果 */
    effectDrop() {
        if (this.currDropFrame < Constants.BOARD_DROP_FRAMES) {
            tempPos.set(this.node.position);
            tempPos.y -= Constants.BOARD_DROP_STEP;
            this.node.setPosition(tempPos);
            this.currDropFrame++;
        }
    }

}
