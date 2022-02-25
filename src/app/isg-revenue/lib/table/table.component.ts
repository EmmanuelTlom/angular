import {
  Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation,
} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DragulaService } from 'ng2-dragula';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { OverlayOutsideClickDispatcher } from '@angular/cdk/overlay';
import { NewProductService } from '../../service/new-product.service';
import { IsgRevenueService } from '../../service/isg-revenue.service';
import { debounceTime, distinctUntilChanged, filter, tap, throttleTime, } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() i: any = 1;
  @Input() bmxItem: any;
  @Input() dragRows: any;
  @Input() PARTNERS: any;
  @Input() currentPage: any;

  @Output() changePageRowsEmitter = new EventEmitter<any>();
  @Output() changePageEmitter = new EventEmitter<any>();
  @Output() getCatalogByProviderEmitter = new EventEmitter<any>();
  @Output() openProductDialogEmitter = new EventEmitter<any>();
  @Output() togglePageItemsAmountEmitter = new EventEmitter<any>();
  @Output() searchKeyword = new EventEmitter<any>();

  @ViewChild('searchBar')
  searchBar!: ElementRef;
  @ViewChild(MatDatepicker) public startDate: MatDatepicker<Date> | any;
  @ViewChild(MatDatepicker) public endDate: MatDatepicker<Date> | any;
  @ViewChild('autosize')
  autosize!: CdkTextareaAutosize;

  excel = faFileExcel;
  today: Date;
  MinDate = new Date();

  rankingScaleValue = 5;
  selectedRowCounter = 0;
  selectedIndex: any = '';
  displayInstructions = false;

  selectedStarRatingIndex = '';
  selectedRating: any;
  uploadImagesIcon = false;

  // CONFIGURATION VARIABLES
  testNamesInput!: string;
  TestNameDataModel!: any[];
  ratingScale = 5;
  TESTNAMES_LIST: any = [];
  columnsNames: any = [];
  columnsNamesHeader!: string[];
  listString!: string;
  tempItems = [];
  selectedColumn: any;
  ratingScaleIcon = 'grade';
  selectedCriteria: any;
  newCriteria = '';
  extraColumnCounter = 1;
  radioColumnCounter = 1;
  commentColumnCounter = 1;
  rankingType = 'dropDown';
  RadioColumnList: any = [];
  selectedCard: any;

  minRuleCounter = 0;
  maxRuleCounter = 0;
  deleteRows = false;

  isColumnResizerOn = false;
  editSingleTableCells = false;

  BAG = 'DRAGGABLE_ROW';
  subs = new Subscription();
  rowsCount = 10;

  HISTORY: any = [];
  RANGEARRAY = ['columnWidth1', 'columnWidth2', 'columnWidth3'];
  selectedNarrowDownTimer = 0;
  columnFontSize = 15;
  partner: any;
  soundVolume = 0.05;
  itemsPerPage = 20;
  settingUp = false;
  openRevenueEditBox = false;
  openDateExpireBox = false;
  rowToEdit: any;
  date: any;
  revenueChange: number = 0;
  displayProductDetails = false;
  FEATURES: any[] = [];

  expireObject = {
    endDate: "2022-02-09T09:43:23.747Z",
  }

  revenueObject = {
    revenue: 0,
    startDate: "2022-02-09T09:44:11.212Z",
    endDate: "12-30-9999",
  }
  revenueCatalogId: any;

  constructor(
    private _hotkeysService: HotkeysService,
    private cdkConnectedOverlay: OverlayOutsideClickDispatcher,
    private dragulaService: DragulaService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private newProductService: NewProductService,
    private isgRevenueService: IsgRevenueService
  ) {
    this.today = new Date();
    this._hotkeysService.add(
      new Hotkey(
        'right',
        (event: KeyboardEvent): boolean => {
          this.playSound(
            '03 Primary System Sounds/navigation_forward-selection-minimal.wav',
            this.soundVolume
          );
          this.changePage('next');
          return false;
        },
        undefined,
        'Move to next slide'
      )
    );

    this._hotkeysService.add(
      new Hotkey(
        'left',
        (event: KeyboardEvent): boolean => {
          this.playSound(
            '03 Primary System Sounds/navigation_backward-selection-minimal.wav',
            this.soundVolume
          );
          this.changePage('previous');
          return false;
        },
        undefined,
        'Move to previous slide'
      )
    );
  }
  ngOnInit(): void {
    let values = Object.keys(this.bmxItem.componentText[0]);

    values.forEach((value) => {
      if (typeof value == 'string' && value != 'STARS' && value != 'CRITERIA') {
        this.columnsNames.push(value);
      }
    });
    // this.columnsNames.push('RATE')

    if (this.bmxItem.componentSettings[0].CRITERIA) {
      this.bmxItem.componentText.forEach((item: any, index: any) => {
        if (index == 0) {
        }
      });
    }

    // this.deleteDuplicates(this.bmxItem.componentText, 'name')
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.searchBar.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(800),
        distinctUntilChanged(),
        tap((text:any) => {
          const container = {
            searchKeyword: this.searchBar.nativeElement.value,
            partner: (this.partner) ? this.partner.id : -1,
          }
         this.searchKeyword.emit(container)
        })
      )
      .subscribe();
  }

  maxRuleCounterMinus() {
    if (this.maxRuleCounter != 0) {
      this.maxRuleCounter--;
    }
    if (this.bmxItem.componentSettings[0].ratedCounter > 0) {
      this.bmxItem.componentSettings[0].ratedCounter--;
    }

    if (
      this.bmxItem.componentSettings[0].ratedCounter >=
      this.bmxItem.componentSettings[0].minRule
    ) {
      this.bmxItem.componentSettings[0].categoryRulesPassed = true;
    } else {
      this.bmxItem.componentSettings[0].categoryRulesPassed = false;
    }
  }
  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
  setRating(rate: { target: { checked: any } }, testNameId: string | number) {
    if (rate.target && this.bmxItem.componentType == 'narrow-down') {
      if (
        this.selectedRowCounter >= this.bmxItem.componentSettings[0].minRule &&
        !this.bmxItem.componentText[testNameId].SELECTED_ROW
      ) {
        this.selectedNarrowDownTimer = 4000;
        for (
          let index = 0;
          index < this.bmxItem.componentText.length;
          index++
        ) {
          // REMOVE FIRST CHECKED VALUE
          if (this.bmxItem.componentText[index].SELECTED_ROW) {
            // ASK BEFROE REMOVE IT
            this._snackBar
              .open(
                this.bmxItem.componentText[index].nameCandidates +
                ' was uncheck becuse you can only select up to ' +
                this.bmxItem.componentSettings[0].minRule +
                ' test names ',
                'OK',
                {
                  duration: 6000,
                  verticalPosition: 'top',
                }
              )
              .afterDismissed()
              .subscribe((action) => { });

            this.bmxItem.componentText[index].SELECTED_ROW = false;
            break;
          }
        }
      } else {
        if (this.bmxItem.componentText[testNameId]['CRITERIA']) {
          this.bmxItem.componentText[testNameId]['CRITERIA'].forEach(
            (criteria: { RATE: number }) => {
              criteria.RATE = 0;
            }
          );
        } else {
          this.bmxItem.componentText[testNameId]['RATE'] = 0;
        }
      }

      this.bmxItem.componentText[testNameId].SELECTED_ROW = rate.target.checked;
      this.selectedRowCounter = 0;
      for (let index = 0; index < this.bmxItem.componentText.length; index++) {
        if (this.bmxItem.componentText[index].SELECTED_ROW) {
          this.selectedRowCounter++;
        }
        //  else {
        //   // this.bmxItem.componentText[index].SELECTED_ROW = false
        // }
      }

      if (
        this.selectedRowCounter == this.bmxItem.componentSettings[0].minRule
      ) {
        this.bmxItem.componentSettings[0].categoryRulesPassed = true;
        setTimeout(() => {
          this._snackBar
            .open(
              'Great ' +
              this.bmxItem.componentSettings[0].minRule +
              ' test names were selected, now rate them',
              'OK',
              {
                duration: 6000,
                verticalPosition: 'bottom',
              }
            )
            .afterDismissed()
            .subscribe((action) => { });
        }, this.selectedNarrowDownTimer);
      }
    }
    if (this.bmxItem.componentType == 'ranking-scale') {
      this.bmxItem.componentText.forEach(
        (testnameRow: { RATE: any }, i: string | number) => {
          if (testnameRow.RATE == rate) {
            this.bmxItem.componentText[i].RATE = 0;
            // ASK BEFROE REMOVE IT
            // this._snackBar.open(testnameRow.nameCandidates + 'was already rank ' + rate, 'ok', {
            //   duration: 4000,
            //   verticalPosition: 'bottom',
            // })
          }
        }
      );
      this.bmxItem.componentText[testNameId].RATE = rate;
    } else {
      if (
        this.maxRuleCounter < this.bmxItem.componentSettings[0].maxRule ||
        this.bmxItem.componentSettings[0].maxRule == 0
      ) {
        if (this.bmxItem.componentSettings[0].maxRule > 0) {
          this.maxRuleCounter++;
        }
        this.bmxItem.componentText[testNameId].RATE = rate;
        this.bmxItem.componentSettings[0].ratedCounter++;
        if (
          this.bmxItem.componentSettings[0].ratedCounter >=
          this.bmxItem.componentSettings[0].minRule
        ) {
          this.bmxItem.componentSettings[0].categoryRulesPassed = true;
        } else {
          this.bmxItem.componentSettings[0].categoryRulesPassed = false;
        }
      } else {
        if (
          this.bmxItem.componentType != 'narrow-down' &&
          this.bmxItem.componentSettings[0].maxRule > 0
        ) {
          this._snackBar.open(
            'you can only rate up to ' +
            this.bmxItem.componentSettings[0].maxRule +
            ' Test Names',
            'OK',
            {
              duration: 5000,
              verticalPosition: 'top',
            }
          );
        }
      }
    }
  }

  selectStar(starId: number, testNameId: string | number): void {
    this.bmxItem.componentText[testNameId].STARS.filter(
      (star: { id: number; styleClass: string }) => {
        if (star.id <= starId) {
          star.styleClass =
            this.ratingScaleIcon === 'grade'
              ? 'active-rating-star'
              : 'active-rating-bar';
        } else {
          star.styleClass = 'rating-star';
        }
        return star;
      }
    );
  }

  leaveStar(testNameId: string | number): void {
    if (this.bmxItem.componentText[testNameId].CRITERIA) {
      this.bmxItem.componentText[testNameId].CRITERIA.forEach(
        (criteria: any, index: any) => {
          this.leaveCriteriaStar(testNameId, index);
        }
      );
    } else {
      this.selectedRating = this.bmxItem.componentText[testNameId].RATE;
      this.bmxItem.componentText[testNameId].STARS.filter(
        (star: { id: number; styleClass: string }) => {
          if (star.id <= this.selectedRating && this.selectedRating !== '') {
            star.styleClass =
              this.ratingScaleIcon === 'grade'
                ? 'active-rating-star'
                : 'active-rating-bar';
          } else {
            star.styleClass = 'rating-star';
          }
          return star;
        }
      );
    }
  }

  // CRITERIA STARS

  setCriteriaRating(
    starId: any,
    criteriaId: string | number,
    testNameId: string | number
  ) {
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE = starId;
  }

  selectCriteriaStar(
    starId: number,
    criteriaId: string | number,
    testNameId: string | number
  ): void {
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].STARS.filter(
      (star: { id: number; styleClass: string }) => {
        if (star.id <= starId) {
          star.styleClass =
            this.ratingScaleIcon === 'grade'
              ? 'active-rating-star'
              : 'active-rating-bar';
        } else {
          star.styleClass = 'rating-star';
        }
        return star;
      }
    );
  }

  leaveCriteriaStar(
    testNameId: string | number,
    criteriaId: string | number
  ): void {
    this.selectedRating =
      this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].RATE;
    this.bmxItem.componentText[testNameId].CRITERIA[criteriaId].STARS.filter(
      (star: { id: number; styleClass: string }) => {
        if (star.id <= this.selectedRating && this.selectedRating !== '') {
          star.styleClass =
            this.ratingScaleIcon === 'grade'
              ? 'active-rating-star'
              : 'active-rating-bar';
        } else {
          star.styleClass = 'rating-star';
        }
        return star;
      }
    );
  }

  createRatingStars(ratingScale: number, ratingScaleIcon: string) {
    let startCounter: any = [];
    for (let index = 1; index <= ratingScale; index++) {
      startCounter.push({
        id: index,
        icon: ratingScaleIcon,
        styleClass: 'rating-star',
      });
    }
    return startCounter;
  }
  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ END STARS METHODS  ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️

  upLoadNamesAndRationales(list: string) {
    this.uploadImagesIcon = true;
    this.recordHistory();
    this.dragRows = true;
    if (!list) {
      list = this.listString;
    }
    if (list) {
      this.listString = list;
      const rows = list.split('\n');
      this.columnsNames = [];
      this.columnsNames = rows[0].toLowerCase().split('\t');

      let nameCandidatesCounter = 0;
      this.extraColumnCounter = 1;

      // COLUMNS NAMES CHECK
      this.columnsNames.forEach((column: string, index: string | number) => {
        column = column.toLowerCase();
        if (
          (nameCandidatesCounter == 0 && column.includes('candidates')) ||
          column == 'questions'
        ) {
          this.columnsNames[index] = 'nameCandidates';
          nameCandidatesCounter++;
        } else if (
          column == 'name rationale' ||
          column == 'rationale' ||
          column == 'rationales'
        ) {
          this.columnsNames[index] = 'rationale';
        } else if (column == 'katakana') {
          this.columnsNames[index] = 'katakana';
        } else {
          this.columnsNames[index] = 'ExtraColumn' + this.extraColumnCounter;
          this.extraColumnCounter++;
        }
      });

      this.TESTNAMES_LIST = [];
      this.autoSizeColumns('RATE', '', this.rankingScaleValue);
      // TEST NAMES CHECK
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != '' && rows[i].length > 6) {
          let objectColumnDesign: any = {};
          if (this.ASSIGNED_CRITERIA.length > 0) {
            // CRITERIA
            this.bmxItem.componentSettings[0].CRITERIA = true;
            this.bmxItem.componentSettings[0].rateWidth =
              this.bmxItem.componentSettings[0].rateWidth < 220
                ? 220
                : this.bmxItem.componentSettings[0].rateWidth;
            for (let e = 0; e < this.columnsNames.length; e++) {
              if (rows[i].split('\t').length > 0) {
                const columnName = this.columnsNames[e];
                const columnValue = rows[i].split('\t')[e].trim();
                objectColumnDesign[columnName] = columnValue;
                if (i == 0) {
                  objectColumnDesign['RATE'] = 'RATE';
                }
                if (i != 0) {
                  this.autoSizeColumns(columnName, columnValue);
                }
              }
            }
            objectColumnDesign['CRITERIA'] = [];
            this.ASSIGNED_CRITERIA.forEach((criteria: any) => {
              objectColumnDesign['CRITERIA'].push({
                name: criteria.name,
                STARS: this.createRatingStars(
                  this.rankingScaleValue,
                  this.ratingScaleIcon
                ),
                RATE: -1,
              });
            });
          } else {
            this.bmxItem.componentSettings[0].CRITERIA = false;
            objectColumnDesign['STARS'] = this.createRatingStars(
              this.rankingScaleValue,
              this.ratingScaleIcon
            );
            for (let e = 0; e < this.columnsNames.length; e++) {
              if (rows[i].split('\t').length > 0) {
                const columnName = this.columnsNames[e];
                const columnValue = rows[i].split('\t')[e].trim();
                objectColumnDesign[columnName] = columnValue;
                if (i != 0) {
                  this.autoSizeColumns(columnName, columnValue);
                }
              }
            }
            objectColumnDesign['RATE'] = i > 0 ? -1 : 'RATE';
          }
          this.TESTNAMES_LIST.push(objectColumnDesign);
        }
      }
      this.bmxItem.componentText = this.deleteDuplicates(
        this.TESTNAMES_LIST,
        'nameCandidates'
      );
      this.columnsNames.push('RATE');
    } else {
      this.autoSizeColumns('RATE', '', this.rankingScaleValue);
      if (this.ASSIGNED_CRITERIA.length > 0) {
        this.bmxItem.componentSettings[0].CRITERIA = true;
        this.bmxItem.componentText.forEach(
          (row: { [x: string]: any; CRITERIA: any[] }, index: number) => {
            let CRITERIA: { name: any; STARS: any; RATE: string | number }[] =
              [];
            this.ASSIGNED_CRITERIA.forEach((criteria: any) => {
              CRITERIA.push({
                name: criteria.name,
                STARS: this.createRatingStars(
                  this.rankingScaleValue,
                  this.ratingScaleIcon
                ),
                RATE: index > 0 ? -1 : 'RATE',
              });
            });
            row.CRITERIA = CRITERIA;
            delete row["'STARS'"];
          }
        );
      } else {
        this.bmxItem.componentSettings[0].CRITERIA = false;
        this.bmxItem.componentText.forEach(
          (
            row: { [x: string]: any; STARS: any; RATE: string | number },
            index: number
          ) => {
            row.STARS = this.createRatingStars(
              this.rankingScaleValue,
              this.ratingScaleIcon
            );
            (row.RATE = index > 0 ? -1 : 'RATE'), delete row['CRITERIA'];
            // this.leaveStar(index);
          }
        );
      }
    }
    setTimeout(() => {
      this.dragRows = false;
    }, 1000);

    // this.swapColumns(0)
  }

  // delete row diplicates from array of object by property
  deleteDuplicates(array: any[], property: string) {
    let newArray: any = [];
    let lookupObject: any = {};

    for (let i in array) {
      lookupObject[array[i][property]] = array[i];
    }

    for (let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }

    if (array.length > newArray.length) {
      const unionMinusInter = this.unionMinusIntersection(array, newArray);
      const nameCandidates = this.spreadArray(unionMinusInter);
      this._snackBar.open(
        `You have  ${array.length - newArray.length
        } duplicates removed: "${nameCandidates.join(', ')}" 🍕`,
        'OK',
        {
          duration: 10000,
          verticalPosition: 'top',
        }
      );
    }
    return newArray;
  }
  // remove objects from array1 that are also in array2
  unionMinusIntersection(array1: any[], array2: string | any[]) {
    let union = array1.concat(array2);
    let intersection = array1.filter((x: any) => array2.includes(x));
    let unionMinusInter = union.filter((x: any) => !intersection.includes(x));
    return unionMinusInter;
  }
  //  spread array of object to array of string by property
  spreadArray(array: any[]) {
    let newArray: any[] = [];
    array.forEach((element: { nameCandidates: any }) => {
      newArray.push(element.nameCandidates);
    });
    return newArray;
  }

  autoSizeColumns(
    columnName: string,
    testName: string | any[],
    rankingValue?: number | undefined
  ) {
    let testNameLength = testName.length;
    if (columnName == 'nameCandidates') {
      if (
        testNameLength > 10 &&
        this.bmxItem.componentSettings[0].nameCandidatesWidth < 150
      ) {
        this.bmxItem.componentSettings[0].nameCandidatesWidth = 150;
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].nameCandidatesWidth = 175;
      }
    } else if (columnName == 'rationale') {
      if (
        testNameLength > 10 &&
        this.bmxItem.componentSettings[0].rationalewidth < 150
      ) {
        this.bmxItem.componentSettings[0].rationalewidth = 150;
      } else if (testNameLength > 15) {
        this.bmxItem.componentSettings[0].rationalewidth = 300;
      }
    } else if (columnName == 'RATE') {
      if (rankingValue == 5) {
        this.bmxItem.componentSettings[0].rateWidth = 155;
      } else if (rankingValue == 6) {
        this.bmxItem.componentSettings[0].rateWidth = 165;
      } else if (rankingValue == 7) {
        this.bmxItem.componentSettings[0].rateWidth = 185;
      } else if (rankingValue == 8) {
        this.bmxItem.componentSettings[0].rateWidth = 205;
      } else if (rankingValue == 9) {
        this.bmxItem.componentSettings[0].rateWidth = 225;
      } else if (rankingValue == 10) {
        this.bmxItem.componentSettings[0].rateWidth = 245;
      }
    } else if (columnName == 'ExtraColumn1') {
      if (
        testNameLength > 10 &&
        this.bmxItem.componentSettings[0].columnWidth < 150
      ) {
        this.bmxItem.componentSettings[0].columnWidth = 150;
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].columnWidth = 175;
      }
    } else if (columnName == 'ExtraColumn2') {
      if (
        testNameLength > 10 &&
        this.bmxItem.componentSettings[0].columnWidth < 150
      ) {
        this.bmxItem.componentSettings[0].columnWidth = 150;
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].columnWidth = 175;
      }
    } else {
      if (
        testNameLength > 10 &&
        this.bmxItem.componentSettings[0].columnWidth < 150
      ) {
        this.bmxItem.componentSettings[0].columnWidth = 150;
      } else if (testNameLength > 13) {
        this.bmxItem.componentSettings[0].columnWidth = 175;
      }
    }
  }

  // COLUMNS ADD AND REMOVE
  insertTextColumn() {
    this.recordHistory();
    this.columnsNames.push('ExtraColumn' + this.extraColumnCounter);
    this.bmxItem.componentText.forEach((object: { [x: string]: string }) => {
      let coulmnName = 'ExtraColumn' + this.extraColumnCounter;
      object[coulmnName] = 'Text Column';
    });
    this.extraColumnCounter++;
  }

  insertCommentBoxColumn() {
    this.recordHistory();
    this.columnsNames.forEach((columnName: any) => {
      if (columnName.includes('Comments')) {
        this.commentColumnCounter++;
        // this.RadioColumnList.push('RadioColumn' + this.commentColumnCounter)
      }
    });
    this.columnsNames.push('Comments' + this.commentColumnCounter);
    this.bmxItem.componentText.forEach(
      (object: { [x: string]: string }, index: number) => {
        let coulmnName = 'Comments' + this.commentColumnCounter;
        if (index > 0) {
          object[coulmnName] = '';
        } else {
          object[coulmnName] = 'General Comments';
        }
      }
    );
    this.commentColumnCounter++;
  }

  insertRadioColumn() {
    this.recordHistory();
    this.columnsNames.push('RadioColumn' + this.radioColumnCounter);
    this.bmxItem.componentText.forEach((object: any, index: number) => {
      let coulmnName: any = 'RadioColumn' + this.radioColumnCounter;
      if (index == 0) {
        object[coulmnName] = this.radioColumnCounter;
      } else {
        object[coulmnName] = false;
      }
    });
    this.radioColumnCounter++;
  }

  columnFontSizeAdjust(columnName: any, direction: string) {
    if (
      !columnName.includes('RATE') &&
      !columnName.includes('RadioColumn') &&
      !columnName.includes('Comments')
    ) {
      if (direction == 'increase') {
        this.columnFontSize += 1;
      } else {
        this.columnFontSize -= 1;
      }
      this.bmxItem.componentText.forEach(
        (row: { [x: string]: string }, index: number) => {
          if (index > 0) {
            var regex = /(<([^>]+)>)/gi;
            row[columnName] = row[columnName].replace(regex, '');
            row[columnName] =
              '<span ' +
              'style="font-size:' +
              this.columnFontSize +
              'px">' +
              row[columnName] +
              '</span>';
          }
        }
      );
    }
  }

  saveRadioColumValue(name: string | number, y: string | number) {
    this.RadioColumnList = [];
    let values = Object.keys(this.bmxItem.componentText[y]);
    values.forEach((columnName: any) => {
      if (columnName.includes('RadioColumn')) {
        this.bmxItem.componentText[y][columnName] = false;
      }

      if (columnName.includes('RadioColumn')) {
        this.RadioColumnList.push(columnName);
      }
    });
    this.bmxItem.componentText[y][name] = !this.bmxItem.componentText[y][name];
    this.RadioColumnList.forEach((columnName: any, index: any) => {
      // if (columnName.includes('RadioColumn')) {
      if (this.bmxItem.componentText[y][columnName]) {
        if (this.bmxItem.componentType == 'ranking-scale' || true) {
          this.bmxItem.componentText.forEach(
            (element: { RATE: number }, i: string | number) => {
              if (element.RATE == index + 1) {
                this.bmxItem.componentText[i].RATE = 0;
                this.RadioColumnList.forEach((radioColumnName: any) => {
                  this.bmxItem.componentText[i][radioColumnName] = false;
                });
              }
            }
          );
        }
        this.bmxItem.componentText[y].RATE = index + 1;
      }
      // }
    });
  }

  deletRow(option: any): void {
    if (confirm('Are you sure you want to delete this row?')) {
      this.recordHistory();
      this.bmxItem.componentText.splice(option, 1);
    }
  }

  insertRow(): void {
    this.recordHistory();
    const newRow = Object.assign({}, this.bmxItem.componentText[0]);
    this.bmxItem.componentText.push(newRow);
  }

  swapColumns(index: string | number): void {
    this.recordHistory();
    let temp = this.columnsNames[index];
    // update columnsNames array order
    for (let i: any = index; i < this.columnsNames.length - 1; i++) {
      this.columnsNames[i] = this.columnsNames[i + 1];
    }
    this.columnsNames[this.columnsNames.length - 1] = temp;
    let newRow: any = {};
    // re-order brand matrix columns
    this.bmxItem.componentText.forEach(
      (row: { [x: string]: any }, rowIndex: string | number) => {
        for (let i = 0; i < this.columnsNames.length - 1; i++) {
          Object.keys(row).forEach((key) => {
            if (this.columnsNames[i] == key) {
              newRow[key] = row[key];
            }
          });
        }
        this.bmxItem.componentText[rowIndex] = this.mergeObjects(newRow, row);
      }
    );
  }

  mergeObjects(obj1: { [x: string]: any }, obj2: { [x: string]: any }) {
    let obj3: any = {};
    for (let attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (let attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  }

  deleteColumn(columnName: string) {
    if (confirm('Are you sure you want to delete ' + columnName + ' column?')) {
      this.recordHistory();
      let temporary: any[] = [];
      // REMOVE THE COLUMN FROM THE COLUMNS
      this.columnsNames.forEach((element: string | string[], index: any) => {
        if (element !== columnName) {
          temporary.push(element);
          if (element.includes('Comments')) {
            // this.RadioColumnList['RadioColumn' + this.commentColumnCounter] = undefined
            this.commentColumnCounter--;
          }
        }
      });
      this.columnsNames = temporary;
      this.bmxItem.componentText.forEach(
        (object: any, index: string | number) => {
          delete this.bmxItem.componentText[index][columnName];
        }
      );
      this.bmxItem.componentText = this.bmxItem.componentText;
    }
  }

  criteriaSelection(selectedCriteria: never[]) {
    this.ASSIGNED_CRITERIA = selectedCriteria;
  }

  addCriteria(newCriteria: string | any[]) {
    if (newCriteria.length > 0) {
      this.CRITERIA.unshift({ name: newCriteria });
    }
  }

  deleteCriteria(index: number) {
    if (confirm('Are you sure you want to delete criteria?')) {
      this.CRITERIA.splice(index, 1);
    }
  }

  checkDragEvetn(e: any) {
    // console.log(e);
  }

  toogleColumnResizer() {
    this.isColumnResizerOn = !this.isColumnResizerOn;
  }

  onPaste() {
    setTimeout(() => {
      let rows = this.testNamesInput.split('\n');
      this.rowsCount = rows.length - 1;
    }, 1000);
  }

  recordHistory() {
    const history: any = JSON.parse(JSON.stringify(this.bmxItem));
    const columsNames = JSON.parse(JSON.stringify(this.columnsNames));
    this.HISTORY.push([history, columsNames]);
  }

  undo() {
    if (confirm('Are you sure you want undo last change?')) {
      if (this.HISTORY.length > 0) {
        this.dragRows = true;
        const temp: any = this.HISTORY.pop();
        Object.assign(this.bmxItem, temp[0]);
        // Object.assign(this.columnsNames, temp[1])
        this.columnsNames = temp[1];
        setTimeout(() => {
          this.dragRows = false;
        }, 1000);
      }
    }
  }
  // ISG PROGRAMMING MEHTODS
  changePage(direction: string) {
    if (direction == 'next') {
      this.playSound(
        '03 Primary System Sounds/navigation_forward-selection-minimal.wav',
        this.soundVolume
      );
    } else {
      this.playSound(
        '03 Primary System Sounds/navigation_backward-selection-minimal.wav',
        this.soundVolume
      );
    }
    this.changePageEmitter.emit(direction);
  }

  changePageRows() {
    this.changePageRowsEmitter.emit(0);
  }

  getCatalogByProvider(provider: string) {
    this.getCatalogByProviderEmitter.emit(provider);
  }

  playSound(soundEffect: string, volume: number) {
    let audio = new Audio();
    audio.src = 'assets/sound/wav/' + soundEffect;
    audio.volume = volume;
    audio.load();
    audio.play();
  }

  openProductDialog(rows: any, columnName: any, e?: any) {
    let params = {
      rows: rows,
      columnName: columnName,
      columnsNames: this.columnsNames,
      bmxItem: this.bmxItem,
    };
    this.openDateExpireBox = false
    this.openRevenueEditBox = false
    this.displayProductDetails = true
    this.rowToEdit = rows;
    this.FEATURES = []

    rows.features.forEach((featureId: any) => {
      if (featureId > 999) {
        if (featureId > 999 && featureId < 2000) {
          this.newProductService.getVideoClassTypeByReferenceId(featureId).subscribe((res: any) => {
            this.FEATURES.push(res)
          })
        }
        else if (featureId > 1999 && featureId < 3000) {
          this.newProductService.getVoiceClassTypeByReferenceId(featureId).subscribe((res: any) => {
            this.FEATURES.push(res)
          })
        }
        else if (featureId > 2999 && featureId < 4000) {
          this.newProductService.getInternetClassTypeByReferenceId(featureId).subscribe((res: any) => {
            this.FEATURES.push(res)
          })
        }
        else if (featureId > 3999 && featureId < 5000) {
          this.newProductService.getTechClassTypeByReferenceId(featureId).subscribe((res: any) => {
            this.FEATURES.push(res)
          })
        }
        else if (featureId > 4999 && featureId < 6000) {
          this.newProductService.getSecurityClassTypeByReferenceId(featureId).subscribe((res: any) => {
            this.FEATURES.push(res)
          })
        }
        else if (featureId > 5999 && featureId < 7000) {
          this.newProductService.getWirelessClassTypeByReferenceId(featureId).subscribe((res: any) => {
            this.FEATURES.push(res)
          })
        } else {

        }
      } else {
        this.newProductService.getFeaturesByReferenceId(featureId).subscribe((res: any) => {
          this.FEATURES.push(res)
        })

      }

      console.log(this.FEATURES);

    })

  }

  togglePageItemsAmount() {
    if (this.itemsPerPage == 20) {
      this.itemsPerPage = 30;
    } else if (this.itemsPerPage == 30) {
      this.itemsPerPage = 10;
    } else if (this.itemsPerPage == 10) {
      this.itemsPerPage = 20;
    }
    this.togglePageItemsAmountEmitter.emit();
  }

  newProduct() {
    this.router.navigate(['./new']);
  }

  updateRevenue() {
    this.revenueObject.endDate = this.revenueObject.startDate
    this.isgRevenueService.updateRevenue(this.revenueObject, this.revenueCatalogId).subscribe((res: any) => {
      confirm('Revenue Updated')
    })
  }

  updateExpiration() {
    this.isgRevenueService.updateExpiration(this.expireObject, this.revenueCatalogId).subscribe((res: any) => {
      confirm('Expiration date updated')

    })
  }

  // MODAL BOXES TO EDIT REVENUE AND ADD EXPIRED DATE
  openModalRevenueOrEndDateBox(columnName: any, row: any) {
    if (columnName == 'features') {
      this.openProductDialog(row, columnName)

    } else {

      (columnName == 'revenue') ? (this.openRevenueEditBox = true, this.openDateExpireBox = false) : (this.openDateExpireBox = true, this.openRevenueEditBox = false);
      this.displayProductDetails = false
      this.rowToEdit = row;
      this.revenueObject.revenue = row.revenue
      this.revenueChange = this.rowToEdit.revenue;
    }

    this.revenueCatalogId = row.id;
  }

  // 🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰CALENDAR🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰🎰

  _openCalendar(picker: MatDatepicker<Date>, type: any) {

  }

  onDateSelect(e: any, type: any) {
    this.date = e.value;
    console.log('date: ' + e.value);
    if (type == 'startDate') {
      this.revenueObject = {
        revenue: this.revenueChange,
        startDate: this.date,
        endDate: "12-30-9999",
      }

    } else if (type == 'endDate') {
      this.expireObject = {
        endDate: this.date
      }
    }

  }

  _closeCalendar(picker: MatDatepicker<Date>) {
    picker.close();
  }

  ASSIGNED_CRITERIA = [];
  CRITERIA: any = [
    { name: 'Fit to Compound Concept' },
    { name: 'Fit to Corporate Mission' },
    { name: 'Overall Likeability' },
  ];
}
