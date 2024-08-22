import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrencyMask]'
})
export class CurrencyMaskDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }
  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    let value = this.el.value;
    value = value.replace(/[^0-9.,]/g, ''); //Remove todos os caracteres nao numéricos exceto . e ,
    value = value.replace(',', '.'); //Troca , por . pra precisão decimal
    const part = value.split('.');

    if (part[1] && part[1].length > 2) {
      part[1] = part[1].substring(0, 2); //limita decimais pra 2 
    }

    this.el.value = part.join('.');
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    let value = parseFloat(this.el.value.replace(/,/g, '.'));
    if (!isNaN(value)) {
      this.el.value = `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      this.el.value = '';
    }
  }
}

