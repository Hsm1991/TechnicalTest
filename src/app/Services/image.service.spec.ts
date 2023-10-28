import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute, convertToParamMap} from "@angular/router";

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ImageService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    });

    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get image info', () => {
    const dummyImageInfo = {
    };

    service.getImageInfo(1).subscribe((data: any) => {
      expect(data).toEqual(dummyImageInfo);
    });

    const req = httpMock.expectOne('https://picsum.photos/id/1/info');
    expect(req.request.method).toBe('GET');
    req.flush(dummyImageInfo);
  });

  it('should get image URL', () => {
    const imageUrl = service.getImageUrl(1, 500, 500);
    const expectedUrl = 'https://picsum.photos/id/1/500/500.jpg';

    expect(imageUrl).toBe(expectedUrl);
  });

});
