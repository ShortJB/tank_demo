import { _decorator, Component, Node } from "cc";
import { BoardBasic } from "./board_basic";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

/**
 * @description 掉落跳板
 */
@ccclass("BoardDrop")
export class BoardDrop extends BoardBasic {
    onLoad() {

    }

    /** 跳板的厚度 */
    getHeight() {
        return Constants.BOARD_HEIGTH * Constants.BOARD_HEIGTH_SCALE_DROP;
    }
}
