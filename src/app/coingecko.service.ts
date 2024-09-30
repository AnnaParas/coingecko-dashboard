import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinGeckoService {
  private apiUrl = '/api/v3/coins/markets';

  constructor(private http: HttpClient) {}

  // Fetch market data with dynamic params
  getCryptoCurrencyData(
    currency: string = 'usd',
    perPage: number = 10,
    page: number = 1
  ): Observable<any> {
    const params = {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: perPage.toString(),
      page: page.toString(),
      sparkline: 'false',
    };

    return this.http.get<any>(this.apiUrl, { params });
  }
}
