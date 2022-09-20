import { ClipService } from './../services/clip.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Input } from '@angular/core';


@Component({
  selector: 'app-clip-list',
  templateUrl: './clip-list.component.html',
  styleUrls: ['./clip-list.component.scss'],
  providers:[DatePipe]
})
export class ClipListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true

  constructor(
    public clipService: ClipService
  ) {
    this.clipService.getClips()
  }

  ngOnInit(): void {
    if(this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    this.clipService.pageClips = []

  }

  handleScroll = () => {


    const { scrollTop, offsetHeight } = document.documentElement
    const { innerHeight } = window


    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight +-1




    if(bottomOfWindow){
      this.clipService.getClips()

    }
  };
}
