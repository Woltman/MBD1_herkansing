import { Pipe, PipeTransform } from '@angular/core';
import { capitalize } from 'lodash';

/**
 * Generated class for the CapitalizePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string, ...args) {
    return capitalize(value);
  }
}
