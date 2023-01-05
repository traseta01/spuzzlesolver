export class MyNode {
    FVALUE: number;
    mcVal: number;
    children: MyNode[];
    nodepath: number[];

    constructor(val = 0, chl = [], fval = -1, np: number[] = []) {
        this.mcVal = val;
        this.children = chl;
        this.FVALUE = fval;
        this.nodepath = np;
    }

    setFvalue(val: number) {
        this.FVALUE = val;
    }
    setNodePath(valarr: number[]) {
        this.nodepath = valarr;
    }
}


export class PriorityQueue {

    queue: MyNode[];

    constructor() {
        this.queue = [];
    }

    enqueue(elem: MyNode) {
        for (let i = 0; i < this.queue.length; i++) {
            if (elem.FVALUE <= this.queue[i].FVALUE) {
                this.queue.splice(i, 0, elem)
                return;
            }
        }
        this.queue.push(elem);
        return;

        // this.queue.push(elem);
    }

    dequeue(): any {
        // remove first element and return it
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0 ? true : false;
    }

    show() {
        console.log(this.queue);
    }
}