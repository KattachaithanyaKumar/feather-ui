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
  sm: "h-9 px-2 text-sm",
  md: "h-10 px-3 text-base",
  lg: "h-11 px-4 text-lg",
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

export interface InputProps<T extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
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
  togglePassword?: boolean;
}

const inputBase =
  "block w-full bg-transparent outline-none placeholder:text-[var(--color-gray-400)] disabled:opacity-60";
const wrapperBase = "inline-flex w-full flex-col gap-1";
const fieldRowBase =
  "inline-flex items-center gap-2 border transition-[box-shadow,border-color]";
const subtleBtn =
  "shrink-0 inline-flex items-center justify-center rounded-md px-1 py-0.5 text-xs text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] focus:outline-none focus-visible:ring-2";

function InputInner<T extends FieldValues = FieldValues>(
  props: InputProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    size = "md",
    variant = "outlined",
    maxLimit = 100,
    showCount = false,
    status,
    className,
    onChange,
    value: valueProp,
    defaultValue,
    id,
    type = "text",
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
    togglePassword = false,
    ...rest
  } = props;

  const ctx = useFormContext();
  const ctxControl =
    (control as Control<T> | undefined) ??
    (ctx && (ctx as any).control ? (ctx as any).control : undefined);

  const autoId = useId();
  const inputId = id ?? `in-${autoId}`;
  const helpId = `${inputId}-help`;
  const countId = `${inputId}-count`;

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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setValue(next);
      onChange?.(e);
    },
    [setValue, onChange]
  );

  const hasError = Boolean(error) || status === "error";

  // helper class to apply when error present
  const errorBorderClasses = hasError
    ? "border-[var(--color-danger-500)] focus-within:ring-2 focus-within:ring-[var(--color-danger-500)]"
    : "";

  const [showPassword, setShowPassword] = useState(false);
  const effectiveType =
    type === "password" && togglePassword
      ? showPassword
        ? "text"
        : "password"
      : type;

  const wrapperClasses = clsx(wrapperBase, className);
  const fieldRowClasses = clsx(
    fieldRowBase,
    sizes[size],
    variantClasses[variant],
    status ? statusClasses[status] : null,
    status && `data-[status=${status}]`,
    errorBorderClasses
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
          return (
            <div className={wrapperClasses} data-status={status}>
              {label && (
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium text-gray-800"
                >
                  {label}
                  {rest.required && (
                    <span className="ml-0.5 text-red-600">*</span>
                  )}
                </label>
              )}

              <div className={fieldRowClasses}>
                {prefix && <div className="shrink-0">{prefix}</div>}

                <input
                  {...(rest as any)}
                  id={inputId}
                  ref={(r) => {
                    field.ref(r);
                    if (typeof ref === "function") ref(r);
                    else if (ref)
                      (
                        ref as React.MutableRefObject<HTMLInputElement | null>
                      ).current = r;
                  }}
                  type={effectiveType}
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
                  placeholder={placeholder}
                  className={clsx(inputBase, "min-w-0 flex-1")}
                  aria-invalid={showError ? "true" : undefined}
                  aria-describedby={
                    describedBy.length ? describedBy.join(" ") : undefined
                  }
                  disabled={disabled}
                  maxLength={
                    typeof maxLimit === "number" ? maxLimit : undefined
                  }
                />

                {canClear && (
                  <button
                    type="button"
                    className={subtleBtn}
                    aria-label="Clear input"
                    onClick={() => {
                      field.onChange("");
                      setValue("");
                    }}
                  >
                    ×
                  </button>
                )}

                {type === "password" && togglePassword && (
                  <button
                    type="button"
                    className={subtleBtn}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}

                {suffix && <div className="shrink-0">{suffix}</div>}
              </div>

              <div
                id={helpId}
                className={clsx(
                  "text-xs",
                  showError
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
        <label htmlFor={inputId} className="text-sm font-medium text-gray-800">
          {label}
          {rest.required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}

      <div className={fieldRowClasses}>
        {prefix && <div className="shrink-0">{prefix}</div>}
        <input
          {...(rest as any)}
          id={inputId}
          ref={ref}
          type={effectiveType}
          value={valueStr}
          onChange={handleChange}
          placeholder={placeholder}
          className={clsx(inputBase, "min-w-0 flex-1")}
          aria-invalid={showError ? "true" : undefined}
          aria-describedby={
            describedBy.length ? describedBy.join(" ") : undefined
          }
          disabled={disabled}
          maxLength={typeof maxLimit === "number" ? maxLimit : undefined}
        />
        {canClear && (
          <button
            type="button"
            className={subtleBtn}
            aria-label="Clear input"
            onClick={() => setValue("")}
          >
            ×
          </button>
        )}
        {type === "password" && togglePassword && (
          <button
            type="button"
            className={subtleBtn}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
        {suffix && <div className="shrink-0">{suffix}</div>}
      </div>

      <div
        id={helpId}
        className={clsx(
          "text-xs",
          showError
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

const Input = forwardRef(InputInner) as React.ForwardRefExoticComponent<
  InputProps<any> & React.RefAttributes<HTMLInputElement>
>;

Input.displayName = "Input";

export default Input;
