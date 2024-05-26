


/**
 * SchemaComponent运行的必要环境
 * @returns 
 */
import { createForm } from '@formily/core';
import { uid } from '@formily/shared';
import { FormProvider } from "@formily/react"
import { SchemaComponentProviderProps } from "./types"
import { useCallback, useContext, useMemo, useState } from "react";
import { SchemaComponentContext } from './context';
import { SchemaComponentOptions } from './SchemaComponentOptions';
import { DashboardComponentContext } from '../dashboard/context';

export const SchemaComponentProvider = (props: SchemaComponentProviderProps) => {
    const dcCtx = useContext(DashboardComponentContext)
    const [formId, setFormId] = useState(uid());
    const form = useMemo(() => props.form || createForm(), [formId]);
    const resetForm = useCallback(() => {
        setFormId(uid());
    }, []);
    return (
        <SchemaComponentContext.Provider value={{
            resetForm,

        }}>
            <DashboardComponentContext.Provider value={{
                ...dcCtx,
                designable: props.designable
            }}>
                <FormProvider form={form}>
                    <SchemaComponentOptions inherit scope={props.scope} components={props.components}>
                        {props.children}
                    </SchemaComponentOptions>
                </FormProvider>
            </DashboardComponentContext.Provider>
        </SchemaComponentContext.Provider>
    )
}
