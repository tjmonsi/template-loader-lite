/**
 * # template-loader-lite
 *
 * `<template-loader-lite>`: A template loading device
 *
 * @extends {HTMLElement}
 * @customElement
*/

class TemplateLoaderLite extends window.HTMLElement {
  static get is () {
    return 'template-loader-lite';
  }
  
  static get observedAttributes () {
    return ['pattern'];
  }
  
  constructor () {
    super();
    this.__data = {};
    this.__patternInitialized = false;
  }
  
  connectedCallback () {
    this.__patternInitialized = true;
    if (this.pattern || this.getAttribute('pattern')) {
      this._patternChanged(this.pattern || this.getAttribute('pattern'));  
    }
  }
  
  set pattern (pattern) {
    this.__data.pattern = pattern;
    if (this.__patternInitialized) {
      this._patternChanged(pattern);
    }
  }

  get pattern () {
    return this.__data.pattern;
  }
  
  _patternChanged (pattern) {
    if (!pattern) return;
    const template = this.querySelector(`template[pattern=${pattern}]`);
    if (template) {
      this.template = template;
      Promise.resolve().then(() => {
        this.dispatchEvent(new window.CustomEvent('template-change', { detail: this.template }));
      });
    } else {
      console.warn(`There's no template available for pattern: `, pattern);
    }
  }
  
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'pattern' && this.__data.pattern !== newValue) {
      this.__data.pattern = newValue;
      this._patternChanged(newValue);
    }
  }
}

if (!window.customElements.get(TemplateLoaderLite.is)) {
  window.customElements.define(TemplateLoaderLite.is, TemplateLoaderLite);
} else {
  console.warn(`${TemplateLoaderLite.is} is already defined somewhere. Please check your code.`);
}