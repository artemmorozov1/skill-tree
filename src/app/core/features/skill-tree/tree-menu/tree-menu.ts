import { Component, input, output } from '@angular/core';

type MenuTargetType = 'skill' | 'tree';

@Component({
  selector: 'app-tree-menu',
  imports: [],
  templateUrl: './tree-menu.html',
  styleUrl: './tree-menu.css',
})
export class TreeMenu {
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
