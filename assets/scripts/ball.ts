import { _decorator, Component, Node, Enum, Vec3, math, Game, Prefab, ParticleSystemComponent } from "cc";
import { Constants } from "./data/constants";
import { CustomEventListener } from "./listener/custom_event_listener";
import { BoardBasic } from "./board/board_basic";
import { PoolManager } from "./pool_manager";

const { ccclass, property } = _decorator;

const kTempPos = new Vec3();

@ccclass("Ball")
export class Ball extends Component {
    /** @type {Constants.BAll_STATE} - 当前状态 */
    private currentBallState = Constants.BAll_STATE.IDLE;
    private fsms_ = new Map<number, BallStateBase>();
    
    @property(Prefab)
    trailPrefab: Prefab = null;

    trailNode: Node = null;

    onLoad() {
        /** 添加一组状态 */
        this.currentBallState = Constants.BAll_STATE.IDLE;
        this.fsms_[Constants.BAll_STATE.IDLE] = new IdleState();
        this.fsms_[Constants.BAll_STATE.JUMPUP] = new JumpUpState();
        this.fsms_[Constants.BAll_STATE.FALLDOWN] = new FallDownState();
        this.fsms_[Constants.BAll_STATE.SPRINT] = new SprintState();

        CustomEventListener.on(Constants.EVENT_NAME.START_GAME, this.start_game, this);
        this.trailNode = PoolManager.instance.get_node(this.trailPrefab, this.node);
        this.playTrail();
        this.reset();
    }

    update() {
        this.fsms_[this.currentBallState].Update();
        this.setTrailPos();
    }

    /** 播放小球尾巴特性 */
    playTrail(){
        this.trailNode.active = true;
        this.trailNode.getComponentInChildren(ParticleSystemComponent).play();
    }

    /** 设置小球尾巴特性位置 */
    setTrailPos() {
        //const pos = this.node.position;
        //const pos = Constants.game.ball.node.position.clone();
        const pos = new Vec3(0, 0, 0);
        this.trailNode.setPosition(pos.x, pos.y - 0.1, pos.z);
    }
    
    /** 
     * 转换状态
     * @param {number} state - 来自：Constants.BAll_STATE
     */
    change_state(state: number) {
        this.fsms_[this.currentBallState].Exit();
        this.currentBallState = state;
        this.fsms_[state].Enter();
    }

    get_state() {
        return this.currentBallState;
    }

    /** 
     * 重现开始 
     * 设置小球开始位置
    */
    reset() {
        kTempPos.set(Constants.BOARD_INIT_POS);
        kTempPos.y += Constants.BALL_RADIUS + Constants.BOARD_HEIGTH / 2 - .001;
        this.node.setPosition(kTempPos);
        this.node.eulerAngles = new Vec3();
        this.change_state(Constants.BAll_STATE.IDLE);
        //this.playTrail();
    }

    revive() {

    }

    /** 开始游戏 */
    start_game() {
        this.change_state(Constants.BAll_STATE.JUMPUP);
    }

    /** 检测落在那个板子上了 */
    check_on_board() {
        // 下落的时候检测小球是否落在板上 
        const board_count = Constants.game.boardManager.get_board_list_count();
        for (let i = 0; i < board_count; ++i) {
            /** @type {Node} */
            let boardNode = Constants.game.boardManager.get_board_list_by_idx(i);
            let x = Math.abs(this.node.position.x - boardNode.position.x);
            let y = this.node.position.y - boardNode.position.y
            //let type = board.boardType;
            let board = boardNode.getComponent(BoardBasic);
            // 落在板上了
            if (this.get_state() === Constants.BAll_STATE.FALLDOWN) {
                if (x <= board.get_radius()) {
                    // 这里可能楼检测问题，因为下落一帧距离可能是0.8，而距离才是0.625，所以会穿过物体
                    // 解决
                    // 1. 下落状态检测
                    // 2. 使用绝对值
                    if (Math.abs(y) <= (Constants.BALL_RADIUS + board.getHeight() / 2)) {
                        this.change_state(Constants.BAll_STATE.JUMPUP);
                        // 板子
                        board.onBallCollideBoard();
                        // 设置当前的板子
                        Constants.game.boardManager.setCurrBoard(boardNode);
                        //设置摄像机Y轴
                        let pos = boardNode.position.clone();
                        pos.y += Constants.CAMERA_OFFSET_Y;
                        Constants.game.cameraManager.set_target_pos_Y(pos.y);
                        // 
                        Constants.game.boardManager.setCurrBoardIdx(boardNode);
                    }
                }
            }

        }
    }


}

/** 
 * 抽象类: abstract 修饰， 里面可以没有抽象方法。但有抽象方法(abstract method)的类必须声明为抽象类(abstract class)
 */
abstract class BallStateBase {
    /** 
     * 进入改状态时候调用
     */
    abstract Enter(): any;

    /**
     * 每帧调用
     */
    abstract Update(): any;

    /**
     * 退出该状态时候调用
     */
    abstract Exit(): any;
}


const _tempPos = new Vec3();
/** 
 * @description 默认状态 
 * */
class IdleState extends BallStateBase {


    Enter() {

    }

    Update() {

    }

    Exit() {

    }
}


/** 
 * @description 正常跳状态
 */
class JumpUpState extends BallStateBase {
    /** 当前帧数 */
    curJumpFrame_: number = 0;
    // 测试
    total_height: number = 0;

    Enter() {

    }

    Update() {
        const ball = Constants.game.ball;
        _tempPos.set(ball.node.position);
        this.curJumpFrame_++;
        if (this.curJumpFrame_ < Constants.BALL_JUMP_FRAMES) {
            this.total_height += Constants.BALL_JUMP_STEP[Math.floor(this.curJumpFrame_ / 2)];
            _tempPos.y += Constants.BALL_JUMP_STEP[Math.floor(this.curJumpFrame_ / 2)];
            ball.node.setPosition(_tempPos);
        } else {//下降
            ball.change_state(Constants.BAll_STATE.FALLDOWN);
        }
    }

    Exit() {
        this.curJumpFrame_ = 0;
    }
}


/** 
 * @description 下落状态
 */
class FallDownState extends BallStateBase {
    curfalldownFrame_: number = 0;
    Enter() {
        this.curfalldownFrame_ = 0;
    }

    Update() {
        const ball = Constants.game.ball;
        _tempPos.set(ball.node.position);
        if (this.curfalldownFrame_ < Constants.BALL_JUMP_FRAMES) {// 模拟重力加速度
            _tempPos.y -= Constants.BALL_JUMP_STEP[Math.floor((Constants.BALL_JUMP_FRAMES - this.curfalldownFrame_ - 1) / 2)];
        } else {
            _tempPos.y -= Constants.BALL_JUMP_STEP[0];
        }
        ball.node.setPosition(_tempPos);
        ball.check_on_board();
        this.curfalldownFrame_++;
    }

    Exit() {
        this.curfalldownFrame_ = 0;
    }
}

/** 
 * @description 冲刺状态
 */
class SprintState extends BallStateBase {
    Enter() {

    }

    Update() {

    }

    Exit() {

    }
}


