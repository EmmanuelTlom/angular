import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatDatepickerModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

import { MglTimelineModule } from 'angular-mgl-timeline';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IsgRevenueComponent } from './isg-revenue/isg-revenue.component';
import { LoginComponent } from './isg-revenue/login/login.component';
import { TokeInterceptor } from './isg-revenue/service/toke.interceptor';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
// import { TableModule } from 'primeng/table';
import { TableComponent } from './isg-revenue/lib/table/table.component';
import { DragulaModule } from 'ng2-dragula';
import { HotkeyModule } from 'angular2-hotkeys';
import { NewProductComponent } from './isg-revenue/new-product/new-product.component';
import { SafePipe } from './isg-revenue/service/safe.pipe';
@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    IsgRevenueComponent,
    LoginComponent,
    TableComponent,
    NewProductComponent,
  ],
  imports: [
    HttpClientModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // VENDOR
    MglTimelineModule,
    DragulaModule,
    DragulaModule.forRoot(),
    HotkeyModule.forRoot(),
    //angulaar material
    MatSlideToggleModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatBadgeModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatGridListModule,
    MatSidenavModule,
    MatTableModule,
    MatSliderModule,
    MatTabsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatListModule,
    MatStepperModule,
    DragDropModule,
    FontAwesomeModule,

    // TableModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCd6ZBBD2iPkKQ1_fXN8WjJOTXdtzM1efM',
    }),
    AgmDirectionModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokeInterceptor,
      multi: true,
    }, { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 1000 } }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
