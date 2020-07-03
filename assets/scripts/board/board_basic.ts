import { _decorator, Component, Node } from "cc";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

/** 跳板基类 */

@ccclass("BoardBasic")
export  abstract class BoardBasic extends Component {
    type:number = Constants.BOARD_TYPE.NORMAL;

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
     get_type(){
         return this.type;
     }


}
