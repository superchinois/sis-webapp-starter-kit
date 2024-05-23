'use client'
import React, { PropsWithChildren } from "react";
import { useForm, FormProvider } from "react-hook-form";

const ReactHookFormProvider : React.FC<PropsWithChildren> = ({ children }) =>
{
  const methods = useForm();
  return (<FormProvider {...methods}>{children}</FormProvider>);
};

export default ReactHookFormProvider;