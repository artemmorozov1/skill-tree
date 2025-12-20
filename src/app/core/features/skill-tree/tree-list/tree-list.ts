import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { SkillsService } from '../../../models/services/skills.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TreeInput } from '../tree-input/tree-input';

@Component({
  selector: 'app-tree-adder',
  imports: [ReactiveFormsModule, CommonModule, TreeInput],
  templateUrl: './tree-list.html',
  styleUrl: './tree-list.css',
})
export class TreeList {

  readonly skillsService = inject(SkillsService);
  readonly trees = this.skillsService.getTrees();

  selectedTreeId = this.skillsService.getActiveTreeId();
  isOpen = signal(false);

  handleSelect(id: number) {
    this.skillsService.setActiveTree(id);
  }
  
  openInputField() {
    this.isOpen.set(true);
  }

  closeInputField() {
    this.isOpen.set(false);
  }
}
