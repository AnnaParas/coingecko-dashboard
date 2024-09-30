import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoinGeckoState } from '../state/coingecko.state';

export const selectCoinGeckoState =
  createFeatureSelector<CoinGeckoState>('coingecko');

export const selectData = createSelector(
  selectCoinGeckoState,
  (state) => state.data
);

export const selectLoading = createSelector(
  selectCoinGeckoState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectCoinGeckoState,
  (state) => state.error
);
