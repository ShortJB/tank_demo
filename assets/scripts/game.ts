import { _decorator, Component, Node, Prefab, instantiate } from "cc";
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

    __preload() {
        Constants.game = this;
    }

    onLoad() {
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
}
