import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImageInfo(id: number) {
    return this.http.get(`https://picsum.photos/id/${id}/info`);
  }

  getImageUrl(id: number, width: number, height: number) {
    return `https://picsum.photos/id/${id}/${width}/${height}.jpg`;
  }
}
