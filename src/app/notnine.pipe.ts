import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notnine'
})
export class NotninePipe implements PipeTransform {

  transform(value: number): string {
    if (value === 9)
      return '\u00A0';
    else
      return value.toString()
  }
}
