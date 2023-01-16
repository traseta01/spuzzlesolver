import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notnine'
})
export class NotninePipe implements PipeTransform {

  transform(value: number, size: number): string {
    if (value === size*size)
      return '\u00A0';
    else
      return value.toString()
  }
}
