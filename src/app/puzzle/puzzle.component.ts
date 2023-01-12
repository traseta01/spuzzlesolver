import { Component, OnInit } from '@angular/core';
import { MyNode, PriorityQueue } from '../utils/node';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {

  // main board
  // board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // hardest configuration to solve
  board = [6, 4, 7, 8, 5, 9, 3, 2, 1];
  // board = [8, 6, 7, 2, 5, 4, 3, 9, 1];



  // array of possible indexes on the board to move to
  currentMoves = [-1, -1, -1, -1]

  // root node of the solution tree
  ROOT: any;

  // priority quee for tree traversal
  pq = new PriorityQueue();

  // solution found indicator
  stoper = false;

  // total number of nodes in the tree
  totalNodes = 1;

  // keep track of visited configurations
  configuration = new Set();

  // to do comment
  visitedConf = new Map<number, number>();

  // solution to the puzzle
  solutions: MyNode[] = [];

  foundNode: any;

  // moves from current configuration to solved puzzle
  moves: number[] = [];

  constructor() { }

  ngOnInit(): void {
  }


  /* make a move on the board */
  clickFunction(num: number): void {

    // do nothing if we click empty field
    if (num === 9) {
      return
    }

    // get index of clicked field
    let currIndex = this.board.indexOf(num);
    // get index of empty field
    let indexOfNine = this.board.indexOf(9);

    // if possible moves do not include clicked field do nothing
    if (!this.getPossibleMoves(3, indexOfNine).includes(currIndex))
      return;

    // make a move on the board
    [this.board[currIndex], this.board[indexOfNine]] = [this.board[indexOfNine], this.board[currIndex]];

    // check if board is in solved state
    if (this.isSorted(this.board)) {
      alert("Congratulations, You win");
    }

  }

  // get possible moves, input arguments: size of puzzle and index of empty field (indexOf(9))
  getPossibleMoves(size: number, index: number): number[] {

    let left = index - 1 >= 0 && (index - 1) % 3 != size - 1 ? index - 1 : -1;
    let right = index + 1 < this.board.length && (index + 1) % 3 != 0 ? index + 1 : -1;
    let up = index - size >= 0 ? index - size : -1;
    let down = index + size < this.board.length ? index + size : -1;

    // return an array of possible moves
    return [left, right, up, down];
  }

  shuffleBoard(arr: number[]): void {

    this.configuration = new Set();
    this.currentMoves = [-1, -1, -1, -1]
    this.ROOT = null;

    // priority quee for tree traversal
    this.pq = new PriorityQueue();

    // solution found indicator
    this.stoper = false;

    // total number of nodes in the tree
    this.totalNodes = 1;

    // keep track of visited configurations
    this.configuration = new Set();

    // to do comment
    this.visitedConf = new Map<number, number>();

    // solution to the puzzle
    this.solutions = [];

    this.foundNode = undefined;

    // moves from current configuration to solved puzzle
    this.moves = [];

    // this.moveNum = 0;
    let brojac = 300 + this.getRandomInt(1, 3);
    while (brojac > 0) {
      let niz: number[] = [];
      this.currentMoves = this.getPossibleMoves(3, this.board.indexOf(9))
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
    let indexOfNine = numar.indexOf(9);

    // if move is valid, make a move
    if (this.currentMoves[move] >= 0)
      [myClonedArray[this.currentMoves[move]], myClonedArray[indexOfNine]] = [myClonedArray[indexOfNine], myClonedArray[this.currentMoves[move]]];

    // return new configuration
    return myClonedArray;
  }


  // add node to a tree
  addChildNodes(node: any, nivo: any): MyNode {

    let pomniz = this.numToArr(node.mcVal)
    let tekuciPotezi = this.getPossibleMoves(3, pomniz.indexOf(9));

    for (let i of tekuciPotezi) {

      // if move is valid
      if (i > -1) {
        let pompotezniz = this.makeAmove(this.numToArr(node.mcVal), i);

        // do not visit nodes where FVALUE is greater than 31
        if ((nivo + this.mdSum(pompotezniz)) > 31)
          continue

        // check if this configuration was already visited
        let yap = this.visitedConf.get(this.arrayToNum(pompotezniz));

        if (yap === undefined) {

          let niz: number[] = [];
          niz = [...node.nodepath];
          niz.push(i);

          let tmpNode = new MyNode(this.arrayToNum(this.makeAmove(this.numToArr(node.mcVal), i)), [], nivo + this.mdSum(pompotezniz), niz);

          this.pq.enqueue(tmpNode);
          node.children.push(tmpNode);

          this.visitedConf.set(this.arrayToNum(pompotezniz), tmpNode.FVALUE);
          this.totalNodes++;

          if (this.isSorted(pompotezniz)) {

            this.solutions.push(tmpNode);
            this.stoper = true
            this.foundNode = tmpNode;

          }
        }
      }
    }

    return node;
  }

  makeTree(vred: number, depth: number) {
    if (this.isSorted(this.board)) {
      return;
    }

    this.ROOT = new MyNode(vred);
    this.pq.enqueue(this.ROOT);

    let pomfval = this.mdSum(this.numToArr(vred))
    this.visitedConf.set(vred, pomfval);
    this.ROOT.setFvalue(pomfval + this.getMisplacedNum(this.numToArr(vred)));

    let pomNode: MyNode;
    pomNode = this.pq.dequeue();

    while (true) {

      this.addChildNodes(pomNode, pomNode.nodepath.length + 1);
      if (this.stoper) {

        this.moves = this.foundNode.nodepath;
        console.log("JSON: ", JSON.stringify(this.ROOT));
        console.log("Number of moves: ", this.foundNode.FVALUE);
        console.log("Total No of Nodes Visited: ", this.totalNodes);
        console.log("Length of the Queue: ", this.pq.queue.length);
        console.log("Solution: ", this.solutions);
        return;

      }

      pomNode = this.pq.dequeue();

      // depth--;
    }
  }

  // make a move
  makeAmove(numar: number[], move: number) {
    let myClonedArray = [...numar];
    let indexOfNine = numar.indexOf(9);
    [myClonedArray[move], myClonedArray[indexOfNine]] = [myClonedArray[indexOfNine], myClonedArray[move]];
    return myClonedArray;
  }

  resetBoard(){
    this.configuration = new Set();
    this.currentMoves = [-1, -1, -1, -1]
    this.ROOT = null;

    // priority quee for tree traversal
    this.pq = new PriorityQueue();

    // solution found indicator
    this.stoper = false;

    // total number of nodes in the tree
    this.totalNodes = 1;

    // keep track of visited configurations
    this.configuration = new Set();

    // to do comment
    this.visitedConf = new Map<number, number>();

    // solution to the puzzle
    this.solutions = [];

    this.foundNode = undefined;

    // moves from current configuration to solved puzzle
    this.moves = [];
  
    this.board = [1,2,3,4,5,6,7,8,9]
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


  // return array of digits from number
  numToArr(num: number): number[] {
    let pom = num;
    let niz: number[] = [];

    // :)
    for (let i of pom.toString()) {
      niz.push(Number(i));
    }

    return niz;
  }

  // return number from an array of digits
  arrayToNum(numarr: number[]): number {
    let pom = 0;

    for (let i = 0; i < numarr.length; i++) {
      pom = (pom + numarr[i]) * 10;
    }

    return pom / 10;
  }

  // get manhattan distance for a field value
  getManhattanDistance(numarr: number[], size: number, value: number): number {
    let indexCurr = numarr.indexOf(value);
    let indexProper = value - 1;

    // console.log("Index CURR: ", indexCurr);
    // console.log("Index PROPER: ", indexProper);

    return Math.abs(Math.floor(indexCurr / size) - Math.floor(indexProper / size)) + Math.abs(indexCurr % 3 - indexProper % 3);
  }

  // get sum of manhattan distances for a configuration passed in
  mdSum(numarr: number[]): number {

    let sum = 0;

    for (let i of [1, 2, 3, 4, 5, 6, 7, 8]) {
      sum += this.getManhattanDistance(numarr, 3, i);
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
    for (let i of numar) {
      this.board = this.makeAmove(this.board, i);
      await this.delay(150);
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
