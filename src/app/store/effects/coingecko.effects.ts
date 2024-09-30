import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CoinGeckoActions from '../actions/coingecko.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CoinGeckoService } from '../../coingecko.service';

@Injectable()
export class CoinGeckoEffects {
  constructor(
    private actions$: Actions,
    private coingeckoService: CoinGeckoService
  ) {
    actions$ = inject(Actions);
  }

  loadCryptoCurrencyData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoinGeckoActions.loadCryptoCurrencyData),
      mergeMap((action) =>
        this.coingeckoService
          .getCryptoCurrencyData(action.currency, action.perPage, action.page)
          .pipe(
            map((data) => CoinGeckoActions.cryptoCurrencyDataSuccess({ data })),
            catchError((error) =>
              of(CoinGeckoActions.cryptoCurrencyDataFailure({ error }))
            )
          )
      )
    )
  );
}
