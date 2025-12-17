import { computed, Injectable, signal } from '@angular/core';
import { Skill, SkillIcon, SkillTree, Slot } from '../interfaces/Models';


@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private trees = signal<SkillTree[]>([]);
  private activeTreeId = signal<number | null>(null);

  private nextId = Date.now();
  private readonly verticalGap = 140;
  private readonly horizontalGap = 120;

  constructor() {
    const root = this.makeRoot();
    
    const defaultTree: SkillTree = {
      id: this.genId(),
      name: 'My tree',
      skills: [root],
    };

    this.trees.set([defaultTree]);
    this.activeTreeId.set(defaultTree.id);
  }

  private genId() { return this.nextId++; }

  getTrees() {
     return this.trees.asReadonly();
  }

  getActiveTreeId() {
    return this.activeTreeId.asReadonly();
  }

  getActiveTree() {
    return this.activeTree;
  }

  getSkills() {
    return this.skills;
  }
  
  getVisibleSlots() {
    return this.visibleSlots;
  }

  readonly activeTree = computed(
    () => this.trees().find((t) => t.id === this.activeTreeId()) ?? null
  )

  readonly skills = computed(() => this.activeTree()?.skills ?? []);

  readonly visibleSlots = computed<Slot[]>(() => {
    const tree = this.activeTree();
    if (!tree) return [];
    const slots: Slot[] = [];

    tree.skills.forEach((skill) => {
      if (skill.childrenIds.length === 0) {
        slots.push(
          {
            parentId: skill.id,
            x: skill.x - this.horizontalGap,
            y: skill.y - this.verticalGap,
            index: 0,
          },
          {
            parentId: skill.id,
            x: skill.x + this.horizontalGap,
            y: skill.y - this.verticalGap,
            index: 1,
          }
        );
      }
    });

    return slots;
  });

  private updateActiveTree(mut: (t:SkillTree) => SkillTree) {
    const id = this.activeTreeId();
    if (id === null) return;
    this.trees.update(ts => ts.map(t => t.id === id ? mut(t) : t))
  }

  setActiveTree(id: number) {
    const exists = this.trees().some((t) => t.id === id);
    if (exists) this.activeTreeId.set(id);
  }

  private makeRoot(): Skill {
    return {
        id: this.genId(),
        name: 'Create skill tree',
        description: '',
        icon: 'code',
        level: 1,
        maxLevel: 3,
        parentId: null,
        childrenIds: [],
        x: 0,
        y: 0,
    }
  }

  createTree(name: string) {
    const root = this.makeRoot();
    const tree: SkillTree = {
      id: this.genId(),
      name: name || 'New tree',
      skills: [root],
    };

    this.trees.update((ts) => [...ts, tree]);
    this.activeTreeId.set(tree.id);
  }

  renameTree(id: number, name: string) {
    if (!name) return;
    this.trees.update((ts) => ts.map((t) => t.id === id ? { ...t, name } : t))
  }

  deleteTree(id: number) {
    this.trees.update((ts) => ts.filter((t) => t.id !== id));
    if (this.activeTreeId() === id) {
      const first = this.trees()[0];
      this.activeTreeId.set(first ? first.id : null)
    }
  }

  addSkill(
    parentId: number, slot: { x: number, y : number },
    payload: { name: string, description: string, icon: SkillIcon }
  ) {
    if (!payload.name) return;
    const tree = this.activeTree();
    if (!tree) return;

    const parent = tree.skills.find((s) => s.id === parentId);
    if (!parent) return;

    const child: Skill = {
      id: this.genId(),
      name: payload.name,
      description: payload.description ?? '',
      icon: payload.icon,
      level: 0,
      maxLevel: 3,
      parentId,
      childrenIds: [], 
      x: slot.x,
      y: slot.y,
    };

    this.updateActiveTree((t) => ({
      ...t,
      skills: [
        ...t.skills.map((s)=>
          s.id === parentId
          ? { ...s, childrenIds: [...s.childrenIds, child.id] }
          : s
        ),
        child,
      ]
    }));
  }

  upgradeSkill(id: number) {
    this.updateActiveTree((t) => {
      const skill = t.skills.find((s) => s.id === id);
      if(!skill || skill.level >= skill.maxLevel) return t;

      const parent = skill.parentId ? t.skills.find((t) => t.id === skill.parentId) : null;
      if (parent && parent.level < 1) return t;

      return {
        ...t,
        skills: t.skills.map((s) =>
           s.id === id ? { ...s, level: s.level + 1 } : s
        ),
      };
    });
  }

  isLocked(id: number) : boolean {
    const tree = this.activeTree();
    if (!tree) return false;
    const skill = tree.skills.find((s) => s.id === id);
    if (!skill || !skill.parentId) return false;
    const parent = tree.skills.find((s) => s.id === skill.parentId);

    return !!parent && parent.level < 1;
  }
}
