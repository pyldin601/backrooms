// @flow
import { Observable, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, groupBy, map, mergeAll, scan, tap, filter, startWith } from 'rxjs/operators';

export type KeysStateInterface = {|
  ArrowLeft: boolean,
  ArrowRight: boolean,
  ArrowUp: boolean,
  ArrowDown: boolean,
|};

const initialKeysState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

const allowedKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

export function createKeysStream(): Observable<KeysStateInterface> {
  const downs$ = fromEvent(document, 'keydown');
  const ups$ = fromEvent(document, 'keyup');

  return merge(downs$, ups$).pipe(
    tap(event => event.preventDefault()),
    filter(event => allowedKeys.has(event.key)),
    groupBy(event => event.key),
    map(group => group.pipe(distinctUntilChanged(null, event => event.type))),
    mergeAll(),
    scan((acc, event) => ({ ...acc, [event.key]: event.type === 'keydown' })),
    startWith(initialKeysState),
  );
}
