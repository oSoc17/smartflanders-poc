import { SmartflandersPocPage } from './app.po';

describe('smartflanders-poc App', () => {
  let page: SmartflandersPocPage;

  beforeEach(() => {
    page = new SmartflandersPocPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
