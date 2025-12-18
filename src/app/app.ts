import { Component, signal } from '@angular/core';
import { SkillTreeCanvas } from './core/features/skill-tree/skill-tree-canvas/skill-tree-canvas';

@Component({
  selector: 'app-root',
  imports: [SkillTreeCanvas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('skill-tree');
}
