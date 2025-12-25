import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GpContentService } from 'src/app/services/gp-content.service';
import { HomeNoticeService } from 'src/app/services/home-notice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
notices: any[] = [];
  announcements: any[] = [];
  images: any[] = [];
    members: any[] = [];
     maps: any[] = [];

  // homePosts: any[];
  constructor( private router : Router,
    private gp: GpContentService,
    private noticeService: HomeNoticeService,
  ) {
  //     translate.addLangs(['en', 'mr']);
  // translate.setDefaultLang('mr');
   }

  ngOnInit(): void {
    
    // Gallery
    this.gp.getGallery().subscribe(data => {
      this.images = data;
    });

    // ✅ Firestore notices
    this.gp.getHomeNotices().subscribe(res => {
      this.notices = res;
    });

    // ✅ Firestore announcements
    this.gp.getHomeAnnouncements().subscribe(res => {
      this.announcements = res;
    });

       this.gp.getHomeIntro().subscribe(res => {
      this.members = res;
    });
    
      this.gp.getHomeMap().subscribe(res => {
      this.maps = res;
    });
  }

  
   navigateToGallery() {
    this.router.navigate(['/gallery']);
  }
}
  
    
    
