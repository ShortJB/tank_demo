import { _decorator, Vec3 } from "cc";
import { Game } from "../game";

/** 小球的状态 */
enum BAll_STATE {
    /** 默认状态 */
    IDLE = 0,
    /** 正常跳状态 */
    JUMPUP = 1,
    /** 下落状态 */
    FALLDOWN = 2,
    /** 冲刺 */
    SPRINT = 3
}

/** 消息名称 */
enum EVENT_NAME {
    /** 开始游戏 */
    START_GAME = "START_GAME"
}

/** 板子类型 */
enum BOARD_TYPE {
    /** 正常 */
    NORMAL = 0,
    /** 大板 */
    BIG = 1,
    /** 下降跳板 */
    DROP = 2,
    /** 弹簧 */
    SPRING = 3,
    /** 冲刺跳板 */
    SPRINT = 4
}

export class Constants {
    static BAll_STATE = BAll_STATE;
    static EVENT_NAME = EVENT_NAME;
    static BOARD_TYPE = BOARD_TYPE;

    static game: Game;
    /** @property {Vec3} - 跳板初始化位置 */
    static BOARD_INIT_POS = new Vec3(0, 10, 0);
    /** @property {number} - 球的半径 */
    static BALL_RADIUS = 0.5;
    /** @property {number} - 跳板的厚度 */
    static BOARD_HEIGTH = 0.25;
    /** @property {number} - 跳板初始化个数 */
    static BOARD_NUM = 1;
    /** @property {number} Constants.BOARD_GAP - 正常板间隔高度 */
    static BOARD_GAP = 4.3;
    /** @property {number} Constants.SCENE_MAX_OFFSET_X - 小球最大横向移动距离 */
    static SCENE_MAX_OFFSET_X = 3.5;
    /** @property {number}  Constants.CAMERA_OFFSET_Y - 摄像机y轴偏移 */
    static CAMERA_OFFSET_Y = 10;
    /** @property {number} Constants.CAMERA_MOVE_MINI_ERR - 相机位置最小误差 */
    static CAMERA_MOVE_MINI_ERR = 0.02;
    /** @property {number} Constants.CAMERA_MOVE_X_FRAMES - 相机横向偏移比例 */
    static CAMERA_MOVE_X_FRAMES = 20;
    /** @property {number} Constants.CAMERA_MOVE_Y_FRAMES - 相机纵向偏移比例 */
    static CAMERA_MOVE_Y_FRAMES = 15;
    /** @property {number} Constants.CAMERA_MOVE_Y_FRAMES_SPRING - 弹簧跳板纵向偏移比例 */
    static CAMERA_MOVE_Y_FRAMES_SPRING = 23;
    /** @property {number} Constants.CAMERA_BG_OFFSET_Y - 背景图Y轴偏移相机距离 */
    static CAMERA_BG_OFFSET_Y = 27;

    // camera
    /** @property {number} Constants.CAMERA_INIT_POS - 相机初始位置 */
    static CAMERA_INIT_POS = new Vec3(0, 15, 22);
    /** @property {number} Constants.CAMERA_INIT_ROT - 相机初始旋转 */
    static CAMERA_INIT_ROT = new Vec3(-11, 0, 0);

    /** @property {number} Constants.BALL_JUMP_FRAMES - 正常跳跃帧数 */
    static BALL_JUMP_FRAMES = 20;
    /** @property {number} Constants.BALL_JUMP_STEP - 正常跳跃步长 */
    static BALL_JUMP_STEP = [0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05, 0.03];
    /** @property {number} Constants.BALL_JUMP_STEP_SPRING - 弹簧跳跃步长 */
    static BALL_JUMP_STEP_SPRING = [1.2, 0.8, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05];

    /** @property {number} Constants.BOARD_RADIUS - 跳板半径 */
    static BOARD_RADIUS = 1.5;
    /** @property {number} Constants.BOARD_RADIUS_SCALE_GIANT - 大跳板缩放比例 */
    static BOARD_RADIUS_SCALE_GIANT = 2.8;

    /** @property {number} Constants.BOARD_HEIGTH_SCALE_DROP - 掉落板厚度缩放比例 */
    static BOARD_HEIGTH_SCALE_DROP = 0.5;
    /** @property {number} Constants.BOARD_MOVING_STEP - 移动板移动速度 */
    static BOARD_MOVING_STEP = 0.03;
    /** @property {number} - 板撞击特效帧数 */
    static BOARD_BUMP_FRAMES = 10;
    static BOARD_BUMP_STEP = [-0.15, -0.1, -0.07, -0.02, -0.003, 0.003, 0.02, 0.07, 0.1, 0.15];
}