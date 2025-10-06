/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

// --- shared tokens (match your Textarea) ---
const sizes = {
  sm: "h-9 px-1 text-sm",
  md: "h-10 px-2 text-base",
  lg: "h-11 px-2 text-lg",
} as const;
type Size = keyof typeof sizes;

const variantClasses = {
  outlined:
    "border rounded-md bg-white border-[var(--color-gray-300)] focus-within:ring-2 focus-within:ring-[var(--color-gray-300)]",
  borderless:
    "bg-transparent border-0 focus-within:ring-2 focus-within:ring-[var(--color-gray-300)] rounded-md",
  filled:
    "rounded-md bg-[var(--color-gray-100)] border border-transparent focus-within:ring-2 focus-within:ring-[var(--color-gray-300)]",
  underlined:
    "bg-transparent border-0 border-b border-[var(--color-gray-300)] focus-within:ring-2 focus-within:ring-[var(--color-gray-300)] rounded-md",
} as const;
type Variant = keyof typeof variantClasses;

const statusClasses = {
  error:
    "focus-within:ring-red-500 data-[status=error]:border-red-500 data-[status=error]:focus-within:ring-red-500",
  warning:
    "focus-within:ring-yellow-500 data-[status=warning]:border-yellow-500 data-[status=warning]:focus-within:ring-yellow-500",
} as const;
type Status = keyof typeof statusClasses;

const wrapperBase = "inline-flex w-full flex-col gap-1";
const fieldRowBase =
  "inline-flex items-stretch gap-2 border transition-[box-shadow,border-color]";
const inputBase =
  "w-full min-h-[inherit] bg-transparent outline-none placeholder:text-[var(--color-gray-400)] disabled:opacity-60 py-2";
const subtleBtn =
  "shrink-0 inline-flex items-center justify-center rounded-md px-1 py-0.5 text-xs text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] focus:outline-none focus-visible:ring-2";

// --- helpers ---
function toYMD(value?: string | Date | null): string {
  if (!value) return "";
  if (typeof value === "string") return value; // expect 'YYYY-MM-DD'
  const d = value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export interface DatePickerProps<T extends FieldValues = FieldValues>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "prefix"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "max"
    | "min"
  > {
  name?: Path<T>;
  control?: Control<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "setValueAs" | "valueAsNumber" | "valueAsDate" | "disabled"
  >;
  error?: FieldError | string;

  size?: Size;
  variant?: Variant;
  status?: Status;

  label?: React.ReactNode | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  helperText?: string;

  clearable?: boolean;

  /** Accept value as string 'YYYY-MM-DD' or Date */
  value?: string | Date;
  defaultValue?: string | Date;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string | Date;
  max?: string | Date;
}

function DatePickerInner<T extends FieldValues = FieldValues>(
  props: DatePickerProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    size = "md",
    variant = "outlined",
    status,
    className,
    id,
    label,
    placeholder,
    prefix,
    suffix,
    error,
    helperText,
    disabled,
    name,
    control,
    rules,
    clearable = false,
    value: valueProp,
    defaultValue,
    onChange,
    min,
    max,
    required,
    ...rest
  } = props as any;

  const ctx = useFormContext();
  const ctxControl =
    (control as Control<T> | undefined) ??
    (ctx && (ctx as any).control ? (ctx as any).control : undefined);

  const autoId = useId();
  const inputId = id ?? `date-${autoId}`;
  const helpId = `${inputId}-help`;

  const initial = useMemo(() => toYMD(defaultValue ?? ""), [defaultValue]);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>(initial);
  const rawValue = isControlled ? toYMD(valueProp as any) : internalValue;
  const valueStr = rawValue ?? "";

  useEffect(() => {
    if (!isControlled && typeof initial === "string") {
      setInternalValue(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
    },
    [isControlled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [setValue, onChange]
  );

  const hasError = Boolean(error) || status === "error";
  const localErrorBorderClasses = hasError
    ? variant === "underlined"
      ? "border-b-[var(--color-danger-500)] focus-within:ring-0 focus-within:border-b-[var(--color-danger-500)]"
      : variant === "borderless"
      ? "focus-within:ring-2 focus-within:ring-[var(--color-danger-500)] rounded-md"
      : "border-[var(--color-danger-500)] focus-within:ring-2 focus-within:ring-[var(--color-danger-500)]"
    : "";

  const wrapperClasses = clsx(wrapperBase, className);
  const fieldRowClasses = clsx(
    fieldRowBase,
    sizes[size as Size],
    variantClasses[variant as Variant],
    status ? statusClasses[status as Status] : null,
    status && `data-[status=${status}]`,
    localErrorBorderClasses
  );

  const describedBy: string[] = [];
  if (error || helperText) describedBy.push(helpId);
  const canClear = clearable && !disabled && valueStr.length > 0;

  const minStr = toYMD(min as any);
  const maxStr = toYMD(max as any);

  // --- RHF branch ---
  if (ctxControl && name) {
    return (
      <Controller
        name={name as any}
        control={ctxControl as any}
        rules={rules as any}
        render={({ field, fieldState }) => {
          const fieldValue = toYMD(field.value ?? "");
          const showError =
            Boolean(fieldState.error?.message) || Boolean(error);
          const errorMessage =
            fieldState.error?.message ??
            (typeof error === "string"
              ? error
              : (error as FieldError)?.message);

          const localHasError = showError || status === "error";
          const localBorderClasses = localHasError
            ? variant === "underlined"
              ? "border-b-[var(--color-danger-500)] focus-within:ring-0 focus-within:border-b-[var(--color-danger-500)]"
              : variant === "borderless"
              ? "focus-within:ring-2 focus-within:ring-[var(--color-danger-500)] rounded-md"
              : "border-[var(--color-danger-500)] focus-within:ring-2 focus-within:ring-[var(--color-danger-500)]"
            : "";

          const localFieldRowClasses = clsx(
            fieldRowBase,
            sizes[size as Size],
            variantClasses[variant as Variant],
            status ? statusClasses[status as Status] : null,
            status && `data-[status=${status}]`,
            localBorderClasses
          );

          return (
            <div className={wrapperClasses} data-status={status}>
              {label && (
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium text-gray-800"
                >
                  {label}
                  {required && <span className="ml-0.5 text-red-600">*</span>}
                </label>
              )}

              <div className={localFieldRowClasses}>
                {prefix && (
                  <div className="shrink-0 flex items-center self-stretch">
                    {prefix}
                  </div>
                )}

                <input
                  {...(rest as any)}
                  id={inputId}
                  type="date"
                  ref={(r) => {
                    field.ref(r);
                    if (typeof ref === "function") ref(r);
                    else if (ref)
                      (
                        ref as React.MutableRefObject<HTMLInputElement | null>
                      ).current = r;
                  }}
                  className={clsx(inputBase, "min-w-0 flex-1")}
                  placeholder={placeholder}
                  value={fieldValue}
                  min={minStr || undefined}
                  max={maxStr || undefined}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue(e.target.value);
                  }}
                  aria-invalid={showError ? "true" : undefined}
                  aria-describedby={
                    describedBy.length ? describedBy.join(" ") : undefined
                  }
                  disabled={disabled}
                />

                {canClear && (
                  <button
                    type="button"
                    className={subtleBtn}
                    aria-label="Clear"
                    onClick={() => {
                      field.onChange("");
                      setValue("");
                    }}
                  >
                    ×
                  </button>
                )}

                {suffix && (
                  <div className="shrink-0 flex items-center self-stretch">
                    {suffix}
                  </div>
                )}
              </div>

              <div
                id={helpId}
                className={clsx(
                  "text-xs",
                  showError || status === "error"
                    ? "text-[var(--color-danger-600)]"
                    : "text-[var(--color-gray-600)]"
                )}
              >
                {showError ? errorMessage : helperText}
              </div>
            </div>
          );
        }}
      />
    );
  }

  // --- uncontrolled/controlled (no RHF control) ---
  const showError = Boolean(error);
  const errorMessage =
    typeof error === "string" ? error : (error as FieldError)?.message;

  return (
    <div className={wrapperClasses} data-status={status}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-800">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}

      <div className={fieldRowClasses}>
        {prefix && (
          <div className="shrink-0 flex items-center self-stretch">
            {prefix}
          </div>
        )}

        <input
          {...(rest as any)}
          id={inputId}
          type="date"
          ref={ref}
          className={clsx(inputBase, "min-w-0 flex-1")}
          placeholder={placeholder}
          value={valueStr}
          min={minStr || undefined}
          max={maxStr || undefined}
          onChange={handleChange}
          aria-invalid={showError ? "true" : undefined}
          aria-describedby={
            describedBy.length ? describedBy.join(" ") : undefined
          }
          disabled={disabled}
        />

        {clearable && !disabled && valueStr && (
          <button
            type="button"
            className={subtleBtn}
            aria-label="Clear"
            onClick={() => setValue("")}
          >
            ×
          </button>
        )}

        {suffix && (
          <div className="shrink-0 flex items-center self-stretch">
            {suffix}
          </div>
        )}
      </div>

      <div
        id={helpId}
        className={clsx(
          "text-xs",
          showError || status === "error"
            ? "text-[var(--color-danger-600)]"
            : "text-[var(--color-gray-600)]"
        )}
      >
        {showError ? errorMessage : helperText}
      </div>
    </div>
  );
}

const DatePicker = forwardRef(
  DatePickerInner
) as React.ForwardRefExoticComponent<
  DatePickerProps<any> & React.RefAttributes<HTMLInputElement>
>;
DatePicker.displayName = "DatePicker";

export default DatePicker;
