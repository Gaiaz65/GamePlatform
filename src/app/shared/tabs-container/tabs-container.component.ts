import { TabComponent } from './../tab/tab.component';
import { ContentChildren, Component, AfterContentInit, QueryList } from '@angular/core';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs:QueryList<TabComponent> = new QueryList();

  constructor() {
  }

  ngAfterContentInit(): void {

  }

}
