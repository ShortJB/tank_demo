import { _decorator, Component, Node } from "cc";
import { Constants } from "./data/constants";
const { ccclass, property } = _decorator;

@ccclass("Board")
export class Board extends Component {
    /** 类型 */
    type_:number = Constants.BOARD_TYPE.NORMAL;

    start() {
        // Your initialization goes here.
    }

    reset(pos) {
        this.node.setPosition(pos);
    }

    /** 跳板的半径 */
    get_radius() {
        return this.type_ === Constants.BOARD_TYPE.BIG ? Constants.BOARD_RADIUS * Constants.BOARD_RADIUS_SCALE_GIANT: Constants.BOARD_RADIUS;
    }

    /** 跳板的厚度 */
    getHeight() {
        return this.type_ === Constants.BOARD_TYPE.DROP ? Constants.BOARD_HEIGTH * Constants.BOARD_HEIGTH_SCALE_DROP : Constants.BOARD_HEIGTH;
    }

    /** 
     * 跳板类型
     * @returns {number}
     */
    get_type() {
        return this.type_;
    }
    
    
}
