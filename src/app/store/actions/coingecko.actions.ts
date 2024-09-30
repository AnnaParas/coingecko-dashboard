import { createAction, props } from '@ngrx/store';

export const loadCryptoCurrencyData = createAction(
  '[CoinGecko API] Load Crypto Currency Data',
  props<{ currency: string; perPage: number; page: number }>()
);

export const cryptoCurrencyDataSuccess = createAction(
  '[CoinGecko API] Load Crypto Currency Data Success',
  props<{ data: any[] }>()
);

export const cryptoCurrencyDataFailure = createAction(
  '[CoinGecko API] Load Crypto Currency Data Failure',
  props<{ error: any }>()
);
