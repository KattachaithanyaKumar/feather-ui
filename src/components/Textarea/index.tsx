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

const sizes = {
  sm: "min-h-[72px] px-1 text-sm",
  md: "min-h-[96px] px-2 text-base",
  lg: "min-h-[128px] px-2 text-lg",
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

export interface TextareaProps<T extends FieldValues = FieldValues>
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size" | "prefix"
  > {
  name?: Path<T>;
  control?: Control<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "setValueAs" | "disable" | "valueAsNumber" | "valueAsDate"
  >;
  error?: FieldError | string;

  size?: Size;
  variant?: Variant;
  maxLimit?: number;
  showCount?: boolean;
  status?: Status;

  label?: React.ReactNode | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  helperText?: string;

  clearable?: boolean;
}

const wrapperBase = "inline-flex w-full flex-col gap-1";
const fieldRowBase =
  "inline-flex items-start gap-2 border transition-[box-shadow,border-color]";
const textareaBase =
  "w-full resize-vertical bg-transparent outline-none placeholder:text-[var(--color-gray-400)] disabled:opacity-60 py-2";
const subtleBtn =
  "shrink-0 inline-flex items-center justify-center rounded-md px-1 py-0.5 text-xs text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] focus:outline-none focus-visible:ring-2";

function TextareaInner<T extends FieldValues = FieldValues>(
  props: TextareaProps<T>,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const {
    size = "md",
    variant = "outlined",
    maxLimit = 500,
    showCount = false,
    status,
    className,
    onChange,
    value: valueProp,
    defaultValue,
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
    ...rest
  } = props;

  const ctx = useFormContext();
  const ctxControl =
    (control as Control<T> | undefined) ??
    (ctx && (ctx as any).control ? (ctx as any).control : undefined);

  const autoId = useId();
  const textareaId = id ?? `ta-${autoId}`;
  const helpId = `${textareaId}-help`;
  const countId = `${textareaId}-count`;

  const initial = useMemo(() => {
    if (typeof defaultValue === "string") return defaultValue;
    if (typeof defaultValue === "number") return String(defaultValue);
    return "";
  }, [defaultValue]);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>(initial);
  const rawValue = isControlled
    ? (valueProp as string | number | undefined) ?? ""
    : internalValue;
  const valueStr = useMemo(
    () => (rawValue == null ? "" : String(rawValue)),
    [rawValue]
  );

  useEffect(() => {
    if (
      !isControlled &&
      typeof maxLimit === "number" &&
      maxLimit > 0 &&
      internalValue.length > maxLimit
    ) {
      setInternalValue((s) => s.slice(0, maxLimit));
    }
  }, [internalValue, isControlled, maxLimit]);

  const setValue = useCallback(
    (next: string) => {
      const trimmed =
        typeof maxLimit === "number" && maxLimit > 0
          ? next.slice(0, maxLimit)
          : next;
      if (!isControlled) setInternalValue(trimmed);
    },
    [isControlled, maxLimit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      setValue(next);
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
    sizes[size],
    variantClasses[variant],
    status ? statusClasses[status] : null,
    status && `data-[status=${status}]`,
    localErrorBorderClasses
  );

  const describedBy: string[] = [];
  if (error || helperText) describedBy.push(helpId);
  if (showCount) describedBy.push(countId);
  const canClear = clearable && !disabled && valueStr.length > 0;

  if (ctxControl && name) {
    return (
      <Controller
        name={name as any}
        control={ctxControl as any}
        rules={rules as any}
        render={({ field, fieldState }) => {
          const fieldValue = field.value ?? "";
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
            sizes[size],
            variantClasses[variant],
            status ? statusClasses[status] : null,
            status && `data-[status=${status}]`,
            localBorderClasses
          );

          return (
            <div className={wrapperClasses} data-status={status}>
              {label && (
                <label
                  htmlFor={textareaId}
                  className="text-sm font-medium text-gray-800"
                >
                  {label}
                  {rest.required && (
                    <span className="ml-0.5 text-red-600">*</span>
                  )}
                </label>
              )}

              <div className={localFieldRowClasses}>
                {prefix && <div className="shrink-0 mt-2">{prefix}</div>}

                <textarea
                  {...(rest as any)}
                  id={textareaId}
                  ref={(r) => {
                    field.ref(r);
                    if (typeof ref === "function") ref(r);
                    else if (ref)
                      (
                        ref as React.MutableRefObject<HTMLTextAreaElement | null>
                      ).current = r;
                  }}
                  className={clsx(textareaBase, "min-w-0 flex-1")}
                  placeholder={placeholder}
                  value={String(fieldValue)}
                  onChange={(e) => {
                    const next = e.target.value;
                    const trimmed =
                      typeof maxLimit === "number" && maxLimit > 0
                        ? next.slice(0, maxLimit)
                        : next;
                    field.onChange(trimmed);
                    setValue(trimmed);
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

                {suffix && <div className="shrink-0 mt-2">{suffix}</div>}
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

              {showCount && typeof maxLimit === "number" && (
                <div
                  id={countId}
                  className="self-end text-[11px] text-gray-500"
                  aria-live="polite"
                >
                  {String(fieldValue).length} / {maxLimit}
                </div>
              )}
            </div>
          );
        }}
      />
    );
  }

  const showError = Boolean(error);
  const errorMessage =
    typeof error === "string" ? error : (error as FieldError)?.message;

  return (
    <div className={wrapperClasses} data-status={status}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-gray-800"
        >
          {label}
          {rest.required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}

      <div className={fieldRowClasses}>
        {prefix && <div className="shrink-0 mt-2">{prefix}</div>}

        <textarea
          {...(rest as any)}
          id={textareaId}
          ref={ref}
          className={clsx(textareaBase, "min-w-0 flex-1", sizes[size])}
          placeholder={placeholder}
          value={valueStr}
          onChange={handleChange}
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
            onClick={() => setValue("")}
          >
            ×
          </button>
        )}

        {suffix && <div className="shrink-0 mt-2">{suffix}</div>}
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

      {showCount && typeof maxLimit === "number" && (
        <div
          id={countId}
          className="self-end text-[11px] text-gray-500"
          aria-live="polite"
        >
          {valueStr.length} / {maxLimit}
        </div>
      )}
    </div>
  );
}

const Textarea = forwardRef(TextareaInner) as React.ForwardRefExoticComponent<
  TextareaProps<any> & React.RefAttributes<HTMLTextAreaElement>
>;

Textarea.displayName = "Textarea";

export default Textarea;
