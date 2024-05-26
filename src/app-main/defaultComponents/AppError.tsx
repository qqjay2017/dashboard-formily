import { FC } from "react";

export const AppError: FC<{ error: Error }> = ({ error }) => {
    return (
        <div>
            <div>App Error</div>
            {error?.message}
            {error?.stack}
        </div>
    );
};