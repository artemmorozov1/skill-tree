import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-tree-menu',
  imports: [],
  templateUrl: './tree-menu.html',
  styleUrl: './tree-menu.css',
})
export class TreeMenu {
 treeId = input<number | null>(null);
 pos = input<{ x: number; y: number } | null>(null);

 closed = output<void>();
 deleted = output<number>();
 renamed = output<number>();

 closeMenu() {
    this.closed.emit();
 }

 deleteTree() {
    this.deleted.emit(this.treeId() ?? 0);
 }

 renameTree() {
  this.renamed.emit(this.treeId() ?? 0);
 }
}
