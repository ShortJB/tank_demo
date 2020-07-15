import { _decorator, Component, Node, SphereColliderComponent, Vec3, Prefab, instantiate, ModelComponent, Color } from "cc";
import { Constants } from "../data/constants";
import { utils } from "../utils/utils";
import { boardFactory } from "./board_factory";
const { ccclass, property } = _decorator;

/** 跳板基类 */

@ccclass("BoardBasic")
export class BoardBasic extends Component {
    @property(Prefab)
    wavePrefab: Prefab = null;

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
    /** 板子波纹 */
    currWaveFrame: number = Constants.BOARD_WAVE_FRAMES;
    waveOriginScale = new Vec3();
    wave: Node = undefined;
    waveInner: Node = undefined;

    reuse(factory: boardFactory, board_type: number, pos: Vec3, level: number) {
        this.boardType = board_type;
        // 按概率来决定是否是移动板
        if (this.boardType === Constants.BOARD_TYPE.NORMAL || this.boardType === Constants.BOARD_TYPE.DROP || this.boardType === Constants.BOARD_TYPE.SPRING) {
            this.isMoving = this.getIsMove(level);
        }

    }

    unuse() {

    }

    update(dt) {
        this.effectMove();
        this.effectBump();
        this.effectWave();
    }

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

    /**
     * 判断是否能移动
     * @param coeff 难度等级
     */
    getIsMove(coeff: number): boolean {
        const t = utils.getDiffCoeff(coeff, 1, 10);
        return Math.random() * t > 5;
    }

    /** 先往右边移动，移动到最大距离，再往左边移动，来回左右移动 */
    effectMove() {
        if(!this.isMoving){
            return;
        }

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

    initWave() {
        this.wave = instantiate(this.wavePrefab);
        this.node.parent.addChild(this.wave);
        this.wave.active = false;
        this.waveInner = instantiate(this.wavePrefab);
        this.node.parent.addChild(this.waveInner);
        this.waveInner.active = false;
        this.currWaveFrame = Constants.BOARD_WAVE_FRAMES;
        this.waveOriginScale.set(this.wave.scale);
    }

    setWave() {
        if(!this.wave){
            this.initWave();
        }
        
        if (this.boardType != Constants.BOARD_TYPE.BIG) {
            this.currWaveFrame = 0;
            const pos = this.node.position.clone();
            pos.y += Constants.WAVE_OFFSET_Y;
            this.wave.setPosition(pos);
            this.wave.setScale(this.waveOriginScale.clone());
            this.wave.active = true;
            const mat2 = this.wave.getComponent(ModelComponent).material;
            // 初始化时保存以下变量
            const pass = mat2.passes[0];
            const hColor = pass.getHandle('color');
            const color = cc.color('#dadada');
            color.a = 127;
            pass.setUniform(hColor, color);
            this.waveInner.setPosition(pos);
            this.waveInner.setScale(this.waveOriginScale.clone());
        }
    }

    /** 板子波纹特效 */
    effectWave() {
        if(!this.wave){
            return;
        }
        
        if (this.currWaveFrame < Constants.BOARD_WAVE_FRAMES) {
            if (this.currWaveFrame >= Constants.BOARD_WAVE_INNER_START_FRAMES) {// 内层波纹
                if (!this.waveInner.active) {
                    this.waveInner.active = true;
                }

                const mat2 = this.waveInner.getComponent(ModelComponent).material;
                // 初始化时保存以下变量
                const pass = mat2.passes[0];
                const hColor = pass.getHandle('color');
                const color = new Color('#dadada');
                color.a = 127 - Math.sin(this.currWaveFrame * 0.05) * 127;
                pass.setUniform(hColor, color);

                const scale = this.waveInner.getScale();
                this.waveInner.setScale(scale.x + Constants.BOARD_WAVE_INNER_STEP, scale.y, scale.z + Constants.BOARD_WAVE_INNER_STEP);
            }

            // 外层波纹
            const mat2 = this.wave.getComponent(ModelComponent).material;
            // 初始化时保存以下变量
            const pass = mat2.passes[0];
            const hColor = pass.getHandle('color');
            const color = new Color('#dadada');
            color.a = 127 - Math.sin(this.currWaveFrame * 0.1) * 127;
            pass.setUniform(hColor, color);
            const scale = this.waveInner.getScale();
            this.wave.setScale(scale.x + Constants.BOARD_WAVE_STEP, scale.y, scale.z + Constants.BOARD_WAVE_STEP);
            this.currWaveFrame++;
        } else {
            this.wave.active = false;
            this.waveInner.active = false;
        }
    }

}
