import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  Input,
  OnInit,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { TranslatedElementDirective } from './translated-element.directive';

interface TranslationData {
  elements: TranslatedElementDirective[];
  rawTranslation: string;
}

const TOKEN_START_DEMARC = '{{';
const TOKEN_END_DEMARC = '}}';

// adapted from @kasperlauge's solution in https://github.com/ngx-translate/core/issues/223
@Directive({
  selector: '[appTranslatedContent]',
})
export class TranslatedContentDirective implements OnInit, OnDestroy, AfterContentInit {
  @Input('appTranslatedContent') translationKey: string;
  @ContentChildren(TranslatedElementDirective)

  private elements: QueryList<TranslatedElementDirective>;
  private subscriptions: Subscription[] = [];
  private rawTranslation: Observable<string>;
  private translationData: Observable<TranslationData>;

  /**
   * Constructor of the class.
   *
   * @param {ViewContainerRef}  viewRef
   * @param {Renderer2}         renderer
   * @param {TranslateService}  translateService
   * @param {ChangeDetectorRef} changeDetectorRef
   */
  public constructor(
    private viewRef: ViewContainerRef,
    private renderer: Renderer2,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  /**
   * A lifecycle hook that is called after Angular has initialized
   * all data-bound properties of a directive.
   */
  public ngOnInit(): void {
    this.rawTranslation = this.translateService.get(this.translationKey);
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Use for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * A callback method that is invoked immediately after Angular has completed
   * initialization of all of the directive's content.
   *
   * It is invoked only once when the directive is instantiated.
   */
  public ngAfterContentInit(): void {
    // QueryList.changes doesn't re-emit after its initial value, which we have by now
    // BehaviorSubjects re-emit their initial value on subscription, so we get what we need by merging
    // the BehaviorSubject and the QueryList.changes observable
    const elementsSubject = new BehaviorSubject(this.elements.toArray());
    const elementsChanges = merge(elementsSubject, this.elements.changes);

    this.translationData = combineLatest(this.rawTranslation, elementsChanges)
      .pipe(map(([rawTranslation]) => ({
        elements: this.elements.toArray(),
        rawTranslation,
      })));

    this.subscriptions.push(this.translationData.subscribe(this.render.bind(this)));
  }

  /**
   * Method to render translated content.
   *
   * @param {TranslationData} translationData
   */
  private render(translationData: TranslationData): void {
    if (!translationData.rawTranslation || translationData.rawTranslation === this.translationKey) {
      throw new Error(`No resource matching the key '${this.translationKey}'`);
    }

    this.viewRef.clear();

    let lastTokenEnd = 0;

    while (lastTokenEnd < translationData.rawTranslation.length) {
      const tokenStartDemarc = translationData.rawTranslation.indexOf(TOKEN_START_DEMARC, lastTokenEnd);

      if (tokenStartDemarc < 0) {
        break;
      }

      const tokenStart = tokenStartDemarc + TOKEN_START_DEMARC.length;
      const tokenEnd = translationData.rawTranslation.indexOf(TOKEN_END_DEMARC, tokenStart);

      if (tokenEnd < 0) {
        throw new Error(`Encountered unterminated token in translation string '${this.translationKey}'`);
      }

      const tokenEndDemarc = tokenEnd + TOKEN_END_DEMARC.length;

      const precedingText = translationData.rawTranslation.substring(lastTokenEnd, tokenStartDemarc);
      const precedingTextElement = this.renderer.createText(precedingText);

      this.renderer.appendChild(this.viewRef.element.nativeElement, precedingTextElement);

      const elementKey = translationData.rawTranslation.substring(tokenStart, tokenEnd);
      const embeddedElementTemplate = translationData.elements.find(element => element.elementKey === elementKey);

      if (embeddedElementTemplate) {
        const embeddedElementView = embeddedElementTemplate.viewRef.createEmbeddedView(embeddedElementTemplate.templateRef);

        this.renderer.appendChild(this.viewRef.element.nativeElement, embeddedElementView.rootNodes[0]);
      } else {
        const missingTokenText = translationData.rawTranslation.substring(tokenStartDemarc, tokenEndDemarc);
        const missingTokenElement = this.renderer.createText(missingTokenText);

        this.renderer.appendChild(this.viewRef.element.nativeElement, missingTokenElement);
      }

      lastTokenEnd = tokenEndDemarc;
    }

    const trailingText = translationData.rawTranslation.substring(lastTokenEnd);
    const trailingTextElement = this.renderer.createText(trailingText);

    this.renderer.appendChild(this.viewRef.element.nativeElement, trailingTextElement);

    // in case the rendering happens outside of a change detection event, this ensures that any translations in the
    // embedded elements are rendered
    this.changeDetectorRef.detectChanges();
  }
}
