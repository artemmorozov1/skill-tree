import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeList } from './tree-list';

describe('TreeList', () => {
  let component: TreeList;
  let fixture: ComponentFixture<TreeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
