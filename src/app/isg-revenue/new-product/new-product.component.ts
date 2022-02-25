import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IsgRevenueService } from '../service/isg-revenue.service';
import { NewProductService } from '../service/new-product.service';

import { MatDatepicker } from '@angular/material/datepicker';
import { HotkeysService } from 'angular2-hotkeys';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {
  displayProductDetails = false;
  PARTNERS: any;
  partner: any;
  class: any;
  feature: any;
  applyToclass: any;
  catalog: any;
  currentPage = 0;
  currentPartnerId: any;
  itemsPerPage = 10;
  totalItems: any;
  CLASS_TYPE: any;
  FEATURES: any = [];
  APPLY_PRIMARY_LIST: any = [];
  SELECTED_FEATURES: any[] = [];
  SELECTED_APPLY_TO_CLASS: any[] = [];
  selectTimeConfirmIndex: any;
  @ViewChild('featureDrop') featureDrop: any;
  @ViewChild('apply') apply: any;
  newFeatureManual = '';
  formData: any = {
    catalogId: 0,
    partner: '',
    classType: '',
    features: '',
    applyToClassTypes: '',
    name: '',
    behavior: '',
    revenue: '',
    startDate: '',
    endDate: '',
    priority: 0,
    minQty: 0,
    maxQty: 0,
    upToQty: 0,
    subClass: 0,
  };

  BEHAVIORS: any;
  behavior: any;
  today: Date;
  date: any;
  MinDate = new Date();
  displayApplyToClass = false;
  @ViewChild(MatDatepicker) public startDatePicker: MatDatepicker<Date> | any;
  @ViewChild(MatDatepicker) public endDateTimePicker: MatDatepicker<Date> | any;
  constructor(
    private _snackBar: MatSnackBar,
    private isgRevenueService: IsgRevenueService,
    private _hotkeysService: HotkeysService,
    private router: Router,
    private newProductService: NewProductService
  ) {
    this.today = new Date();
  }

  closeMatSelect(dropDownType: string) {
    if (dropDownType == 'apply') {
      this.apply.close();
    } else if (dropDownType == 'featureDrop') {
      this.featureDrop.close();
    }
  }
  ngOnInit(): void {
    this.getPartners();
    this.newProductService.getClassType().subscribe((res: any) => {});

    this.newProductService.getClassType().subscribe({
      next: (res: any) => {
        this.CLASS_TYPE = res['hydra:member'];
        this.CLASS_TYPE.forEach((element: any) => {
          if (element.primary) {
            this.APPLY_PRIMARY_LIST.push(element);
          }
        });
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
    this.newProductService.getBehavior().subscribe({
      next: (res: any) => {
        this.BEHAVIORS = res['hydra:member'];
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
  }
  openedChange(opened: boolean) {
    console.log(opened ? 'opened' : 'closed');
  }

  getPartners() {
    this.isgRevenueService.getPartners().subscribe((res: any) => {
      if (res['hydra:member']) {
        let selecTdefault = {
          id: 0,
          name: 'Select Partner',
          productTable: 'CenturyLinkProducts',
          providers: [],
        };
        this.PARTNERS = res['hydra:member'];
        this.PARTNERS.unshift(selecTdefault);
      }
    });
  }

  setPartnerSelection() {
    // this.formData.partnerId =this.partner
    // this.catalog = [];
    // this.currentPage = 1;
    // this.isgRevenueService
    //   .getCatalogByPage(
    //     this.itemsPerPage,
    //     this.currentPage,
    //     this.currentPartnerId
    //   )
    //   .subscribe((res: any) => {
    //     if (res['hydra:member']) {
    //       this.catalog = res['hydra:member'];
    //       this.totalItems = res['hydra:totalItems'];
    //     }
    //   });
  }

  setClassTypeSelection() {
    this.formData.classType = this.class;
    this.displayApplyToClass = false;
    if (this.class.description == 'Video') {
      this.newProductService
        .getVideoClassType(this.class.id)
        .subscribe((res: any) => {
          this.FEATURES = res['hydra:member'].filter(
            (feature: any) => feature.name != ''
          );
        });
    } else if (this.class.description == 'Voice') {
      this.newProductService
        .getVoiceClassType(this.class.id)
        .subscribe((res: any) => {
          this.FEATURES = res['hydra:member'].filter(
            (feature: any) => feature.name != ''
          );
        });
    } else if (this.class.description == 'Internet') {
      this.newProductService
        .getInternetClassType(this.class.id)
        .subscribe((res: any) => {
          this.FEATURES = res['hydra:member'].filter(
            (feature: any) => feature.name != ''
          );
        });
    } else if (this.class.description == 'Tech') {
      this.newProductService
        .getTechClassType(this.class.id)
        .subscribe((res: any) => {
          this.FEATURES = res['hydra:member'].filter(
            (feature: any) => feature.name != ''
          );
        });
    } else if (this.class.description == 'Security') {
      this.newProductService
        .getSecurityClassType(this.class.id)
        .subscribe((res: any) => {
          this.FEATURES = res['hydra:member'].filter(
            (feature: any) => feature.name != ''
          );
        });
    } else if (this.class.description == 'Wireless') {
      this.newProductService
        .getWirelessClassType(this.class.id)
        .subscribe((res: any) => {
          this.FEATURES = res['hydra:member'].filter(
            (feature: any) => feature.name != ''
          );
        });
    } else {
      this.displayApplyToClass = true;
      this.newProductService
        .getFeatures(this.class.id)
        .subscribe((res: any) => {
          this.FEATURES = res['hydra:member'].filter(
            (feature: any) => feature.name != ''
          );
        });
    }
  }

  setFeaturesSelection() {
    this.SELECTED_FEATURES = [];
    this.feature.map((feature: any) => {
      this.SELECTED_FEATURES.push(feature);
    });
  }

  addManulFeature() {
    this.SELECTED_FEATURES.push({ id: 0, name: this.newFeatureManual });
  }

  setApplyToClass() {
    this.SELECTED_APPLY_TO_CLASS = [];
    this.applyToclass.map((applyToclass: any) => {
      this.SELECTED_APPLY_TO_CLASS.push(applyToclass);
    });
  }

  deleteFeatureFromList(index: number) {
    this.SELECTED_FEATURES.splice(index, 1);
  }
  deleteApplyToClass(index: number) {
    this.SELECTED_APPLY_TO_CLASS.splice(index, 1);
  }

  openProductDialog(productDetails: object) {
    this.displayProductDetails = true;
  }

  goBack() {
    this.router.navigate(['rev']);
  }

  // 🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰CALENDAR🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰

  _openCalendar(picker: MatDatepicker<Date>, direction: any) {
    // picker.close();
    // picker.open();
    // // rewrite autoclose after date is chosen
    // this.theTimePicker.close = () => { };
    // close calendar manually on outside click
    // this.cdkConnectedOverlay._attachedOverlays[0]._outsidePointerEvents.subscribe(
    //   () => {
    //     // restore saved close method
    //     // this.theTimePicker.close = this.selfClose;
    //     // this.selfClose = undefined;
    //     this.theTimePicker.close();
    //   }
    // );
  }

  onDateSelect(e: any) {
    console.log('date: ' + e.value);
    this.date = e.value;
  }

  _closeCalendar(picker: MatDatepicker<Date>) {
    picker.close();
  }

  setEndOfTheWorldDate() {
    this.formData.endDate = new Date('9999-12-31');
  }

  createProduct() {
    this.formData.applyToClassTypes =
      this.SELECTED_APPLY_TO_CLASS.length > 0
        ? this.SELECTED_APPLY_TO_CLASS.map((applyToClass: any) => {
            return applyToClass.id;
          })
        : [0];
    this.formData.features = this.SELECTED_FEATURES.map((feature: any) => {
      return feature.id;
    });
    this.formData.behavior = this.formData.behavior
      ? this.formData.behavior['@id']
      : this.formData.behavior;
    this.formData.partner = this.formData.partner
      ? this.formData.partner['@id']
      : this.formData.partner;
    this.formData.classType = this.formData.classType
      ? this.formData.classType['@id']
      : this.formData.classType;


    if (this.validateForm()) {
      this.newProductService
        .createProduct(this.formData)
        .subscribe((res: any) => {
          this._snackBar
            .open(
              this.formData.name + ' product was successfully save ',
              'OK',
              {
                duration: 4000,
                verticalPosition: 'top',
              }
            )
            .afterDismissed()
            .subscribe((action: any) => {
              this.router.navigate(['rev']);
            });
        });
    } else {
      this._snackBar.open('Please fill all fields', 'OK', {
        duration: 4000,
        verticalPosition: 'top',
      });
    }
  }

  // validate form
  validateForm() {
    let validation = true;
    Object.keys(this.formData).forEach((key) => {
      if (this.formData[key] === null || this.formData[key] ==='' && key !== 'applyToClassTypes' && key !== 'catalogId') {
        validation = false;
      }
    });
    return validation;
  }
}
