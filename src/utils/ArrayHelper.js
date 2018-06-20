// @flow

import _flatten from "lodash/flatten";
import _map from "lodash/map";

// // Made because...
// // has an error as there is a double definition of _.flatMap.
// // One for an Array (defined first)
// // One for an Object (defined second, which stomps the first)
// flatMap<T, U>(
//   array?: ?$ReadOnlyArray<T>,
//   iteratee?: ?FlatMapIteratee<T, U>
// ): Array<U>;
// flatMap<T: Object, U>(
//   object: T,
//   iteratee?: OFlatMapIteratee<T, U>
// ): Array<U>;

let flatMap = function<T, U>(
  array: ?$ReadOnlyArray<T>,
  iteratee: (item: T, index: number, array: ?$ReadOnlyArray<T>) => Array<U>
): Array<U> {
  return _flatten(_map(array, iteratee));
};

export { flatMap };
