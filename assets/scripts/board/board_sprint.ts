import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from "cc";
import { BoardBasic } from "./board_basic";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;


/**
 * @description 弹簧跳板
 */

@ccclass("BoardSprint")
export class BoardSprint extends BoardBasic {
    // 弹簧片
    @property(Prefab)
    springTopPrefab: Prefab = null;

    // 弹簧
    @property(Prefab)
    springHelixPrefab: Prefab = null;

    springHelix: Node = null;

    springTop: Node = null;

    springHelixOriginScale: Vec3 = new Vec3();

    currSpringFrame: number = 0;

    onLoad() {
        super.onLoad();
        this.initSpring();
    }

    update(dt) {
        super.update(dt);
        this.effectSpring();
    }

    onBallCollideBoard() {
        super.onBallCollideBoard();
        this.setSpring();
    }

    /** 构建弹簧节点 */
    initSpring() {
        this.springHelix = instantiate(this.springHelixPrefab);
        this.springHelixOriginScale = this.springHelix.getScale();
        this.springHelix.setScale(1.5, 1, 1.5);
        this.node.addChild(this.springHelix);
        this.springHelix.active = true;
        this.currSpringFrame = 2 * Constants.BOARD_SPRING_FRAMES;
        this.springTop = instantiate(this.springTopPrefab);
        this.node.addChild(this.springTop);
        this.springTop.active = true;
        //const pos = this.node.position.clone();
        const pos = new Vec3(0, 0, 0);
        pos.y += (Constants.BOARD_HEIGTH + Constants.SPRING_HEIGHT) / 2;
        this.springTop.setPosition(pos);

        this.setSpringPos();
    }

    /** 触发弹簧 */
    setSpring() {
        this.currSpringFrame = 0;
        this.setSpringPos();
        this.springHelix.setScale(1.5, 1, 1.5);
        this.springHelix.active = true;
        this.springTop.active = true;
    }

    setSpringPos() {
        // 弹簧的锚点在最底部
        // 弹簧的顶部锚点在中间
        // 跳板的锚点在中间
        // 钻石的锚点在底部偏上
        //let pos = this.node.position.clone();
        let pos = new Vec3(0, 0, 0);
        pos.y += Constants.BOARD_HEIGTH / 2;
        this.springHelix.setPosition(pos);
        //pos = this.node.position.clone();
        pos = new Vec3(0, 0, 0);
        pos.y += (Constants.BOARD_HEIGTH + Constants.SPRING_HEIGHT) / 2;
        this.springTop.setPosition(pos);
    }

    /** 弹簧特效 */
    effectSpring() {
        const z = this.boardType === Constants.BOARD_TYPE.SPRINT ? Constants.SPRING_HELIX_STEP_SPIRNT : Constants.SPRING_HELIX_STEP;
        const y = this.boardType === Constants.BOARD_TYPE.SPRINT ? Constants.SPRING_TOP_STEP_SPRINT : Constants.SPRING_TOP_STEP;
        const scale = this.springHelix.scale;
        const pos = this.springTop.position;
        if (this.currSpringFrame < Constants.BOARD_SPRING_FRAMES) {// 弹簧上升
            this.springHelix.setScale(scale.x, scale.y + z, scale.z);
            this.springTop.setPosition(pos.x, pos.y + y, pos.z);
            this.currSpringFrame++;
        } else if (this.currSpringFrame >= Constants.BOARD_SPRING_FRAMES && this.currSpringFrame < 2 * Constants.BOARD_SPRING_FRAMES) {// 弹簧下降
            this.springHelix.setScale(scale.x, scale.y - z, scale.z);
            this.springTop.setPosition(pos.x, pos.y - y, pos.z);
            this.currSpringFrame++;
        } else {
            this.springHelix.active = false;
        }
    }

}
