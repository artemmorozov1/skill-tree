import { Component, ElementRef, HostListener, inject, input, output, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SkillsService } from '../../../models/services/skills.service';
import { SkillIcon, Slot } from '../../../models/interfaces/Models';
import { Dropdown } from './dropdown/dropdown';

@Component({
  selector: 'app-skill-adder',
  imports: [ReactiveFormsModule, Dropdown],
  templateUrl: './skill-adder.html',
  styleUrl: './skill-adder.css',
})
export class SkillAdder {
  skillsService = inject(SkillsService);

  name = new FormControl('');
  description: string = '';

  iconOptions: SkillIcon[] = ['code', 'chess', 'psychology', 'exercise']; 
  iconSelected = signal(this.iconOptions[0]);

  numbers: number[] = [1, 2, 3];
  numberSelected = signal(this.numbers[0]);

  readonly parentId = input<number | null>();
  readonly slot = input<Slot>();
  readonly closed = output<void>();
  readonly opened = output<void>();

  @ViewChild('nameInput')
  private nameInput?: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closed.emit();
  }

  ngOnInit() {
    this.opened.emit();
  }
  
  ngAfterViewInit() {
    this.focusInput();
  }

  selectSkill(opt: SkillIcon) {
    this.iconSelected.set(opt);
    this.focusInput();
  }

  selectNumber(num: number) {
    this.numberSelected.set(num);
    this.focusInput();
  }

  focusInput() {
    this.nameInput?.nativeElement.focus();
  }

  handleAdd() {
    const name = this.name.value?.trim();
    const slot = this.slot();
    const parentId = this.parentId();

    if (!name || !slot) return;
    if (parentId === undefined) return;

    this.skillsService.addSkill(parentId, slot, {
      name,
      description: this.description,
      icon: this.iconSelected(),
      maxLevel: this.numberSelected(),
    });

    this.name.reset();
    this.description = '';
    this.closed.emit();
  }
}
