import React, { FC } from "react";
import { MainComponent } from "./MainComponent";

const Loading: FC = () => <div></div>;
const AppError: FC<{ error: Error }> = ({ error }) => {
  return (
    <div>
      <div>App Error</div>
      {error?.message}
      {error?.stack}
    </div>
  );
};

const AppNotFound: FC = () => <div>404</div>;

export const defaultAppComponents = {
  AppMain: MainComponent,
  AppSpin: Loading,
  AppError: AppError,
  AppNotFound: AppNotFound,
};
