import { useSelector as useReduxSelector } from 'react-redux';
import { RootReducer } from '../reducers';

const useSelector = <T>(
  selector: (state: RootReducer) => T,
  equalityFn?: (left: T, right: T) => boolean
) => useReduxSelector<RootReducer, T>(selector, equalityFn);
export default useSelector;
