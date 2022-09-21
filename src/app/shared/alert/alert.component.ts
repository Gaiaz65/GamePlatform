import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() color ='grey'

  get bgColor() {
    return `bg-${this.color}-400`
  }

  constructor() { }

  ngOnInit(): void {
  }

}
