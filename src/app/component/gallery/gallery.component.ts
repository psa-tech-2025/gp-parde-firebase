import { Component, OnInit } from '@angular/core';
import { GpContentService } from 'src/app/services/gp-content.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
editingImageUrl: string | null = null;
isProcessing = false;
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
  if (!this.isAdmin || this.isProcessing) return;

  // 🔐 Confirmation
  const action = this.editId ? 'update' : 'add';
  const confirmed = confirm(`Are you sure you want to ${action} this image?`);
  if (!confirmed) return;

  this.isProcessing = true;

  try {
    let finalUrl = this.editingImageUrl;

    // Upload only if new file selected
    if (this.selectedFile) {
      finalUrl = await this.gp.uploadImage(this.selectedFile);
    }

    // 🚫 Limit only for ADD
    if (!this.editId && this.images.length >= 20) {
      alert('Maximum 20 images allowed in gallery.');
      return;
    }

    if (this.editId) {
      // ✏️ UPDATE
      await this.gp.updateGallery(this.editId, {
        description: this.description,
        url: finalUrl
      });

      alert('Image updated successfully ✅');
    } else {
      // ➕ ADD
      if (!finalUrl) {
        alert('Please select an image');
        return;
      }

      await this.gp.addGallery({
        url: finalUrl,
        description: this.description
      });

      alert('Image added successfully ✅');
    }

    this.reset();
  } catch (err) {
    console.error(err);
    alert('Something went wrong ❌ Please try again.');
  } finally {
    this.isProcessing = false;
  }
}



  edit(item: any) {
    if (!this.isAdmin) return;
    this.editId = item.id;
    this.description = item.description;
      // ✅ STORE EXISTING IMAGE URL
  this.editingImageUrl = item.url;
   this.selectedFile = undefined as any;
  }
delete(id: string) {
  if (!this.isAdmin || this.isProcessing) return;

  const confirmed = confirm('Are you sure you want to delete this image?');
  if (!confirmed) return;

  this.isProcessing = true;

  this.gp.deleteGallery(id)
    .then(() => {
      alert('Image deleted successfully 🗑️');
    })
    .catch(() => {
      alert('Delete failed ❌');
    })
    .finally(() => {
      this.isProcessing = false;
    });
}


  reset() {
    this.editId = null;
    this.description = '';
    this.selectedFile = undefined as any;
     this.editingImageUrl = null;
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
