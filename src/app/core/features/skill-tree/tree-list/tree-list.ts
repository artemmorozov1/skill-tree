import { Component, HostListener, inject, signal } from '@angular/core';
import { SkillsService } from '../../../models/services/skills.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TreeInput } from '../tree-input/tree-input';
import { TreeMenu } from '../tree-menu/tree-menu';

@Component({
  selector: 'app-tree-adder',
  imports: [ReactiveFormsModule, CommonModule, TreeInput, TreeMenu],
  templateUrl: './tree-list.html',
  styleUrl: './tree-list.css',
})
export class TreeList {
  readonly skillsService = inject(SkillsService);
  readonly trees = this.skillsService.getTrees();

  selectedTreeId = this.skillsService.getActiveTreeId();

  isInputOpen = signal(false);

  inputMode = signal<'add' | 'rename'>('add');
  inputName = signal<string>('');
  inputTreeId = signal<number | null>(null);

  menuOpen = signal(false);
  menuTreeId = signal<number | null>(null);
  menuPos = signal<{ x: number; y: number } | null>(null);

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen.set(false);
    this.menuTreeId.set(null);
    this.menuPos.set(null);
  }

  openMenu(event: MouseEvent, treeId: number) {
    event.stopPropagation();
    event.preventDefault();
    this.menuTreeId.set(treeId);
    this.menuPos.set({x: event.clientX, y: event.clientY});
    this.menuOpen.set(true);
  }

  handleSelect(id: number) {
    this.skillsService.setActiveTree(id);
  }

  handleDeleteTree(id: number) {
    this.skillsService.deleteTree(id);
    this.closeMenu();
  }

  openRenameInput(id: number) {
    const tree = this.skillsService.getTreeById(id);
    if (!tree) return;

    this.openInput('rename', id, tree.name);
    this.closeMenu();
  }

  openAddInput() {
    this.openInput('add');
  }

  handleInputSaved(savedName: string) {
    const treeId = this.inputTreeId();
    if (this.inputMode() === 'rename' && treeId !== null){
      this.skillsService.renameTree(treeId, savedName);
    }
    else {
      this.skillsService.createTree(savedName);
    }
    this.closeInputField();
  }

  closeInputField() {
    this.isInputOpen.set(false);
  }

  private openInput(mode: 'add' | 'rename' = 'add', treeId: number | null = null, name: string = '') {
    this.inputMode.set(mode);
    this.inputTreeId.set(treeId);
    this.inputName.set(name);
    this.openInputField();
  }

  private openInputField() {
    this.isInputOpen.set(true);
  }
}
