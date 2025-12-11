import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaEs',
  standalone: true
})
export class FechaEsPipe implements PipeTransform {
  private readonly meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (isNaN(date.getTime())) {
      return '';
    }

    const dia = date.getDate();
    const mes = this.meses[date.getMonth()];
    const año = date.getFullYear();

    // Formato bonito en español: "15 de enero de 2024"
    return `${dia} de ${mes} de ${año}`;
  }
}

