import { _decorator, Component, Node, Prefab, instantiate, EventTouch, Touch, Vec3 } from "cc";
import { BoardManager } from "./board_manager";
import { Ball } from "./ball";
import { Constants } from "./data/constants";
import { CameraManager } from "./camera_manager";
import { CustomEventListener } from "./listener/custom_event_listener";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
    @property(BoardManager)
    boardManager: BoardManager = null;

    @property(Prefab)
    ballPrefabs_: Prefab = null;

    @property(CameraManager)
    cameraManager: CameraManager = null;

    ball: Ball = null;

    /**移动偏移 */
    moveX: number = 0;
    /** 开始移动位置 */
    startX: number = 0;
    isTouching: Boolean = false;

    tempPos = new Vec3();

    __preload() {
        Constants.game = this;
    }

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.touch_start, this);
        this.node.on(Node.EventType.TOUCH_END, this.touch_end, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touch_move, this);
        const ball = instantiate(this.ballPrefabs_) as Node;
        ball.parent = this.node.parent;
        this.ball = ball.getComponent(Ball);
    }

    start() {
        this.gameStart();
    }

    /** 重现开始游戏 */
    reset() {
        this.boardManager.reset();
        this.ball.reset();
        this.cameraManager.reset();
    }

    /** 当前位置复活 */
    revive() {

    }

    /** 开始游戏 */
    gameStart() {
        CustomEventListener.dispatchEvent(Constants.EVENT_NAME.START_GAME);
    }

    touch_start(touch: Touch, event: EventTouch) {
        this.startX = touch.getLocation().x;
        this.moveX = this.startX;
        this.isTouching = true;
    }

    touch_move(touch: Touch, event: EventTouch) {
        this.moveX = touch.getLocation().x;
    }

    touch_end(touch: Touch, event: EventTouch) {
        this.isTouching = false;
    }

    update() {
        // 控制小球左右移动
        if (this.isTouching && this.moveX != this.startX) {
            let origin_pos = this.ball.node.getPosition();
            let offsetX = (this.moveX - this.startX) * Constants.COEFF_POS_BALL;
            this.tempPos.set(origin_pos.x + offsetX, origin_pos.y, origin_pos.z);
            this.ball.node.setPosition(this.tempPos);
            this.startX = this.moveX;
        }
    }

}
