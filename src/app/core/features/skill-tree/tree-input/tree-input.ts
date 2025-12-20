import { Component, effect, ElementRef, HostListener, inject, output, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SkillsService } from '../../../models/services/skills.service';

@Component({
  selector: 'app-tree-input',
  imports: [ReactiveFormsModule],
  templateUrl: './tree-input.html',
  styleUrl: './tree-input.css',
})
export class TreeInput {
  readonly skillsService = inject(SkillsService);
  name = new FormControl('');

  @ViewChild('nameInput')
  private nameInput?: ElementRef<HTMLInputElement>;

  closed = output<void>();
  opened = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeInputField();
  }

  ngOnInit() {
    this.opened.emit();
  }

  ngAfterViewInit() {
    queueMicrotask(() => this.nameInput?.nativeElement.focus());
  }

  closeInputField() {
    this.closed.emit();
    this.name.reset();
  }

  addTree() {
    const trimmedName = this.name.value?.trim();
    if (trimmedName) {
      this.skillsService.createTree(trimmedName);
      this.closeInputField();
    }
  }
}
