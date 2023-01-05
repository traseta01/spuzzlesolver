import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {


  board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() { }

  ngOnInit(): void {
  }


  /* function to make a move on the board */
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

}
