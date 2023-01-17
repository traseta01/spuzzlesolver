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
    queue: MyNode[] = []

    constructor() {
        this.queue = [];
    }

    parent = (index: number) => Math.floor((index - 1) / 2)
    left = (index: number) => 2 * index + 1
    right = (index: number) => 2 * index + 2
    hasLeft = (index: number) => this.left(index) < this.queue.length
    hasRight = (index: number) => this.right(index) < this.queue.length

    swap = (a: number, b: number) => {
        const tmp = this.queue[a]
        this.queue[a] = this.queue[b]
        this.queue[b] = tmp
      }

    enqueue = (item: MyNode) => {
        this.queue.push(item)

        let i = this.queue.length - 1
        while (i > 0) {
            const p = this.parent(i)
            if (this.queue[p].FVALUE < this.queue[i].FVALUE)
                break;

            const tmp = this.queue[i]
            this.queue[i] = this.queue[p]
            this.queue[p] = tmp
            i = p
        }
    }

    dequeue = () => {
        if(this.queue.length == 0) 
            return new MyNode;
        
        this.swap(0, this.queue.length - 1)
        const item = this.queue.pop()
  
        let current = 0
        while(this.hasLeft(current)) {
          let smallerChild = this.left(current)
          if(this.hasRight(current) && this.queue[this.right(current)].FVALUE < this.queue[this.left(current)].FVALUE) 
            smallerChild = this.right(current)
  
          if(this.queue[smallerChild].FVALUE > this.queue[current].FVALUE) 
            break
  
          this.swap(current, smallerChild)
          current = smallerChild
        }
  
        return item
      }
  
}