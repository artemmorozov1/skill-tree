import { Component, computed, effect, inject, signal } from '@angular/core';
import { SkillsService } from '../../../models/services/skills.service';
import { SkillItem } from '../skill-item/skill-item';
import { Skill, Slot } from '../../../models/interfaces/Models';
import { SkillAdder } from '../skill-adder/skill-adder';
import { TreeList } from '../tree-list/tree-list';
import { SkillActionEvent } from '../../../models/interfaces/skill-action-types';
import { ItemMenu } from '../item-menu/item-menu';

@Component({
  selector: 'app-skill-tree-canvas',
  standalone: true,
  templateUrl: './skill-tree-canvas.html',
  styleUrl: './skill-tree-canvas.css',
  imports: [SkillItem, SkillAdder, TreeList, ItemMenu],
})
export class SkillTreeCanvas {
  // Skills logic
  readonly skillsService = inject(SkillsService);
  readonly skills = this.skillsService.getSkills();
  readonly slots = this.skillsService.getVisibleSlots();

  menuOpen = signal(false);
  menuItemId = signal<number | null>(null);
  menuPos = signal<{ x: number; y: number } | null>(null);

  skillById = computed(() => {
    const map = new Map<number, Skill>();
    this.skills().forEach(s => map.set(s.id, s));
    return map;
  });

  selectedSlot: Slot | null = null;

  constructor() {
    effect(() => {
      const tree = this.skillsService.getActiveTreeId();
      if (tree()) this.selectedSlot = null;
    });
  }

  openMenu(e: {x: number, y: number, id: number}) {
    const offsetX = 35;
    const offsetY = 50;
    
    const posX = e.x + offsetX;
    const posY = e.y + offsetY;

    this.menuItemId.set(e.id);
    this.menuPos.set({x: posX, y: posY});
    this.menuOpen.set(true);
  }

  handleDelete(id: number) {
    this.skillsService.deleteSkill(id);
    this.menuPos.set(null);
    this.menuItemId.set(null);
    this.closeMenu();
    this.selectedSlot = null;
  }

  handleRename(id: number) {
    
  }

  closeMenu() {
    this.menuItemId.set(null);
    this.menuPos.set(null);
    this.menuOpen.set(false);
  }

  openSlot(slot: Slot) {
    this.selectedSlot = slot;
    this.closeMenu();
  }

  getParent(id: number) {
    if (id === null) return undefined;
    return this.skillById().get(id);
  }
  
  onSkillPressed(e: SkillActionEvent) {
    if (e.type === 'upgrade') {
      this.skillsService.upgradeSkill(e.skillId);
    } else if (e.type === 'downgrade') {
      this.skillsService.downgradeSkill(e.skillId);
    }
  }


  // Edge drawing logic
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


  // Canvas pan & zoom logic
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
}

