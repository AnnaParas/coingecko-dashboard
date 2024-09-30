import { Component, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromCoinGecko from './store/state/coingecko.state';
import * as CoinGeckoActions from './store/actions/coingecko.actions';
import {
  selectData,
  selectError,
  selectLoading,
} from './store/selectors/coingecko.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cryptoCurrencyData$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  private destroy$ = new Subject<void>(); // Subject for unsubscribing

  currentPage: number = 1;
  cryptoCurrencyDataError: any;
  totalPages: number = 25;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id',
    'name',
    'symbol',
    'current_price',
    'market_cap',
    'total_volume',
    'high_24h',
    'low_24h',
    'price_change_percentage_24h',
    'circulating_supply',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: 'Crypto Currency Market Capitalization',
    },
    xAxis: {
      categories: [],
    },
    series: [
      {
        type: 'line',
        data: [],
        name: 'Market Capitalization',
      },
    ],
  };

  constructor(
    private store: Store<{ coingecko: fromCoinGecko.CoinGeckoState }>
  ) {
    this.cryptoCurrencyData$ = store.select(selectData);
    this.loading$ = store.select(selectLoading);
    this.error$ = store.select(selectError);
  }

  ngOnInit(): void {
    this.loadCryptoCurrencyData();
    this.cryptoCurrencyData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataSource.data = data || []; // Retrieve the data from the api
        this.dataSource.paginator = this.paginator; // Attach paginator

        // Extract data for chart
        this.updateChartData(data);
      });

    // Listen for errors
    this.error$.subscribe((error) => {
      if (error) {
        console.error('Error fetching data:', error);
      }
    });
  }

  ngAfterViewInit() {
    // Listen for changes in the paginator
    this.paginator.page.subscribe(() => {
      this.handlePageChange();
    });
  }

  ngOnDestroy() {
    // Kill subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateChartData(data: any[]) {
    const categories = data.map((crypto) => crypto.name);
    const marketCapitalization = data.map((crypto) => crypto.market_cap);

    // Update the chart options
    this.chartOptions.xAxis = {
      categories: categories,
    };
    this.chartOptions.series = [
      {
        type: 'line',
        data: marketCapitalization,
        name: 'Market Capitalization',
      },
    ];

    // Trigger chart update
    Highcharts.chart('chartContainer', this.chartOptions);
  }

  loadCryptoCurrencyData(): void {
    this.store.dispatch(
      CoinGeckoActions.loadCryptoCurrencyData({
        currency: 'usd',
        perPage: 250,
        page: this.currentPage,
      })
    );
  }

  handlePageChange() {
    // This function is triggered when the paginator changes
    this.currentPage = this.paginator.pageIndex + 1;
    this.loadCryptoCurrencyData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.updateChartData(this.dataSource.filteredData);
  }
}
