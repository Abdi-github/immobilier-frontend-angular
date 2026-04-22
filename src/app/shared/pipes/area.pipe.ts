import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'area' })
export class AreaPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return `${value} m²`;
  }
}
