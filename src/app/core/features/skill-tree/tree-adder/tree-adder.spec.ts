import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeAdder } from './tree-adder';

describe('TreeAdder', () => {
  let component: TreeAdder;
  let fixture: ComponentFixture<TreeAdder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeAdder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeAdder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
