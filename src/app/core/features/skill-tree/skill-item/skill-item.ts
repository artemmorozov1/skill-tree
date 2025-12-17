import { Component, computed, input, output } from '@angular/core';
import { Skill } from '../../../models/interfaces/Models';

@Component({
  selector: 'app-skill-item',
  imports: [],
  templateUrl: './skill-item.html',
  styleUrl: './skill-item.css',
})
export class SkillItem {
  skill = input<Skill>();
  locked = input<boolean>();
  pressed = output<number>();
  
  upgraded = computed(() => {
    return this.skill()?.level === this.skill()?.maxLevel;
  });

  clickHandler() {
    this.pressed.emit(this.skill()?.id!);
  }
}
