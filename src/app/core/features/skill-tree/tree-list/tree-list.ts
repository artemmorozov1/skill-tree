import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { SkillsService } from '../../../models/services/skills.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree-adder',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tree-list.html',
  styleUrl: './tree-list.css',
})
export class TreeList {

  readonly skillsService = inject(SkillsService);
  readonly trees = this.skillsService.getTrees();

  name = new FormControl('');
  selectedTreeId = this.skillsService.getActiveTreeId();
  isOpen = signal(false);

  @ViewChild('nameInput')
  private nameInput?: ElementRef<HTMLInputElement>;
  

  constructor() {
    effect((onCleanup) => {
      if (!this.isOpen()) return;

      queueMicrotask(() => this.nameInput?.nativeElement.focus());

      const handler = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          this.closeInputField();
        } 
      };

      document.addEventListener('keydown', handler);
      onCleanup(() => document.removeEventListener('keydown', handler));
    });
  }

  handleSelect(id: number) {
    this.skillsService.setActiveTree(id);
  }

  openInputField() {
    this.isOpen.set(true);
  }

  closeInputField() {
    this.name.reset();
    this.isOpen.set(false);
    (document.activeElement as HTMLElement)?.blur();
  }

  addTree() {
    const trimmedName = this.name.value?.trim();
    if (trimmedName) {
      this.skillsService.createTree(trimmedName);
      this.name.reset();
      this.isOpen.set(false);
    }
  }
}
