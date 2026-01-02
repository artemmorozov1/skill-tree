import { NgTemplateOutlet, NgClass } from '@angular/common';
import { Component, ContentChild, input, output, signal, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown<T> {
  items = input<T[]>([]);
  selected = input<T>();

  width = input<number>(40);
  showIcon = input<boolean>(true);

  valueChange = output<T>();

  isOpen = signal(false);

  @ContentChild(TemplateRef)
  itemTemplate?: TemplateRef<{ $implicit: T }>;

  widthClass() {
    return this.width ? `w-${this.width()}` : 'w-40';
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  select(item: T) {
    this.valueChange.emit(item);
    this.isOpen.set(false);
  }
}
