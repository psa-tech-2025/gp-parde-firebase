import { Component, OnInit } from '@angular/core';
import { GpContentService } from 'src/app/services/gp-content.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html'
})
export class HomeAdminComponent implements OnInit {

  notices: any[] = [];
  announcements: any[] = [];

  newNotice = '';
  newAnnouncement = '';

  isAdmin = false;
  homeIntroText = '';
homeIntroImage = '';
selectedImageFile!: File;
homeIntroPurpose = '';

newPostText = '';
homePosts: any[] = [];

nameText = '';
postText = '';
selectedImages: File[] = [];

  form!: FormGroup;
  list: any[] = [];
  images: File[] = [];
  editId: string | null = null;
  uid!: string;



  constructor(
    private gp: GpContentService,
    private auth: AuthService,
      private afAuth: AngularFireAuth,
        private fb: FormBuilder
  ) {}

  ngOnInit(): void {
        this.auth.getAuthState().subscribe(user => {
      this.isAdmin = !!user;
    });

    this.gp.getHomeNotices().subscribe(res => this.notices = res);
    this.gp.getHomeAnnouncements().subscribe(res => this.announcements = res);
    // 🔽 NEW

        this.form = this.fb.group({
      nameText: ['', Validators.required],
      postText: ['', Validators.required],
      introText: ['']
    });

    this.afAuth.authState.subscribe(user => {
      if (user) this.uid = user.uid;
    });

    this.load();
  }
  load() {
    this.gp.getHomeIntro().subscribe(res => this.list = res);
  }
    onFileChange(e: any) {
    this.images = Array.from(e.target.files);
  }

  async submit() {
    const imageUrls: string[] = [];

    for (let f of this.images) {
      const url = await this.gp.uploadImage(f);
      imageUrls.push(url);
    }

    const payload = {
      ...this.form.value,
      images: imageUrls
    };

    if (this.editId) {
      await this.gp.updateHomeIntro(this.editId, payload);
    } else {
      await this.gp.addHomeIntro(payload, this.uid);
    }

    this.reset();
  }

  edit(item: any) {
    this.editId = item.id;
    this.form.patchValue(item);
  }

  delete(id: string) {
    if (confirm('Delete this record?')) {
      this.gp.deleteHomeIntro(id);
    }
  }

  reset() {
    this.form.reset();
    this.images = [];
    this.editId = null;
  }

  /* ===== NOTICE ===== */
  addNotice() {
    if (!this.isAdmin || !this.newNotice.trim()) return;
    this.gp.addHomeNotice(this.newNotice);
    this.newNotice = '';
  }

  updateNotice(id: string, text: string) {
    this.gp.updateHomeNotice(id, text);
  }

  deleteNotice(id: string) {
    if (confirm('Delete this notice?')) {
      this.gp.deleteHomeNotice(id);
    }
  }

  /* ===== ANNOUNCEMENT ===== */
  addAnnouncement() {
    if (!this.isAdmin || !this.newAnnouncement.trim()) return;
    this.gp.addHomeAnnouncement(this.newAnnouncement);
    this.newAnnouncement = '';
  }

  updateAnnouncement(id: string, text: string) {
    this.gp.updateHomeAnnouncement(id, text);
  }

  deleteAnnouncement(id: string) {
    if (confirm('Delete this announcement?')) {
      this.gp.deleteHomeAnnouncement(id);
    }
  }





  
}

