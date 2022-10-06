/**
 * Toaster Manager
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast';

export default class ToastManager {
  containerRef;
  toasts = [];
  static toast;

  constructor() {
    const body = document.getElementsByTagName('body')[0];
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container-main';
    body.insertAdjacentElement('beforeend', toastContainer);
    this.containerRef = toastContainer;
  }

  static getInstance() {
    if (!this.toast) {
      this.toast = new ToastManager();
    }
    return this.toast;
  }

  static show(options) {
    if (!options.type) options.type = 'default';
    ToastManager.getInstance().show(options);
  }

  static success(options) {
    options.type = 'success';
    ToastManager.getInstance().show(options);
  }

  static error(options) {
    options.type = 'error';
    ToastManager.getInstance().show(options);
  }

  static info(options) {
    options.type = 'info';
    ToastManager.getInstance().show(options);
  }

  static warning(options) {
    options.type = 'warning';
    ToastManager.getInstance().show(options);
  }

  static clear() {
    ToastManager.getInstance().clear();
  }

  show(options) {
    const toastId = Math.random().toString(36).substr(2, 9);
    const toast = {
      id: toastId,
      ...options,
      destroy: () => this.destroy(options.id ?? toastId),
    };

    this.toasts = [toast, ...this.toasts];
    this.render();
  }

  clear() {
    this.toasts = [];
    this.render();
  }

  destroy(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.render();
  }

  render() {
    const toastsList = this.toasts.map(toastProps => <Toast key={toastProps.id} {...toastProps} />);
    ReactDOM.render(toastsList, this.containerRef);
  }
}
