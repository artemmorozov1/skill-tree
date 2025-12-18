import { Component, inject, input, output, signal } from '@angular/core';
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

  isOpen = signal(false);

  readonly parentId = input<number | null>();
  readonly slot = input<Slot>();
  readonly closed = output<void>();

  // потом переделаю выбор иконок, сейчас он странный..
  // для каждой иконки (по сути это тип скилла) отдельное направление в древе навыков
  iconOptions: SkillIcon[] = ['code', 'chess', 'psychology', 'exercise']; 

  selected = signal(this.iconOptions[0]);

  handleToggle() {
    this.isOpen.update(v => !v);
  }

  handleChoose(opt: SkillIcon) {
    this.selected.set(opt);
    this.isOpen.set(false);
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
