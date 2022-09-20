import { DatePipe } from '@angular/common';

import { ActivatedRoute, Params } from '@angular/router';
import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import videojs from 'video.js';
import IClip from '../model/clip.model';


@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {

  @ViewChild('videoPlayer', {static: true}) target?:ElementRef
  player?: videojs.Player
  clip?:IClip

  constructor(public route:ActivatedRoute,
      ) { }

  ngOnInit() {
    this.player = videojs(this.target?.nativeElement)
    this.route.data.subscribe(data => {
      this.clip = data['clip'] as IClip

      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    })
  }



}
