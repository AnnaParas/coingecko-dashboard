import { createReducer, on } from '@ngrx/store';
import * as CoinGeckoActions from '../actions/coingecko.actions';
import { CoinGeckoState } from '../state/coingecko.state';

export const initialState: CoinGeckoState = {
  data: [],
  loading: false,
  error: null,
};

export const coingeckoReducer = createReducer(
  initialState,
  on(CoinGeckoActions.loadCryptoCurrencyData, (state) => ({
    ...state,
    loading: true,
  })),
  on(CoinGeckoActions.cryptoCurrencyDataSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    data,
  })),
  on(CoinGeckoActions.cryptoCurrencyDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
