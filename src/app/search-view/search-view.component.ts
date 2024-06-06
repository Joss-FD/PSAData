import { Component } from '@angular/core';
import { PsaRequestService } from '../psa-request.service';
import { PSACert, PSADetailsResponse, PSAImages } from '../types/psa.type';
import { CERT_HISTORY_LENGTH, DEFAULT_PSA_IMAGES, DEFAULT_PSA_RESULT, SEARCH_HISTORY_KEY } from '../constants/constants';
import { FakeLink } from '../types/fake-link.type';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent {

  constructor(private requestService: PsaRequestService, private localStorageService: LocalStorageService) {
    this.result = JSON.parse(DEFAULT_PSA_RESULT).PSACert;
    this.images = DEFAULT_PSA_IMAGES.sort((a, b) => a.IsFrontImage === b.IsFrontImage ? 0 : a.IsFrontImage ? -1 : 1);;
    this.getStringFromPayload(this.result, this.images)
    this.certHistory = localStorageService.getObjectData(SEARCH_HISTORY_KEY) ?? [];
  }

  certNumber: string = "";
  result: PSACert;
  images: PSAImages[] = [];

  cursedCache: any = {};

  copyTextValue: string = "";
  copyTextValue2: string = "";

  certHistory: FakeLink[] = []

  loading: boolean = false;
  searchClick(certNumber?: string) {
    this.loading = true;
    let addToHistory: boolean = !certNumber;

    //Certnumber provided, we update the binded certNumber to update the input value 
    if (certNumber) this.certNumber = certNumber;
    //No certNumber provided, we fallback to the binded certNumber in the input field
    certNumber = certNumber ?? this.certNumber
    
    if(this.cursedCache[certNumber]) {
      this.result = this.cursedCache[certNumber][0];
      this.images = this.cursedCache[certNumber][1];
      this.getStringFromPayload(this.result, this.images, false)
      this.loading = false;
    }
    else {
      this.requestService.getInfoAndImages(certNumber)
      .subscribe(({details, images}) => {
        this.result = details.PSACert;
        //Put the front image first
        this.images = images.sort((a, b) => a.IsFrontImage === b.IsFrontImage ? 0 : a.IsFrontImage ? -1 : 1);
        
        if (!this.result) {
          this.loading = false;
          return;
        }
        
        this.getStringFromPayload(this.result, this.images);
        this.cursedCache[certNumber!] = [this.result, this.images];
        
        if(addToHistory)
        {
          this.certHistory.unshift(new FakeLink(certNumber!, this.result.Subject));
          this.certHistory = this.certHistory.slice(0, CERT_HISTORY_LENGTH - 1);
          this.localStorageService.saveObjectData(SEARCH_HISTORY_KEY, this.certHistory);
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.trace(error)
      })
    }
  }


  getStringFromPayload(result: PSACert, images: PSAImages[], rearangeGrade: boolean = true) {
    // The Grade string displays the number last instead of first
    if (rearangeGrade && result.CardGrade) {
      let tempArr = result.CardGrade.split(" ");
      tempArr.unshift(tempArr.pop() ?? '');
      result.CardGrade = `${tempArr.join(" ")}`;
      this.result.CardGrade = result.CardGrade;
    }
    this.copyTextValue = `PSA ${result.CardGrade} ${result.Subject} #${result.CardNumber} ${result.Variety} ${result.Year}`;
    this.copyTextValue2 = images.map(img => img.ImageURL).join(";");
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  clearHistory() {
    this.certHistory = [];
    this.localStorageService.removeData(SEARCH_HISTORY_KEY);
  }

  removeHistoryEntry(index: number) {
    this.certHistory.splice(index, 1);
    this.localStorageService.saveObjectData(SEARCH_HISTORY_KEY, this.certHistory);
  }

  //consider using animations
  toggleMenu(element: HTMLElement) {
    if (element.classList.contains("hide")) {
      element.classList.remove("hide");
      element.style.marginRight = "unset";
    }
    else {
      element.classList.add("hide");
      // +0.5rem to acocunt for the right: 0.5rem (used as padding)
      element.style.marginRight = `calc(-${element.offsetWidth}px - 0.5rem)`;
    }
  }
}
