import { Component, ElementRef, HostListener, input, output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-tree-input',
  imports: [ReactiveFormsModule],
  templateUrl: './tree-input.html',
  styleUrl: './tree-input.css',
})
export class TreeInput {
  mode = input<'add' | 'rename'>('add');
  initialName = input<string>('');

  closed = output<void>();
  saved = output<string>();

  treeName = new FormControl('');

  @ViewChild('nameInput')
  private nameInput?: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.treeName.setValue(this.initialName());
  }

  ngAfterViewInit() {
    queueMicrotask(() => this.nameInput?.nativeElement.focus());
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeInputField();
  }

  saveResult() {
    const trimmedName = this.treeName.value?.trim();
    if (!trimmedName) return;
    this.saved.emit(trimmedName);
    this.closeInputField();
  }

  closeInputField() {
    this.closed.emit();
    this.treeName.reset();
  }
}
