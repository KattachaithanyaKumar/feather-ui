/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";

export interface FormProps<T extends FieldValues = FieldValues>
  extends Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "children"
  > {
  options?: UseFormProps<T>;
  methods?: UseFormReturn<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  onError?: (errors: any) => void;
  children: React.ReactNode | ((methods: UseFormReturn<T>) => React.ReactNode);
}

export function Form<T extends FieldValues = FieldValues>({
  options,
  methods,
  onSubmit,
  onError,
  children,
  ...rest
}: FormProps<T>) {
  const internalMethods = useForm<T>(options);
  const formMethods = methods || internalMethods;

  const submitHandler = onSubmit
    ? formMethods.handleSubmit(onSubmit, onError)
    : undefined;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={submitHandler} {...rest}>
        {typeof children === "function" ? children(formMethods) : children}
      </form>
    </FormProvider>
  );
}
