import { Observable, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, groupBy, map, mergeAll, scan, tap, filter, startWith } from 'rxjs/operators';


const initialKeysState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  Alt: false,
  Shift: false,
};

const allowedKeys = new Set(Object.keys(initialKeysState));

export function createKeysStream() {
  const downs$ = fromEvent(document, 'keydown');
  const ups$ = fromEvent(document, 'keyup');

  return merge(downs$, ups$).pipe(
    filter(event => allowedKeys.has(event.key)),
    tap(event => event.preventDefault()),
    groupBy(event => event.key),
    map(group => group.pipe(distinctUntilChanged(null, event => event.type))),
    mergeAll(),
    scan((acc, event) => ({ ...acc, [event.key]: event.type === 'keydown' }), initialKeysState),
    startWith(initialKeysState),
  );
}
