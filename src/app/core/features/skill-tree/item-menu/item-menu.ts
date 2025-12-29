import { Component, input, output } from '@angular/core';

type MenuTargetType = 'skill' | 'tree';

@Component({
  selector: 'app-item-menu',
  imports: [],
  templateUrl: './item-menu.html',
  styleUrl: './item-menu.css',
})
export class ItemMenu {
 itemId = input<number | null>(null);
 itemType = input<MenuTargetType>();
 pos = input<{ x: number; y: number } | null>(null);

 closed = output<void>();
 deleted = output<number>();
 renamed = output<number>();

 closeMenu() {
    this.closed.emit();
 }

 deleteItem() {
    this.deleted.emit(this.itemId() ?? 0);
 }

 renameItem() {
  this.renamed.emit(this.itemId() ?? 0);
 }
}
