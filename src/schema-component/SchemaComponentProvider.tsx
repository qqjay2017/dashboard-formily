/**
 * SchemaComponent运行的必要环境
 * @returns
 */
import { createForm } from "@formily/core";
import { uid } from "@formily/shared";
import { FormProvider } from "@formily/react";
import { SchemaComponentProviderProps } from "./types";
import { useCallback, useContext, useMemo, useState } from "react";
import { SchemaComponentContext } from "./context";
import { SchemaComponentOptions } from "./SchemaComponentOptions";
import { DashboardComponentContext } from "../dashboard/context";
import { useSchemaOptionsContext } from "./hooks";
import { useUpdate } from "ahooks";

export const SchemaComponentProvider = (
  props: SchemaComponentProviderProps
) => {
  const { designable, onDesignableChange, components, children } = props;
  const ctx = useContext(SchemaComponentContext);
  const dcCtx = useContext(DashboardComponentContext);

  const ctxOptions = useSchemaOptionsContext();
  const refresh = useUpdate();
  const [formId, setFormId] = useState(uid());
  const form = useMemo(() => props.form || createForm(), [formId]);
  const resetForm = useCallback(() => {
    setFormId(uid());
  }, []);
  const scope = useMemo(() => {
    return { ...props.scope };
  }, [props.scope, ctxOptions?.scope]);

  const [active, setActive] = useState(designable);

  const designableValue = useMemo(() => {
    return typeof designable === "boolean" ? designable : active;
  }, [designable, active, ctx.designable]);

  const setDesignable = useMemo(() => {
    return (value) => {
      if (typeof designableValue !== "boolean") {
        setActive(value);
      }
      onDesignableChange?.(value);
    };
  }, [designableValue, onDesignableChange]);
  console.log(props, props.components, "props.components4");
  console.log(ctxOptions, "ctxOptions44444");

  return (
    <SchemaComponentContext.Provider
      value={{
        resetForm,
        scope,
        components,
        refresh,
        designable: designableValue,
        setDesignable,
      }}
    >
      <DashboardComponentContext.Provider
        value={{
          ...dcCtx,
          designable: props.designable,
        }}
      >
        <FormProvider form={form}>
          <SchemaComponentOptions
            inherit
            scope={props.scope}
            components={components}
          >
            {props.children}
          </SchemaComponentOptions>
        </FormProvider>
      </DashboardComponentContext.Provider>
    </SchemaComponentContext.Provider>
  );
};
