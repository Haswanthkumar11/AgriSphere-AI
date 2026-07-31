/**
 * Toast system — global notification without a library.
 * Usage: import { showToast } from '@utils/toast';
 *        showToast('Equipment booked!');
 */

let _addToast = null;

export function registerToastHandler(handler) {
  _addToast = handler;
}

export function showToast(message, duration = 2600) {
  if (_addToast) {
    _addToast({ message, duration, id: Date.now() });
  }
}
