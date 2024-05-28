import { FC } from "react";
import { SchemaToolbarProps } from "./types";
import { useDesignable } from "../schema-component";
import { InternalSchemaToolbar } from "./hooks/useDashboardRootDesigner";

export const SchemaToolbar: FC<SchemaToolbarProps> = (props) => {
    const { designable } = useDesignable();

    if (!designable) {
        return null;
    }

    return <InternalSchemaToolbar {...props} />;
};
