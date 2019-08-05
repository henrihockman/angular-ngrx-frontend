import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTranslatedElement]',
})

export class TranslatedElementDirective {
  @Input('appTranslatedElement')

  public elementKey: string;

  /**
   * Constructor of the class.
   *
   * @param {ViewContainerRef} viewRef
   * @param {TemplateRef<any>} templateRef
   */
  constructor(public readonly viewRef: ViewContainerRef, public readonly templateRef: TemplateRef<any>) { }
}
