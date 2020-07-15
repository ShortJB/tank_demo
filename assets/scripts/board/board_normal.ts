import { _decorator, Component, Node } from "cc";
import { BoardBasic } from "./board_basic";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

/**
 * @description 普通跳板
 */
@ccclass("BoardNormal")
export class BoardNormal extends BoardBasic {
    onLoad() {
        
    }
}
