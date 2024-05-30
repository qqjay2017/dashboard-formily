

import { ParseKeys, TOptions } from 'i18next';
import type { Application } from './Application';

export type TFuncKey = ParseKeys;

export class Plugin<T = any> {
  constructor(
    protected options: T,
    protected app: Application,
  ) {
    this.options = options;
    this.app = app;
  }

  get pluginManager() {
    return this.app.pluginManager;
  }

  get pm() {
    return this.app.pm;
  }

  get router() {
    return this.app.router;
  }




  get schemaSettingsManager() {
    return null
    // return this.app.schemaSettingsManager;
  }

  get dataSourceManager() {
    return null
    // return this.app.dataSourceManager;
  }

  async afterAdd() { }

  async beforeLoad() { }

  async load() { }

  t(text: ParseKeys | ParseKeys[], options: TOptions = {}) {
    return this.app.i18n.t(text, { ns: this.options?.['packageName'], ...(options as any) });
  }
}
