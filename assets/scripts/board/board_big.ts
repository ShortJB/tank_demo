import { _decorator, Component, Node } from "cc";
import { BoardBasic } from "./board_basic";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

/**
 * 大跳板
 */
@ccclass("BoardBig")
export class BoardBig extends BoardBasic {
    type = Constants.BOARD_TYPE.BIG;

    // get_type() {
    //     return Constants.BOARD_TYPE.BIG;
    // }
    onLoad(){
        // todo要缩放？？
    }

    get_radius() {
        return Constants.BOARD_RADIUS * Constants.BOARD_RADIUS_SCALE_GIANT;
    }

}
