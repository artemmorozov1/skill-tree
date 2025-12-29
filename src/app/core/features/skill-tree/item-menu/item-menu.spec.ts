import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMenu } from './item-menu';

describe('TreeMenu', () => {
  let component: ItemMenu;
  let fixture: ComponentFixture<ItemMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
