import { _decorator, Component, Node, NodePool, Vec3, instantiate, Prefab, CCObject } from "cc";
import { Constants } from "../data/constants";

import { BoardNormal } from "./board_normal";
import { BoardSprint } from "./board_sprint";
import { BoardDrop } from "./board_drop";
import { BoardBig } from "./board_big";
import { BoardSpring } from "./board_spring";
import { BoardBasic } from "./board_basic";
const { ccclass, property } = _decorator;

/**
 * @description 板子工厂
 */
@ccclass("boardFactory")
export class boardFactory extends Component {
    /** 子弹节点池 */
    bulletPools: NodePool[] = [];
    
    @property(Prefab)
    boardNormalPrefab: Prefab = null;

    @property(Prefab)
    boardBigPrefab: Prefab = null;

    @property(Prefab)
    boardDropPrefab: Prefab = null;

    @property(Prefab)
    boardSpringPrefab: Prefab = null;

    @property(Prefab)
    boardSprintPrefab: Prefab = null;

    boardMap_: {[key:number]: Prefab} = {};


    onLoad() {
        this.bulletPools[Constants.BOARD_TYPE.NORMAL] =  new NodePool(BoardNormal);
        this.bulletPools[Constants.BOARD_TYPE.BIG] =  new NodePool(BoardBig);
        this.bulletPools[Constants.BOARD_TYPE.DROP] =  new NodePool(BoardDrop);
        this.bulletPools[Constants.BOARD_TYPE.SPRING] =  new NodePool(BoardSpring);
        this.bulletPools[Constants.BOARD_TYPE.SPRINT] =  new NodePool(BoardSprint);

        this.boardMap_[Constants.BOARD_TYPE.NORMAL] = this.boardNormalPrefab;
        this.boardMap_[Constants.BOARD_TYPE.BIG] = this.boardBigPrefab;
        this.boardMap_[Constants.BOARD_TYPE.DROP] = this.boardDropPrefab;
        this.boardMap_[Constants.BOARD_TYPE.SPRING] = this.boardSpringPrefab;
        this.boardMap_[Constants.BOARD_TYPE.SPRINT] = this.boardSprintPrefab;
    
    }

    /**
     * 创建板子
     * @param board_type 
     * @param pos 
     * @param level 
     * @returns Node
     */
    create_board(board_type: number, level: number) {
        let pool = this.bulletPools[board_type];
        let node: Node = undefined;
        if(pool.size() <= 0) {
            let prefab = this.boardMap_[board_type];
            pool.put(instantiate(prefab));
        }
        node = pool.get(this, board_type, level);
        
        return node;
    }

    /**
     * 回收节点
     * @param node 
     */
    delete_board(node: Node){
        let board = node.getComponent(BoardBasic);
        let board_type = board.get_type();
        if(node instanceof Node) {
            let pool = this.bulletPools[board_type];
            if(!pool) {
                return;
            }
            pool.put(node);
        }
    }


}
