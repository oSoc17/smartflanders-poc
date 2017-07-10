import { browser, by, element } from 'protractor';

export class SmartflandersPocPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
