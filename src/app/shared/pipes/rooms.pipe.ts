import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'rooms',
  pure: false,
})
export class RoomsPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(count: number | null | undefined): string {
    if (count == null) return '';

    const key = count === 1 ? 'common.units.rooms' : 'common.units.rooms_plural';
    return `${count} ${this.translate.instant(key)}`;
  }
}
