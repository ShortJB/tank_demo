import { _decorator, Component, Node, Vec3 } from "cc";
import { BoardBasic } from "./board_basic";
import { Constants } from "../data/constants";
import { boardFactory } from "./board_factory";
const { ccclass, property } = _decorator;

var originScale = new Vec3(1, 1, 1);
/**
 * 大跳板
 */
@ccclass("BoardBig")
export class BoardBig extends BoardBasic {
    onLoad(){
        super.onLoad();
        originScale.set(this.node.getScale());
        this.node.setScale(originScale.x  * Constants.BOARD_RADIUS_SCALE_GIANT, originScale.y, originScale.z);
    }

    get_radius() {
        return Constants.BOARD_RADIUS * Constants.BOARD_RADIUS_SCALE_GIANT;
    }

    // reuse(factory: boardFactory, board_type: number, pos: Vec3, level: number){
    //     super.reuse(factory, board_type, pos, level);

    // }
}
