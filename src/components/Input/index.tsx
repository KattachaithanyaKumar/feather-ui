import React, {
  forwardRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useId,
} from "react";
import clsx from "clsx";

/** Sizes */
const sizes = {
  sm: "h-9 px-2 text-sm",
  md: "h-10 px-3 text-base",
  lg: "h-11 px-4 text-lg",
} as const;
type Size = keyof typeof sizes;

/** Variants */
const variantClasses = {
  outlined:
    "border rounded-md bg-white border-gray-300 focus-within:ring-2 focus-within:ring-gray-300",
  borderless:
    "bg-transparent border-0 focus-within:ring-2 focus-within:ring-gray-300",
  filled:
    "rounded-md bg-gray-100 border border-transparent focus-within:ring-2 focus-within:ring-gray-300",
  underlined:
    "bg-transparent border-0 border-b border-gray-300 focus-within:ring-2 focus-within:ring-gray-300",
} as const;
type Variant = keyof typeof variantClasses;

/** Status */
const statusClasses = {
  error:
    "focus-within:ring-red-500 data-[status=error]:border-red-500 data-[status=error]:focus-within:ring-red-500",
  warning:
    "focus-within:ring-yellow-500 data-[status=warning]:border-yellow-500 data-[status=warning]:focus-within:ring-yellow-500",
} as const;
type Status = keyof typeof statusClasses;

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  size?: Size;
  variant?: Variant;
  showCount?: boolean;
  /** Character cap for the counter and maxLength attribute */
  maxLimit?: number;
  status?: Status;
  /** Visually-associated label text */
  label?: string;
  /** Optional helper text under the field (errors, hints, etc.) */
  helperText?: string;
  /** Node before the input (icon, text) */
  prefix?: React.ReactNode;
  /** Node after the input (icon, text) */
  suffix?: React.ReactNode;
  /** Show a clear “×” button when there is a value */
  clearable?: boolean;
  /** If type="password", allow toggling visibility */
  togglePassword?: boolean;
  /** Called with the next string value whenever it changes */
  onValueChange?: (next: string) => void;
};

const inputBase =
  "block w-full bg-transparent outline-none placeholder:text-gray-400 disabled:opacity-60";

/** Wrapper applies borders, rings, and padding; input gets bg-transparent */
const wrapperBase = "inline-flex w-full flex-col gap-1";
const fieldRowBase =
  "inline-flex items-center gap-2 border transition-[box-shadow,border-color]";

/** Button used for clear / toggle */
const subtleBtn =
  "shrink-0 inline-flex items-center justify-center rounded-md px-1 py-0.5 text-xs text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "md",
    variant = "outlined",
    showCount = false,
    maxLimit = 100,
    status,
    className,
    onChange,
    onValueChange,
    value: valueProp,
    defaultValue,
    id,
    type = "text",
    label,
    helperText,
    prefix,
    suffix,
    clearable = false,
    togglePassword = false,
    children, // intentionally unused to keep component simple
    dangerouslySetInnerHTML, // intentionally disabled for safety
    ...rest
  },
  ref
) {
  void children;
  void dangerouslySetInnerHTML;

  const autoId = useId();
  const inputId = id ?? `in-${autoId}`;
  const helpId = `${inputId}-help`;
  const countId = `${inputId}-count`;

  // Uncontrolled initial value
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

  // Always string for the DOM input
  const valueStr = useMemo(
    () => (rawValue == null ? "" : String(rawValue)),
    [rawValue]
  );

  // Enforce maxLimit on uncontrolled, and emit onValueChange
  const setValue = useCallback(
    (next: string) => {
      const trimmed =
        typeof maxLimit === "number" && maxLimit > 0
          ? next.slice(0, maxLimit)
          : next;
      if (!isControlled) setInternalValue(trimmed);
      onValueChange?.(trimmed);
    },
    [isControlled, maxLimit, onValueChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setValue(next);
      onChange?.(e);
    },
    [setValue, onChange]
  );

  // Keep uncontrolled value clamped if maxLimit changes
  useEffect(() => {
    if (!isControlled && typeof maxLimit === "number" && maxLimit > 0) {
      if (internalValue.length > maxLimit) {
        setInternalValue((s) => s.slice(0, maxLimit));
      }
    }
  }, [internalValue, isControlled, maxLimit]);

  // Password toggle
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
    // Provide status as data attr for CSS targeting if desired
    status && `data-[status=${status}]`
  );

  const describedByIds: string[] = [];
  if (helperText) describedByIds.push(helpId);
  if (showCount) describedByIds.push(countId);

  const canClear = clearable && valueStr.length > 0 && !rest.disabled;

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
          {...rest}
          id={inputId}
          ref={ref}
          type={effectiveType}
          value={valueStr}
          onChange={handleChange}
          className={clsx(inputBase, "min-w-0 flex-1")}
          aria-invalid={status === "error" ? "true" : undefined}
          aria-describedby={
            describedByIds.length ? describedByIds.join(" ") : undefined
          }
          maxLength={typeof maxLimit === "number" ? maxLimit : undefined}
        />

        {/* Clear button */}
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

        {/* Password visibility toggle */}
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

      {/* Helper / error text */}
      {helperText && (
        <div
          id={helpId}
          className={clsx(
            "text-xs",
            status === "error"
              ? "text-red-600"
              : status === "warning"
              ? "text-yellow-700"
              : "text-gray-600"
          )}
        >
          {helperText}
        </div>
      )}

      {/* Character counter */}
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
});

Input.displayName = "Input";

export default Input;
