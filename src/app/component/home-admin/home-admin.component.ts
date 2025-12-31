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
  isProcessing = false;
editingImages: string[] = []; 
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
    mapForm!: FormGroup;
  maps: any[] = [];
  editMapId: string | null = null;
    // isAdmin = true; // already in your app
  rows  = [];

  // editId: string | null = null;
    geoList: any[] = [];
      formm = {
    key: '',
    label: '',
    value: '',
    icon: '',
    order: 0
  };



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
        this.mapForm = this.fb.group({
      title: ['', Validators.required],
      address: [''],
        mapEmbedUrl: ['', Validators.required], // ✅ iframe URL
      mapLink: ['']                           // ✅ open link
    });

    this.loadMaps();
  }
    loadMaps() {
    this.gp.getHomeMap().subscribe(res => {
      this.maps = res;
    });
  }
    submitMap() {
    if (this.mapForm.invalid) return;

    if (this.editMapId) {
      this.gp.updateHomeMap(this.editMapId, this.mapForm.value);
    } else {
      this.gp.addHomeMap(this.mapForm.value);
    }

    this.resetMapForm();
  }

  editMap(item: any) {
    this.editMapId = item.id;
    this.mapForm.patchValue({
      title: item.title,
      address: item.address,
      mapEmbedUrl: item.mapEmbedUrl,
      mapLink: item.mapLink
    });
  }

  deleteMap(id: string) {
    if (confirm('Delete this map?')) {
      this.gp.deleteHomeMap(id);
    }
  }

  resetMapForm() {
    this.mapForm.reset();
    this.editMapId = null;
  }
  load() {
    this.gp.getHomeIntro().subscribe(res => this.list = res);
  }
onFileChange(e: any) {
  const files = Array.from(e.target.files) as File[];
  this.images.push(...files);
}



async submit() {
  if (this.isProcessing) return;

  const action = this.editId ? 'update' : 'add';
  if (!confirm(`Are you sure you want to ${action} this record?`)) return;

  this.isProcessing = true;

  try {
    // ✅ START WITH OLD IMAGES
    const finalImages: string[] = [...this.editingImages];

    // ✅ UPLOAD & APPEND NEW IMAGES
    for (let f of this.images) {
      const url = await this.gp.uploadImage(f);
      finalImages.push(url);
    }

    const payload = {
      ...this.form.value,
      images: finalImages // ✅ MERGED ARRAY
    };

    if (this.editId) {
      await this.gp.updateHomeIntro(this.editId, payload);
      alert('Updated successfully ✅');
    } else {
      await this.gp.addHomeIntro(payload, this.uid);
      alert('Added successfully ✅');
    }

    this.reset();
  } catch (e) {
    console.error(e);
    alert('Something went wrong ❌');
  } finally {
    this.isProcessing = false;
  }
}




edit(item: any) {
  this.editId = item.id;

  this.form.patchValue({
    nameText: item.nameText,
    postText: item.postText,
    introText: item.introText
  });

  // ✅ KEEP OLD IMAGES
  this.editingImages = [...(item.images || [])];

  // reset new files
  this.images = [];
}




delete(id: string) {
  if (this.isProcessing) return;

  const confirmed = confirm('Are you sure you want to delete this record?');
  if (!confirmed) return;

  this.isProcessing = true;

  this.gp.deleteHomeIntro(id)
    .then(() => {
      alert('Record deleted successfully 🗑️');
    })
    .catch(() => {
      alert('Delete failed ❌');
    })
    .finally(() => {
      this.isProcessing = false;
    });
}


reset() {
  this.form.reset();
  this.images = [];          // new files
  this.editingImages = [];  // old urls
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

