import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { coingeckoReducer } from './coingecko.reducer';

export const reducers: ActionReducerMap<AppState> = {
  coingecko: coingeckoReducer,
};
