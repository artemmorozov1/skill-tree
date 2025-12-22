export type SkillActionType = 'upgrade' | 'downgrade';

export interface SkillActionEvent {
    skillId: number;
    type: SkillActionType;
}