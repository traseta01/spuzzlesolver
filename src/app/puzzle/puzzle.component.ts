import { Component, OnInit } from '@angular/core';
import { MyNode, PriorityQueue, PriorityQueue1 } from '../utils/node';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {

  // board size
  bsize = 4
  // bsize = 3

  nizCounter = []
  selectedSize = "4x4"

  board: number[] = []

  maxNodesToVisit: string = "1000000"

  noSolution: boolean = false
  // hardest configuration to solve 3x3
  // board = [6, 4, 7, 8, 5, 9, 3, 2, 1];
  // board = [8, 6, 7, 2, 5, 4, 3, 9, 1];

  // 'unsolvable' configuration 3x3
  // board = [6, 4, 2, 8, 3, 5, 1, 7, 9];

  // main board
  // board = this.setBoard(this.bsize);
  // hardest configuration to solve 4x4
  // board = [15, 14, 8, 12, 10, 11, 9, 13, 2, 6, 5, 1, 3, 7, 4, 16]

  // easier to solve configurations 4x4
  // board = [4, 10, 2, 8, 1, 6, 11, 7, 5, 12, 16, 3, 14, 9, 15, 13]
  // board = [5, 1, 13, 10, 16, 12, 7, 4, 6, 9, 8, 2, 14, 15, 3, 11]
  // board = [16, 10, 7, 2, 6, 13, 11, 3, 4, 8, 12, 15, 1, 9, 14, 5]
  // board = [1, 6, 12, 10, 7, 4, 3, 13, 15, 14, 5, 2, 8, 9, 16, 11]
  // board = [7, 10, 5, 8, 1, 4, 15, 12, 6, 11, 14, 2, 9, 3, 16, 13]
  // board = [1, 10,  16, 2, 3, 7, 13, 6, 9, 14, 8, 12, 4, 15, 5, 11]
  // board = [12, 1, 11, 5, 2, 13, 16, 7, 10, 6, 3, 9, 14, 15, 4, 8]

  // board = [6,12,8,2,9,10,3,7,15,5,13,16,1,11,14,4]

  timeTotal: number = 0;


  // array of possible indexes on the board to move to
  currentMoves = [-1, -1, -1, -1]

  // root node of the solution tree
  ROOT: any;

  // priority quee for tree traversal
  // pq = new PriorityQueue();
  pq = new PriorityQueue1();
  // pq01 = new PriorityQueue1();

  // solution found indicator
  stoper = false;

  // total number of nodes in the tree
  totalNodes = 0;

  // keep track of visited configurations
  configuration = new Set();

  // to do comment
  visitedConf = new Map<string, number>();

  // solution to the puzzle
  solutions: MyNode[] = [];

  foundNode: any;

  // moves from current configuration to solved puzzle
  moves: number[] = [];

  // disable solve moves button
  disabledButton = false

  constructor() { }

  ngOnInit(): void {
    this.chooseBoard(this.selectedSize)
  }


  /* make a move on the board */
  clickFunction(num: number): void {

    // do nothing if we click empty field
    if (num === this.bsize * this.bsize) {
      return
    }

    // get index of clicked field
    let currIndex = this.board.indexOf(num);
    // get index of empty field
    let indexOfNine = this.board.indexOf(this.bsize * this.bsize);

    // if possible moves do not include clicked field do nothing
    if (!this.getPossibleMoves(this.bsize, indexOfNine).includes(currIndex))
      return;

    // make a move on the board
    [this.board[currIndex], this.board[indexOfNine]] = [this.board[indexOfNine], this.board[currIndex]];

    // check if board is in solved state
    if (this.isSorted(this.board)) {
      alert("Congratulations, You win");
    }

    this.stoper = false;
  }

  // get possible moves, input arguments: size of puzzle and index of empty field (indexOf(9))
  getPossibleMoves(size: number, index: number): number[] {

    let left = index - 1 >= 0 && (index - 1) % size != size - 1 ? index - 1 : -1;
    let right = index + 1 < this.board.length && (index + 1) % size != 0 ? index + 1 : -1;
    let up = index - size >= 0 ? index - size : -1;
    let down = index + size < this.board.length ? index + size : -1;

    // return an array of possible moves
    return [left, right, up, down];
  }

  shuffleBoard(arr: number[]): void {

    this.configuration = new Set();
    this.currentMoves = [-1, -1, -1, -1]
    this.ROOT = null;

    this.resetBoard()
    // // priority quee for tree traversal
    // this.pq = new PriorityQueue1();
    // // this.pq01 = new PriorityQueue1();

    // // solution found indicator
    // this.stoper = false;

    // // total number of nodes in the tree
    // this.totalNodes = 0;

    // // keep track of visited configurations
    // this.configuration = new Set();

    // // to do comment
    // // this.visitedConf = new Map<string, number>();
    // this.visitedConf = new Map<string, number>();

    // // solution to the puzzle
    // this.solutions = [];

    // this.foundNode = undefined;

    // // moves from current configuration to solved puzzle
    // this.moves = [];

    // this.moveNum = 0;
    let brojac = 300 + this.getRandomInt(1, this.bsize);
    while (brojac > 0) {
      let niz: number[] = [];
      this.currentMoves = this.getPossibleMoves(this.bsize, this.board.indexOf(this.bsize * this.bsize))
      this.currentMoves.forEach(el => {
        if (el >= 0)
          niz.push(this.currentMoves.indexOf(el));
      })

      this.board = this.moveNext(this.board, this.shuffle(niz)[0]);
      brojac--;
    }

  }


  // move to index passed to the function
  moveNext(numar: number[], move: number) {

    let myClonedArray = [...numar];
    let indexOfNine = numar.indexOf(this.bsize * this.bsize);

    // if move is valid, make a move
    if (this.currentMoves[move] >= 0)
      [myClonedArray[this.currentMoves[move]], myClonedArray[indexOfNine]] = [myClonedArray[indexOfNine], myClonedArray[this.currentMoves[move]]];

    // return new configuration
    return myClonedArray;
  }


  // add node to a tree
  addChildNodes(node: any, nivo: any): MyNode {

    let pomniz = node.mcVal
    let tekuciPotezi = this.getPossibleMoves(this.bsize, pomniz.indexOf(this.bsize * this.bsize));

    for (let i of tekuciPotezi) {

      // if move is valid
      if (i > -1) {
        let pompotezniz = this.makeAmove(node.mcVal, i);

        // if ((nivo + this.mdSum(pompotezniz) + this.getMisplacedNum(pompotezniz)) > 80)
        //   continue

        // check if this configuration was already visited
        let yap = this.visitedConf.get(this.arrayToStr(pompotezniz));

        if (yap === undefined) {
          // if (yap === undefined || nivo + this.mdSum(pompotezniz) + this.linearConflicts(pompotezniz)*2 < node.FVALUE ) {
          // if (yap === undefined || yap < nivo + this.mdSum(pompotezniz) + this.getMisplacedNum(pompotezniz) / 2) {
          // if (yap === undefined || yap < nivo + this.mdSum(pompotezniz) + this.getMisplacedNum(pompotezniz) / 2) {

          let niz: number[] = [];
          niz = [...node.nodepath];
          niz.push(i);

          let tmpNode = new MyNode(this.makeAmove(node.mcVal, i), [], nivo + this.mdSum(pompotezniz), niz);
          // let tmpNode = new MyNode(this.makeAmove(node.mcVal, i), [], nivo + this.mdSum(pompotezniz) + this.getMisplacedNum(pompotezniz), niz);
          // let tmpNode = new MyNode(this.makeAmove(node.mcVal, i), [], nivo + this.mdSum(pompotezniz) + this.getMisplacedNum(pompotezniz) / 2, niz);
          // let tmpNode = new MyNode(this.makeAmove(node.mcVal, i), [], nivo + this.mdSum(pompotezniz) + this.linearConflicts(pompotezniz) + this.linearConflicts(pompotezniz)/2, niz);
          // let tmpNode = new MyNode(this.makeAmove(node.mcVal, i), [], nivo + this.mdSum(pompotezniz) + this.linearConflicts(pompotezniz), niz);
          // let tmpNode = new MyNode(this.makeAmove(node.mcVal, i), [], nivo + this.linearConflicts(pompotezniz)*2, niz);
          // let tmpNode = new MyNode(this.makeAmove(node.mcVal, i), [], nivo + this.mdSum(pompotezniz) + this.linearConflicts(pompotezniz) + this.getMisplacedNum(pompotezniz)/2, niz);


          this.pq.enqueue(tmpNode);
          // this.pq01.insert(tmpNode);
          // node.children.push(tmpNode);

          this.visitedConf.set(this.arrayToStr(pompotezniz), tmpNode.FVALUE);

          if (this.totalNodes >= parseInt(this.maxNodesToVisit)) {
            this.stoper = true
            this.noSolution = true
            return node
          }

          this.totalNodes++;

          if (this.isSorted(pompotezniz)) {
            // if (this.isSorted4(pompotezniz)) {

            this.solutions.push(tmpNode);
            this.stoper = true
            this.foundNode = tmpNode;

            return node
          }
        }
      }
    }

    return node;
  }


  greadySearch(node: any, nivo: any) {

    let pomniz = node.mcVal
    let tekuciPotezi = this.getPossibleMoves(this.bsize, pomniz.indexOf(this.bsize * this.bsize));

    // gready first search
    let nodesArr: any[][] = []
    let min = 10000
    for (let i of tekuciPotezi) {
      if (i > -1) {

        let nd = this.makeAmove(node.mcVal, i);

        if (undefined === this.visitedConf.get(this.arrayToStr(nd))) {
          nodesArr.push([nd, i])
          let msumcurr = this.mdSum(nd);
          min = msumcurr < min ? msumcurr : min
          // this.visitedConf.set(this.arrayToStr(nd), this.mdSum(nd) + this.linearConflicts(nd));
        }
      }
    }

    var brojac = nodesArr.length
    while (brojac--) {
      if (this.mdSum(nodesArr[brojac][0]) <= min) {
        let niz: number[] = [];
        niz = [...node.nodepath];
        niz.push(nodesArr[brojac][1]);
        // console.log(niz)

        // make current node
        let tmpNode = new MyNode(nodesArr[brojac][0], [], this.mdSum(nodesArr[brojac][0]) + this.linearConflicts(nodesArr[brojac][0]), niz);
        // console.log(tmpNode)
        this.pq.enqueue(tmpNode);
        // this.pq01.insert(tmpNode);
        node.children.push(tmpNode);

        this.visitedConf.set(this.arrayToStr(nodesArr[brojac][0]), tmpNode.FVALUE);

        if (this.totalNodes >= parseInt(this.maxNodesToVisit)) {
          this.stoper = true
          this.noSolution = true
          break
        }

        this.totalNodes++;

        if (this.isSorted(tmpNode.mcVal)) {
          // if (this.isSorted4(tmpNode.mcVal)) {

          this.solutions.push(tmpNode);
          this.stoper = true
          this.foundNode = tmpNode;

        }

      }
    }

    // return node
  }

  makeTree(vred: number[], depth: number) {
    if (this.isSorted(this.board)) {
      // if (this.isSorted4(this.board)) {
      return;
    }

    console.time("01")
    var begin = Date.now();


    this.ROOT = new MyNode(vred);
    // this.ROOT.setFvalue(this.mdSum(vred) + this.getMisplacedNum(vred)/2);
    // this.ROOT.setFvalue(this.mdSum(vred) + this.getMisplacedNum(vred) / 2);
    // this.ROOT.setFvalue(this.mdSum(vred) + this.linearConflicts(vred));
    this.ROOT.setFvalue(this.mdSum(vred) + this.linearConflicts(vred));

    this.pq.enqueue(this.ROOT);
    // this.pq01.insert(this.ROOT);

    let pomNode: any;
    pomNode = this.pq.dequeue();
    // pomNode = this.pq01.pop();

    // while (true) {
    while (!this.stoper || this.pq.queue.length > 0) {

      this.addChildNodes(pomNode, pomNode.nodepath.length + 1);
      // this.greadySearch(pomNode, pomNode.nodepath.length + 1);

      if (this.stoper) {
        console.timeEnd("01")
        var end = Date.now();
        this.timeTotal = (end - begin);

        this.moves = this.foundNode.nodepath;
        // console.log("JSON: ", JSON.stringify(this.ROOT));
        console.log("Number of moves: ", this.moves.length);
        console.log("Total No of Nodes Visited: ", this.totalNodes);
        // console.log("Length of the Queue: ", this.pq.queue.length);
        console.log("Solution: ", this.solutions);
        return;

      }

      pomNode = this.pq.dequeue();
      // pomNode = this.pq01.pop();
      // console.log("POMOCNI NODE", pomNode)

      // depth--;
    }
  }

  // make a move
  makeAmove(numar: number[], move: number) {
    let myClonedArray = [...numar];
    let indexOfNine = numar.indexOf(this.bsize * this.bsize);
    [myClonedArray[move], myClonedArray[indexOfNine]] = [myClonedArray[indexOfNine], myClonedArray[move]];
    return myClonedArray;
  }


  linearConflicts(conf: number[]): number {

    // conflits in rows
    let niz = [...conf];

    let numConflicts = 0

    // take rows and columns from board array
    for (let i = 0; i < this.bsize; i++) {
      let pomniz = niz.slice(i * this.bsize, (i + 1) * this.bsize);
      // console.log("ROWS: ", pomniz);

      // find conflicts in rows
      let belongsRow: number[] = [];
      for (let j = 0; j < pomniz.length; j++) {
        if (pomniz[j] === this.bsize * this.bsize)
          continue;

        if (pomniz[j] <= (i + 1) * this.bsize && pomniz[j] >= i * this.bsize)
          belongsRow.push(pomniz[j]);
      }

      // if have more than one element that belongs in the row
      if (belongsRow.length > 1) {
        for (let j = 0; j < belongsRow.length - 1; j++) {
          for (let k = j + 1; k < belongsRow.length; k++) {
            if (belongsRow[j] > belongsRow[k]) {
              // console.log("RED SA konfliktima ", pomniz);
              numConflicts++;
            }
          }
        }
      }

      // find conflicts in columns
      let belongsColumn: number[] = [];
      pomniz = [];
      // construct columns
      for (let j = 0; j < this.bsize; j++) {
        pomniz.push(conf[i + j * this.bsize]);
      }

      for (let j = 0; j < pomniz.length; j++) {
        if (pomniz[j] === this.bsize * this.bsize)
          continue;

        if ((pomniz[j] - 1) % this.bsize === i)
          belongsColumn.push(pomniz[j]);
      }

      // if have more than one element that belongs in the row
      if (belongsColumn.length > 1) {
        for (let j = 0; j < belongsColumn.length - 1; j++) {
          for (let k = j + 1; k < belongsColumn.length; k++) {
            if (belongsColumn[j] > belongsColumn[k]) {
              // console.log("KOLNA SA konfliktima ", pomniz);
              numConflicts++;
            }
          }
        }
      }

      // console.log("Columns, ", pomniz);
    }

    // console.log("TOTAL CONFLICTS:  ", numConflicts);
    return numConflicts;
  }



  resetBoard() {
    this.configuration = new Set();
    this.currentMoves = [-1, -1, -1, -1]
    this.ROOT = null;

    // priority quee for tree traversal
    this.pq = new PriorityQueue1();
    // this.pq01 = new PriorityQueue1();

    // solution found indicator
    this.stoper = false;

    // total number of nodes in the tree
    this.totalNodes = 0;

    // keep track of visited configurations
    this.configuration = new Set();

    // to do comment
    this.visitedConf = new Map<string, number>();

    // solution to the puzzle
    this.solutions = [];

    this.foundNode = undefined;

    // moves from current configuration to solved puzzle
    this.moves = [];

    // this.board = this.setBoard(this.bsize)

    this.timeTotal = 0

    this.noSolution = false
  }

  /* Utility functions */

  // return random int from min inclusive, max exclusive interval
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  // check if array is sorted
  isSorted(numarr: number[]): boolean {

    if (numarr.length <= 1) {
      return true;
    }

    for (let i = 1; i < numarr.length; i++) {
      if (numarr[i - 1] > numarr[i])
        return false
    }

    return true;
  }

  isSorted4(numarr: number[]): boolean {

    if (numarr.length <= 1) {
      return true;
    }

    if (numarr[0] === 1 && numarr[1] === 2 && numarr[2] === 3 && numarr[3] === 4 && numarr[4] == 5 && numarr[8] == 9 && numarr[12] == 13)
      // if (numarr[0] === 1 && numarr[1] === 2 && numarr[2] === 3 && numarr[3] === 4)
      return true

    return false;
  }

  // Fisher-Yates unbiased array shuffle
  shuffle(array: number[]) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }


  // return string from an array of numbers
  arrayToStr(numarr: number[]): string {
    if (numarr.length === 0)
      return ""

    let str = "";

    for (let i = 0; i < numarr.length; i++) {
      str += numarr[i].toString();
    }

    return str;
  }


  // get manhattan distance for a field value
  getManhattanDistance(numarr: number[], size: number, value: number): number {
    let indexCurr = numarr.indexOf(value);
    let indexProper = value - 1;

    // console.log("Index CURR: ", indexCurr);
    // console.log("Index PROPER: ", indexProper);

    return Math.abs(Math.floor(indexCurr / size) - Math.floor(indexProper / size)) + Math.abs(indexCurr % size - indexProper % size);
  }

  // get sum of manhattan distances for a configuration passed in
  mdSum(numarr: number[]): number {

    let sum = 0;

    for (let i = 1; i < this.bsize * this.bsize; i++) {
      sum += this.getManhattanDistance(numarr, this.bsize, i);
    }

    return sum;
  }

  // return number of misplaced tiles in the current configuration
  getMisplacedNum(numarr: number[]): number {
    let pom = 0;
    for (let i = 0; i < numarr.length; i++) {
      if (i + 1 != numarr[i])
        pom++;
    }

    // console.log("Num Misplaced: ", pom);
    return pom;
  }

  async solveFromMoves(numar: number[]) {
    if (numar.length < 1)
      return;

    let coef = 1
    if (numar.length > 100) {
      coef = (coef + numar.length / 100) * 1.4
    }

    this.disabledButton = true

    for (let i = 0; i < numar.length; i++) {


      this.board = this.makeAmove(this.board, numar[i]);
      await this.delay(150 / coef);
      // await this.delay(50);

      coef = (1 + (numar.length - i) / 100) * 1.3
    }

    this.resetBoard()
    this.disabledButton = false;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setBoard(num: number): number[] {

    let arr = [];

    for (let i = 1; i <= num * num; i++) {
      arr.push(i);
    }

    return arr;
  }

  chooseBoard(ssize: string) {

    if (ssize === "3x3") {
      this.bsize = 3;
    }

    if (ssize === "4x4") {
      this.bsize = 4;
    }

    this.board = this.setBoard(this.bsize);
  }

  setMaxNodes(maxnodes: string) {
    this.maxNodesToVisit = maxnodes
    this.stoper = false
    this.noSolution = false
  }
}
