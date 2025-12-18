import { Component, inject } from '@angular/core';
import { SkillsService } from '../../../models/services/skills.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree-adder',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tree-adder.html',
  styleUrl: './tree-adder.css',
})
export class TreeAdder {
  readonly skillsService = inject(SkillsService);
  readonly trees = this.skillsService.getTrees();

  name = new FormControl('');

  selectedTreeId = this.skillsService.getActiveTreeId();


  handleSelect(id: number) {
    this.skillsService.setActiveTree(id);
  }

  handleAdd() {
    this.skillsService.createTree(this.name.value?.trim() || 'New Tree');
    this.name.reset();
  }
}