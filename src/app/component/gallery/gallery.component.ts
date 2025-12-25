import { Component, OnInit } from '@angular/core';
import { GpContentService } from 'src/app/services/gp-content.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  images: any[] = [];

  // admin-only state
  isAdmin = false;
  selectedFile!: File;
  description = '';
  editId: string | null = null;
  selectedImage: any = null;

  constructor(
    private gp: GpContentService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
      this.gp.getGallery().subscribe(data => {
    this.images = data;
  });

  // 🔐 Check login only (NO ROLE)
  this.auth.getAuthState().subscribe(user => {
  this.isAdmin = !!user; // logged in = true, public = false
});

  }
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async save() {
  if (!this.isAdmin) return;

  // 🚫 Limit: only 10 images allowed (for ADD only)
  if (!this.editId && this.images.length >= 10) {
    alert('Maximum 10 images allowed in gallery.');
    return;
  }

  let url = '';

  if (this.selectedFile) {
    url = await this.gp.uploadImage(this.selectedFile);
  }

  if (this.editId) {
    // ✏️ UPDATE (no limit check)
    await this.gp.updateGallery(this.editId, {
      description: this.description,
      ...(url && { url })
    });
  } else {
    // ➕ ADD
    await this.gp.addGallery({
      url,
      description: this.description
    });
  }

  this.reset();
}


  edit(item: any) {
    if (!this.isAdmin) return;
    this.editId = item.id;
    this.description = item.description;
  }

  delete(id: string) {
    if (!this.isAdmin) return;
    if (confirm('Delete this image?')) {
      this.gp.deleteGallery(id);
    }
  }

  reset() {
    this.editId = null;
    this.description = '';
    this.selectedFile = undefined as any;
  }
  openModal(image: any) {
  this.selectedImage = image;
  document.body.style.overflow = 'hidden'; // disable background scroll
}

closeModal() {
  this.selectedImage = null;
  document.body.style.overflow = 'auto';
}
}
