import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.less'],
})
export class UiButtonComponent implements OnInit {
  @Input('ui-button-secondary') uiButtonSecondary: string| boolean;
  @Input('ui-button-danger') uiButtonDanger: string | boolean;

  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {
    if (this.uiButtonSecondary === '') {
      this.uiButtonDanger = true;
    }
    if (this.uiButtonSecondary === '') {
      this.uiButtonDanger = true;
    }
  }
}
