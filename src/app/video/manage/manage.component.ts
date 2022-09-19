import { ModalService } from './../../services/modal.service';
import { ClipService } from './../../services/clip.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import IClip from 'src/app/model/clip.model';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip:IClip | null = null

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal:ModalService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : 1;
    });
    this.clipService.getUserClips().subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;

    // this.router.navigateByUrl(`/manage?sort=${value}`)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }
  openModal(event:Event, clip:IClip){
    event.preventDefault()
    this.activeClip = clip

    this.modal.toogleModal('editClip');
  }
}
