import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsgRevenueService } from './service/isg-revenue.service';

@Component({
  selector: 'app-isg-revenue',
  templateUrl: './isg-revenue.component.html',
  styleUrls: ['./isg-revenue.component.scss'],
})
export class IsgRevenueComponent implements OnInit {


  dragRows = false;
  catalog: any = [];
  partnerId = 1;
  partnerName: any = null;

  PARTNERS: any;
  partner: any;
  formData!: any;
  selectedPartner: any | undefined;

  headers = null;
  loading = false;
  objErrors = {
    status: 0,
    message: null,
  };
  totalItems: any;
  workAroundCounter = 0;
  page = 0;
  currentPage = 1;
  itemsPerPage = 20;
  currentPartnerId = -1;
  pageNumbers = [1, 2, 3, 4, 5];
  pageRows = [5, 10, 15, 20, 30];
  displayProductDetails = false;

  revenue_Data = {
    "componentText": [
      {
        id: 'ID',
        applyToClassTypes: 'Type',
        name: 'Description',
        features: 'Features',
        revenue: 'Revenue',
        startDate: 'Start Date',
        endDate: 'End Date',
      },
    ],
    "componentSettings": [
      {
        "minRule": 0,
        "maxRule": 0,
        "fontSize": 14,
        "columnWidth": 150,
        "rationalewidth": 448,
        "rowHeight": 2,
        "radioColumnsWidth": 75,
        "CRITERIA": false,
        "categoryRulesPassed": false,
        "ratedCounter": 0,
        "categoryName": "REVENUE",
        "categoryDescription": "more info about this category",
        "ratingScaleTitle": "RATING"
      }
    ]
  }
  constructor(private isgRevenueService: IsgRevenueService, private router: Router,) { }
  ngOnInit() {
    this.getPartners();
    this.getCatalog();
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

  getCatalog() {
    this.catalog = [];
    this.isgRevenueService.getCatalog().subscribe((res: any) => {
      if (res['hydra:member']) {
        this.catalog = res['hydra:member'];
        this.totalItems = res['hydra:totalItems'];
        this.setTable(this.catalog)
        if (this.catalog.length = 0) {
          this.router.navigate(['./login'])
        }
      }
    });
  }



  searchKeyword(text: any) {
    this.isgRevenueService.searchbyNameFilter(this.itemsPerPage, this.currentPage, text.partner,text.searchKeyword).subscribe((res: any) => {
      console.log(res);
      this.catalog = res['hydra:member'];
      this.setTable(this.catalog)
    })
  }


  formatDate(date: string) {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [month, day, year].join('-');
  }

  setTable(table: any) {
    this.dragRows = true;
    this.revenue_Data.componentText = []
    table.forEach((element: any, index: number) => {
      this.revenue_Data.componentText.push({
        id: element.id,
        applyToClassTypes: element.applyToClassTypes,
        name: element.name,
        features: element.features,
        revenue: element.revenue,
        startDate: this.formatDate(element.startDate),
        endDate: this.formatDate(element.endDate),
      })
    })

    this.revenue_Data.componentText.unshift({
      id: 'ID',
      applyToClassTypes: 'Type',
      name: 'Description',
      features: 'Features',
      revenue: 'Revenue',
      startDate: 'Start Date',
      endDate: 'End Date',
    });

    setTimeout(() => {
      this.dragRows = false;
    }, 1000);
  }

  getCatalogByProvider(event: any) {
    this.catalog = [];
    this.currentPage = 1;
    this.currentPartnerId = event.id;
    this.isgRevenueService
      .getCatalogByPage(
        this.itemsPerPage,
        this.currentPage,
        this.currentPartnerId
      )
      .subscribe((res: any) => {
        if (res['hydra:member']) {
          this.catalog = res['hydra:member'];
          this.totalItems = res['hydra:totalItems'];
          this.setTable(this.catalog)

          if (this.totalItems < this.itemsPerPage) {
            this.pageNumbers = [1];
          } else if (this.totalItems > this.itemsPerPage) {
            this.pageNumbers = [];
            let numberOfpages = Math.ceil(this.totalItems / this.itemsPerPage);
            for (let index = 0; index < numberOfpages; index++) {
              if (index < 6) {
                this.pageNumbers.push(index + 1);
              }
            }
          }
        }
      });
  }

  editProduct(id: number) {
    if (!this.partnerId) { alert('Choose Partner'); return; }
    if (id) {
      this.router.navigate(
        ['product/edit/' + this.partnerId + '/' + id]
      );
    } else {
      this.router.navigate(
        ['product/new/' + this.partnerId]
      );
    }
  }

  viewProduct(id: number) {
    this.router.navigate(
      ['product/view/' + id]
    );
  }

  changePage(direction: string) {
    let numberOfpages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (direction === 'next' && numberOfpages > this.currentPage) {
      this.currentPage = this.currentPage + 1;
      this.pageNumbers = this.pageNumbers.map(
        (pageNUmber) => (pageNUmber = pageNUmber + 1)
      );
    } else if (direction === 'previous' && this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.pageNumbers = this.pageNumbers.map(
        (pageNUmber) => (pageNUmber = pageNUmber - 1)
      );
    }
    if (this.currentPage > 0) {
      this.isgRevenueService
        .getCatalogByPage(
          this.itemsPerPage,
          this.currentPage,
          this.currentPartnerId
        )
        .subscribe((res: any) => {
          if (res['hydra:member']) {
            this.catalog = res['hydra:member'];
            this.setTable(this.catalog)

          }
        });
    }
  }

  changePageRows(event: any) {
    this.currentPage = 1;
    this.pageNumbers = [1, 2, 3, 4, 5];
    this.isgRevenueService
      .getCatalogByPage(this.itemsPerPage, 1, this.currentPartnerId)
      .subscribe((res: any) => {
        if (res['hydra:member']) {
          this.catalog = res['hydra:member'];
          this.setTable(this.catalog)

        }
      });
  }

  selectPageNumber(pageNUmber: any, currentPage: any) {
    this.currentPage = currentPage;
    if (pageNUmber == this.pageNumbers.length) {
      // this.pageNumbers = [... this.pageNumbers +1]
      this.pageNumbers = this.pageNumbers.map(
        (pageNUmber) => (pageNUmber = pageNUmber + 5)
      );
    }
    this.isgRevenueService
      .getCatalogByPage(this.itemsPerPage, pageNUmber, this.currentPartnerId)
      .subscribe((res: any) => {
        if (res['hydra:member']) {
          this.catalog = res['hydra:member'];
          this.setTable(this.catalog)
        }
      });
  }

  openProductDialog(productDetails: object) {
    this.displayProductDetails = true;
  }

  togglePageItemsAmount() {
    if (this.itemsPerPage == 20) {
      this.itemsPerPage = 30;
    } else if (this.itemsPerPage == 30) {
      this.itemsPerPage = 10;
    } else if (this.itemsPerPage == 10) {
      this.itemsPerPage = 20;
    }
  }

  signOut(): void {
    window.localStorage.clear();
    this.router.navigate(['./login']);
  }
}
