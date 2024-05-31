import { ComponentType, FC, ReactElement, ReactNode } from "react";
import { i18n as i18next } from "i18next";
import {
  ComponentTypeAndString,
  RouterManager,
  RouterOptions,
} from "./RouterManager";
import { define, observable } from "@formily/reactive";
import { get, merge, set } from "lodash-es";
import {
  AppComponent,
  BlankComponent,
  defaultAppComponents,
} from "./components";
import React from "react";
import { compose, normalizeContainer } from "./utils";
import { createRoot } from "react-dom/client";
import { AppSchemaComponentProvider } from "./AppSchemaComponentProvider";
import AntdAppProvider from "../css-variable/AntdAppProvider";
import { Link, NavLink, Navigate } from "react-router-dom";
import { PluginManager, PluginType } from "./PluginManager";
import { APIClientOptions } from "../sdk/APIClient";
import { APIClient } from "../api-client/APIClient";
import { APIClientProvider } from "../api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export type ComponentAndProps<T = any> = [ComponentType, T];
export interface ApplicationOptions {
  name?: string;
  publicPath?: string;
  pluginSettings?: Record<string, any>;
  i18n?: i18next;
  providers?: (ComponentType | ComponentAndProps)[];
  plugins?: PluginType[];
  //   plugins?: PluginType[];
  components?: Record<string, ComponentType>;
  scopes?: Record<string, any>;
  router?: RouterOptions;
  designable?: boolean;
  apiClient?: APIClientOptions | APIClient;
}

export class Application {
  public neme;
  public providers: ComponentAndProps[] = [];
  public notification;

  public scopes: Record<string, any> = {};
  public router: RouterManager;
  public components: Record<string, ComponentType<any> | any> = {
    ...defaultAppComponents,
  };
  public pluginManager: PluginManager;
  public i18n: i18next;
  public apiClient: APIClient;
  loading = true;
  maintained = false;
  maintaining = false;
  error = null;

  get pm() {
    return this.pluginManager;
  }

  constructor(protected options: ApplicationOptions = {}) {
    define(this, {
      // observable.ref 定义引用劫持响应式属性
      maintained: observable.ref,
      loading: observable.ref,
      maintaining: observable.ref,
      error: observable.ref,
    });
    this.scopes = merge(this.scopes, options.scopes);
    this.components = merge(this.components, options.components);
    this.apiClient =
      options.apiClient instanceof APIClient
        ? options.apiClient
        : new APIClient(options.apiClient);
    this.apiClient.app = this;
    // this.i18n = options.i18n || i18n;
    this.router = new RouterManager(options.router, this);
    this.pluginManager = new PluginManager(options.plugins, false, this);

    // 添加系统级别的Providers
    this.addDefaultProviders();
    this.addReactRouterComponents();
    this.addProviders(options.providers || []);
    this.addRoutes();
    this.neme = "app";
  }

  async load() {
    let loadFailed = false;

    try {
      this.loading = true;
      await this.pm.load();
    } catch (error) {
      loadFailed = true;

      const others = error?.response?.data?.error ||
        error?.response?.data?.errors?.[0] || { message: error?.message };
      this.error = {
        code: "LOAD_ERROR",
        ...others,
      };
      console.error(error, this.error);
    } finally {
      this.loading = false;
    }
  }

  getOptions() {
    return this.options;
  }
  getName() {
    return "appapp";
  }

  addProviders(providers: (ComponentType | [ComponentType, any])[]) {
    providers.forEach((provider) => {
      if (Array.isArray(provider)) {
        this.addProvider(provider[0], provider[1]);
      } else {
        this.addProvider(provider);
      }
    });
  }

  private addReactRouterComponents() {
    this.addComponents({
      Link,
      Navigate: Navigate as ComponentType,
      NavLink,
    });
  }

  private addRoutes() {
    this.router.add("not-found", {
      path: "*",
      Component: this.components["AppNotFound"],
    });
  }

  getComposeProviders() {
    const Providers = compose(...this.providers)(BlankComponent);
    Providers.displayName = "Providers";
    return Providers;
  }

  use<T = any>(component: ComponentType, props?: T) {
    return this.addProvider(component, props);
  }
  addProvider<T = any>(component: ComponentType, props?: T) {
    return this.providers.push([component, props]);
  }

  private addDefaultProviders() {
    this.use(QueryClientProvider, {
      client: new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
    });
    this.use(APIClientProvider, { apiClient: this.apiClient });
    /**
     * 初始化schema运行环境
     */
    /**
     *   this.use(GlobalThemeProvider);
    this.use(CSSVariableProvider);
     */
    this.use(AppSchemaComponentProvider, {
      designable: this.options.designable,
      appName: "appName",
      components: this.components,
      scope: this.scopes,
    });
    this.use(AntdAppProvider);
  }

  protected addComponent(component: ComponentType, name?: string) {
    const componentName = name || component.displayName || component.name;
    if (!componentName) {
      console.error(
        "Component must have a displayName or pass name as second argument"
      );
      return;
    }

    set(this.components, componentName, component);
  }

  addComponents(components: Record<string, ComponentType>) {
    Object.keys(components).forEach((name) => {
      this.addComponent(components[name], name);
    });
  }

  addScopes(scopes: Record<string, any>) {
    this.scopes = merge(this.scopes, scopes);
  }

  getRootComponent() {
    const Root: FC<{ children?: React.ReactNode }> = ({ children }) => (
      <AppComponent app={this}>{children}</AppComponent>
    );
    return Root;
  }

  getComponent<T = any>(
    Component: ComponentTypeAndString<T>,
    isShowError = true
  ): ComponentType<T> | undefined {
    const showError = (msg: string) => isShowError && console.error(msg);
    if (!Component) {
      showError(`getComponent called with ${Component}`);
      return;
    }

    // ClassComponent or FunctionComponent
    if (typeof Component === "function") return Component;

    // Component is a string, try to get it from this.components
    if (typeof Component === "string") {
      const res = get(this.components, Component) as ComponentType<T>;
      if (!res) {
        showError(`Component ${Component} not found`);
        return;
      }
      return res;
    }

    showError(`Component ${Component} should be a string or a React component`);
    return;
  }

  renderComponent<T extends {}>(
    Component: ComponentTypeAndString,
    props?: T,
    children?: ReactNode
  ): ReactElement {
    return React.createElement(this.getComponent(Component), props, children);
  }

  // 将应用实例挂载在一个容器元素中。
  mount(containerOrSelector: Element | ShadowRoot | string) {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const App = this.getRootComponent();
    const root = createRoot(container);
    root.render(<App />);
    return root;
  }
}
