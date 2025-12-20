import { Component, ElementRef, HostListener, inject, input, output, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SkillsService } from '../../../models/services/skills.service';
import { SkillIcon, Slot } from '../../../models/interfaces/Models';

@Component({
  selector: 'app-skill-adder',
  imports: [ReactiveFormsModule],
  templateUrl: './skill-adder.html',
  styleUrl: './skill-adder.css',
})
export class SkillAdder {
  skillsService = inject(SkillsService);

  name = new FormControl('');
  description: string = ''; 

  isOptionsOpen = signal(false);
  iconOptions: SkillIcon[] = ['code', 'chess', 'psychology', 'exercise']; 
  selected = signal(this.iconOptions[0]);

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

  handleToggle() {
    this.isOptionsOpen.update(v => !v);
  }

  handleChoose(opt: SkillIcon) {
    this.selected.set(opt);
    this.isOptionsOpen.set(false);
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
      icon: this.selected(),
    });

    this.name.reset();
    this.description = '';
    this.closed.emit();
  }
}
