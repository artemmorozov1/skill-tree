export interface Skill {
    id: number;
    name: string;
    description: string;
    icon: SkillIcon;

    level: number;
    maxLevel: number;

    parentId: number | null,
    childrenIds: number[],

    x: number;
    y: number;
}

export interface SkillTree {
    id: number;
    name: string;
    skills: Skill[];
}

export interface Slot {
  parentId: number;
  x: number;
  y: number;
  index: number;
}

export type SkillIcon =
    | 'code'
    | 'chess'
    | 'psychology'
    | 'exercise'