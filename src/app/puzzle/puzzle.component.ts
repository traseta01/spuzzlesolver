import { Component, OnInit } from '@angular/core';
import { MyNode, PriorityQueue } from '../utils/node';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {


  // main board
  board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  configuration = new Set();

  // array of possible indexes on the board to move to
  currentMoves = [-1, -1, -1, -1]

  // root node of the solution tree
  ROOT: any;

  // priority quee for tree traversal
  pq = new PriorityQueue();

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

    // console.log(this.getManhattanDistance(this.board, 3, num));

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
    // arr = this.shuffle(arr);
    // this.board = [4,2,3,6,1,9,7,5,8]
    // this.board = [1,2,3,4,5,9,7,8,6]
    // this.board = [1,2,3,4,9,5,7,8,6]
    // this.board = [9, 2, 3, 1, 4, 5, 7, 8, 6]
    // this.board = [2, 9, 3, 1, 4, 5, 7, 8, 6]
    // this.board = [8, 2, 9, 7, 1, 3, 4, 6, 5]

    this.configuration = new Set();

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
}
