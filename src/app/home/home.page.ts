import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ImageService} from "../Services/image.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  images: any[]=[] ;
  public image: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  favorites: any[] = [];
  colorByImage: { [imageId: number]: string } = {};
  isFavorite: { [imageId: number]: boolean } = {};

   favoritesState: any[] = this.getFavorites();



  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private cd: ChangeDetectorRef,
   private elementRef: ElementRef,
   private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < 20; i++) {
      const id = i % 1084;
      this.imageService.getImageInfo(id).subscribe((data: any) => {
        const image = {
          id: id,
          photo: this.imageService.getImageUrl(id, 500, 500),
          author: data.author,
          text: 'Random Lorem Ipsum Text'
        };
        this.images.push(image);
        this.image.push(image);
      });

      this.favoritesState = this.getFavorites();
      this.favoritesState.forEach((image: any) => {
        this.isFavorite[image.id] = true;
        this.colorByImage[image.id] = 'gold';
      });
    }
  }



  loadImages() {
    for (let i = 0; i < this.itemsPerPage; i++) {
      const id = (this.currentPage - 1) * this.itemsPerPage + i;
      if (id > 1083) {
        break;
      }
      this.imageService.getImageInfo(id).subscribe((data: any) => {
        const image = {
          id: id,
          photo: this.imageService.getImageUrl(id, 500, 500),
          author: data.author,
          text: 'Random Lorem Ipsum Text',
        };
        this.images.push(image);
      });
    }
    this.currentPage++;
  }

  loadMore(event: any) {
    setTimeout(() => {
      this.loadImages();
      event.target.complete();
    }, 1000);
  }

  search(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    console.log(this.searchTerm);
    this.images = this.filteredSearch(this.searchTerm);
    console.log(this.searchTerm);
    console.log(this.images);
  }
  filteredSearch(typedText: any) {
    let filtered = ["id", "photo", "author", "text"];
    if (typedText.length == 0) {
      return [...this.image];
    }
    let result = [];
    for (let img of [...this.image]) {
      for (let filter of filtered) {
        // @ts-ignore
        if (typeof(img[filter]) == "string") {
          // @ts-ignore
          if (img[filter].toLowerCase().includes(typedText)) {
            result.push(img);
          }
        } else {
          // @ts-ignore
          if (img[filter] == Number(typedText)) {
            result.push(img);
          }
        }
      }
    }
    return result;
  }



  getFavorites() {
    const favoritesString = localStorage.getItem('favorites');
    if (favoritesString) {
      return JSON.parse(favoritesString);
    } else {
      return [];
    }
  }
  toggleFavorite(image: any) {
    const isFavorite = this.isInFavorites(image);

    if (!isFavorite) {
      this.favoritesState.push(image);
    } else if (isFavorite) {
      this.favoritesState.splice(this.favoritesState.indexOf(image), 1);
      !this.isInFavorites(image);
    }
    localStorage.setItem('favorites', JSON.stringify(this.favoritesState));
    this.colorByImage[image.id] = isFavorite ? 'gold' : 'grey';
  }
  isInFavorites(image: any): boolean {
    const favorites = this.getFavorites();
    return favorites.some((fav: any) => fav.id === image.id);
  }


}




