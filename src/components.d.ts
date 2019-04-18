/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface NhsxEol {
    'questionnaire': any;
  }
  interface NhsxEolAttributes extends StencilHTMLAttributes {
    'questionnaire'?: any;
  }
}

declare global {
  interface StencilElementInterfaces {
    'NhsxEol': Components.NhsxEol;
  }

  interface StencilIntrinsicElements {
    'nhsx-eol': Components.NhsxEolAttributes;
  }


  interface HTMLNhsxEolElement extends Components.NhsxEol, HTMLStencilElement {}
  var HTMLNhsxEolElement: {
    prototype: HTMLNhsxEolElement;
    new (): HTMLNhsxEolElement;
  };

  interface HTMLElementTagNameMap {
    'nhsx-eol': HTMLNhsxEolElement
  }

  interface ElementTagNameMap {
    'nhsx-eol': HTMLNhsxEolElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}