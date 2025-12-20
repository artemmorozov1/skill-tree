import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeMenu } from './tree-menu';

describe('TreeMenu', () => {
  let component: TreeMenu;
  let fixture: ComponentFixture<TreeMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
