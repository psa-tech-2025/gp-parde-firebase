import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeNoticeService {

  /* ===== NOTICE BOARD ===== */
  private noticeSource = new BehaviorSubject<string[]>([
    'ग्रामपंचायत कार्यालय सोमवार ते शुक्रवार सुरू असते',
    'कर भरण्याची अंतिम तारीख 31 मार्च'
  ]);
  notice$ = this.noticeSource.asObservable();

  /* ===== ANNOUNCEMENTS ===== */
  private announceSource = new BehaviorSubject<string[]>([
    'स्वच्छता अभियान 25 तारखेला आयोजित',
    'पाणीपुरवठा दुरुस्ती काम सुरू आहे'
  ]);
  announcements$ = this.announceSource.asObservable();

  /* ===== CRUD METHODS ===== */

  updateNotices(data: string[]) {
    this.noticeSource.next(data);
  }

  updateAnnouncements(data: string[]) {
    this.announceSource.next(data);
  }
}
