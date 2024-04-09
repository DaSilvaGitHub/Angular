import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges {
  @Input() searchText: string;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText'] && this.searchText) {
      this.highlightText(this.searchText);
    }
  }

  private highlightText(searchText: string) {
    const text = this.elementRef.nativeElement.innerText;
    const regex = new RegExp(`(${searchText})`, 'gi');
    const highlightedText = text.replace(regex, '<span class="highlighted">$1</span>');
    this.elementRef.nativeElement.innerHTML = highlightedText;
  }
}
