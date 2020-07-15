import { _decorator, Component, Node } from "cc";
import { BoardBasic } from "./board_basic";
const { ccclass, property } = _decorator;


/**
 * @description 弹簧跳板
 */

@ccclass("BoardSpring")
export class BoardSpring extends BoardBasic {
    onLoad() {
        
    }

    update(dt) {
        super.update(dt);
        
    }
}
