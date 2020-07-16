import { _decorator, Component, Node, Vec3, Prefab, CCObject } from "cc";
import { Constants } from "./data/constants";
const { ccclass, property } = _decorator;

/**
 * @description 
 * 1. 摄像机的x轴 是否冲刺板？true:摄像机根据小球位置    false: 根据当前板的位置
 * 2. 摄像机的y轴 是否冲刺中？ true: 摄像机根据小球位置 + 偏移量  false: 根据当前板的y轴 + 偏移量
 * 3. 复活的时候根据 当前板的位置
 * 4. 冲刺板的时候，Y轴移动快
 */

const kTempPos = new Vec3();

@ccclass("CameraManager")
export class CameraManager extends Component {

    @property(Node)
    planeBg: Node = null;

    target_pos_: Vec3 = new Vec3();

    start() {
        this.target_pos_.set(Constants.CAMERA_INIT_POS);
        this.set_plane_position(this.target_pos_);
        this.node.eulerAngles = Constants.CAMERA_INIT_ROT;
    }

    revive() {

    }

    reset() {
        this.target_pos_.set(Constants.CAMERA_INIT_POS);
        this.set_plane_position(this.target_pos_);
    }

    /** 
     * 设置目标x轴
     * @param {number} x 
     */
    set_target_pos_X(x) {
        this.target_pos_.x = x;
    }

    /**
     * 
     * @param {number} y 
     */
    set_target_pos_Y(y) {
        this.target_pos_.y = y;
    }

    /** 移动到目标位置（当前板子的上方10像素处） */
    update(deltaTime: number) {
        kTempPos.set(this.node.position);
        if (kTempPos.x === this.target_pos_.x && kTempPos.y === this.target_pos_.y) {
            return;
        }

        // 纠正偏差
        if (Math.abs(kTempPos.x - this.target_pos_.x) <= Constants.CAMERA_MOVE_MINI_ERR) {
            kTempPos.x = this.target_pos_.x;
            this.set_plane_position(kTempPos);
        } else {
            let offset = this.target_pos_.x - kTempPos.x;
            kTempPos.x += offset * 1 / Constants.CAMERA_MOVE_X_FRAMES;
            this.set_plane_position(kTempPos);
        }

        if (Math.abs(kTempPos.y - this.target_pos_.y) <= Constants.CAMERA_MOVE_MINI_ERR) {
            kTempPos.y = this.target_pos_.y;
            this.set_plane_position(kTempPos);
        } else {
            const y = this.target_pos_.y - kTempPos.y;
            kTempPos.y += (y * (1 / Constants.CAMERA_MOVE_Y_FRAMES));
            this.set_plane_position(kTempPos);
        }


    }

    /**更新背景位置（背景在相机下方27像素处） */
    set_plane_position(pos: Vec3) {
        this.node.setPosition(pos);
        // 移动背景背景
        const y = pos.y - Constants.CAMERA_BG_OFFSET_Y
        this.planeBg.setPosition(pos.x, y, -100);
    }
}
