import { Pipe, PipeTransform } from '@angular/core';

// Swiss franc formatting: CHF 2'450 (Swiss apostrophe thousands separator)
@Pipe({ name: 'currencyChf' })
export class CurrencyChfPipe implements PipeTransform {
  transform(amount: number | null | undefined, showCurrency = true): string {
    if (amount == null) return '';

    const formatted = Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'");

    return showCurrency ? `CHF ${formatted}` : formatted;
  }
}
