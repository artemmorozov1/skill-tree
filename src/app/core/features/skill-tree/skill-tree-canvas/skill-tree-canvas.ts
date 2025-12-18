import { Component, computed, inject, signal } from '@angular/core';
import { SkillsService } from '../../../models/services/skills.service';
import { SkillItem } from '../skill-item/skill-item';
import { Skill, Slot } from '../../../models/interfaces/Models';
import { SkillAdder } from '../skill-adder/skill-adder';
import { TreeAdder } from '../tree-adder/tree-adder';

@Component({
  selector: 'app-skill-tree-canvas',
  standalone: true,
  templateUrl: './skill-tree-canvas.html',
  styleUrl: './skill-tree-canvas.css',
  imports: [SkillItem, SkillAdder, TreeAdder],
})
export class SkillTreeCanvas {
  
  // Skills logic
  skillsService = inject(SkillsService);
  skills = this.skillsService.getSkills();
  slots = this.skillsService.getVisibleSlots();

  selectedSlot: Slot | null = null;

  openSlot(slot: Slot) {
    this.selectedSlot = slot;
  }

  skillById = computed(() => {
    const map = new Map<number, Skill>();
    this.skills().forEach(s => map.set(s.id, s));
    return map;
  });

  getParent(id: number) {
    if (id === null) return undefined;
    return this.skillById().get(id);
  }
  
  onSkillPressed(id: number) {
    this.skillsService.upgradeSkill(id);
  }

  private readonly NODE_SIZE = 64;       // w-16/h-16
  private readonly NODE_TOP_OFFSET = 20; // mt-5
  private readonly NODE_RADIUS = this.NODE_SIZE / 2;

  nodeCenter(skill: Skill) {
    return {
      x: skill.x + this.NODE_RADIUS,
      y: skill.y + this.NODE_TOP_OFFSET + this.NODE_RADIUS,
    };
  }

  edgeCoords(parent: Skill, child: Skill) {
    const p = this.nodeCenter(parent);
    const c = this.nodeCenter(child);
    const dx = c.x - p.x;
    const dy = c.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    const ox = dx / len;
    const oy = dy / len;

    return {
      x1: p.x + ox * this.NODE_RADIUS,
      y1: p.y + oy * this.NODE_RADIUS,
      x2: c.x - ox * this.NODE_RADIUS,
      y2: c.y - oy * this.NODE_RADIUS,
    };
  }


  zoom = signal(1);
  offsetX = signal(0);
  offsetY = signal(0);

  private MIN_ZOOM = 0.5;
  private MAX_ZOOM = 2;

  private isPanning = false;
  private lastX = 0;
  private lastY = 0;

  onWheel(event: WheelEvent) {
    event.preventDefault();

    const delta = -event.deltaY * 0.001;
    let next = this.zoom() + delta;

    if (next < this.MIN_ZOOM) next = this.MIN_ZOOM;
    if (next > this.MAX_ZOOM) next = this.MAX_ZOOM;

    this.zoom.set(next);
  }

  onMouseDown(event: MouseEvent) {
    if (event.button !== 1) return;
    event.preventDefault();

    this.isPanning = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseUp() {
    this.isPanning = false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isPanning) return;

    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;

    this.lastX = event.clientX;
    this.lastY = event.clientY;

    this.offsetX.update(x => x + dx);
    this.offsetY.update(y => y + dy);
  }

  onTreeAdded(name: string) {
    this.selectedSlot = null;
  }
}

