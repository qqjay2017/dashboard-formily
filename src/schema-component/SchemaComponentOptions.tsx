import { memo, useMemo } from "react";
import { useSchemaOptionsContext } from "./hooks";
import { ExpressionScope, SchemaComponentsContext, SchemaOptionsContext } from "@formily/react";
import { SchemaComponentOptionsProps } from "./types";

export const SchemaComponentOptions: React.FC<SchemaComponentOptionsProps> = memo((props) => {
    const { children } = props;
    const options = useSchemaOptionsContext();
    const components = useMemo(() => {
        return { ...options.components, ...props.components };
    }, [options.components, props.components]);

    const scope = useMemo(() => {
        return { ...options.scope, ...props.scope };
    }, [options.scope, props.scope]);

    const schemaOptionsContextValue = useMemo(() => {
        return { scope, components };
    }, [scope, components]);

    return (
        <SchemaOptionsContext.Provider value={schemaOptionsContextValue}>
            <SchemaComponentsContext.Provider value={components}>
                <ExpressionScope value={scope}>{children}</ExpressionScope>
            </SchemaComponentsContext.Provider>
        </SchemaOptionsContext.Provider>
    );
});

SchemaComponentOptions.displayName = 'SchemaComponentOptions';
