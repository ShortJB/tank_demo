import { _decorator, Component, Node, Enum, Vec3, math, Prefab, NodePool, instantiate, CCObject } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PoolManager")
export class PoolManager {
    poolList_ = {};
    static instance_: PoolManager = undefined;
    static get instance() {
        if (!this.instance_) {
            this.instance_ = new PoolManager();
        }
        return this.instance_;
    }

    /**
     * 
     * @param prefab 
     * @param parent 
     * @returns Node
     */
    get_node(prefab: Prefab, parent: Node) {
        let name = prefab.data.name;
        let node: Node = undefined;
        if (this.poolList_.hasOwnProperty(name)) {
            let pool: NodePool = this.poolList_[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(prefab);
            }
        } else {
            this.poolList_[name] = new NodePool();
            node = instantiate(prefab);
        }
        node.parent = parent;
        return node;
    }

    /** 
     * 将对应节点放回对象池中
     */
    put_node(node:Node) {
        let name = node.name;
        let pool: NodePool = undefined;
        if(this.poolList_.hasOwnProperty(name)) {
            pool = this.poolList_[name];
        }else {
            pool = new NodePool();
        }
        pool.put(node);
    }

    /** 清楚对象池 */
    clean_pool(node: Node) {
        let name  = node.name;
        if(this.poolList_.hasOwnProperty(name)) {
            let pool: NodePool = this.poolList_[name];
            pool.clear();
        }
    }

}