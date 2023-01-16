export class MyNode {
    FVALUE: number;
    mcVal: number[];
    children: MyNode[];
    nodepath: number[];

    constructor(val: number[] = [], chl = [], fval = -1, np: number[] = []) {
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

export class PriorityQueue1 {
    heap: MyNode[] = []

    constructor() {
        this.heap = [];
    }

    parent = (index: number) => Math.floor((index - 1) / 2)
    left = (index: number) => 2 * index + 1
    right = (index: number) => 2 * index + 2
    hasLeft = (index: number) => this.left(index) < this.heap.length
    hasRight = (index: number) => this.right(index) < this.heap.length

    swap = (a: number, b: number) => {
        const tmp = this.heap[a]
        this.heap[a] = this.heap[b]
        this.heap[b] = tmp
      }

    insert = (item: MyNode) => {
        this.heap.push(item)

        let i = this.heap.length - 1
        while (i > 0) {
            const p = this.parent(i)
            if (this.heap[p].FVALUE < this.heap[i].FVALUE)
                break;

            const tmp = this.heap[i]
            this.heap[i] = this.heap[p]
            this.heap[p] = tmp
            i = p
        }
    }

    pop = () => {
        if(this.heap.length == 0) 
            return new MyNode;
        
        this.swap(0, this.heap.length - 1)
        const item = this.heap.pop()
  
        let current = 0
        while(this.hasLeft(current)) {
          let smallerChild = this.left(current)
          if(this.hasRight(current) && this.heap[this.right(current)].FVALUE < this.heap[this.left(current)].FVALUE) 
            smallerChild = this.right(current)
  
          if(this.heap[smallerChild].FVALUE > this.heap[current].FVALUE) 
            break
  
          this.swap(current, smallerChild)
          current = smallerChild
        }
  
        return item
      }
  
}