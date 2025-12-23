import { Component, computed, input, output } from '@angular/core';
import { Skill } from '../../../models/interfaces/Models';
import { SkillActionEvent } from '../../../models/interfaces/skill-action-types';

@Component({
  selector: 'app-skill-item',
  imports: [],
  templateUrl: './skill-item.html',
  styleUrl: './skill-item.css',
})
export class SkillItem {
  skill = input<Skill>();
  locked = input<boolean>();
  menuActive = input<boolean>();

  pressed = output<SkillActionEvent>();
  menuCalled = output<{ x: number; y: number; id: number }>();
  
  maxLevel = computed(() => {
    return this.skill()?.level === this.skill()?.maxLevel;
  });

  changeSkillLevel(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.locked()) return;
    
    this.pressed.emit({
      skillId: this.skill()!.id,
      type: event.type === 'click' ? 'upgrade' : 'downgrade',
    });
  }

  openMenu(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const s = this.skill();
    if (!s) return;

    this.menuCalled.emit({
      x: s.x,
      y: s.y,
      id: s.id,
    });
  }
}
