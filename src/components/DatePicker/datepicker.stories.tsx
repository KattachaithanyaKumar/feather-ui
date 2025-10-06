/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import DatePicker from ".";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["outlined", "borderless", "filled", "underlined"],
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    status: {
      control: { type: "radio" },
      options: [undefined, "error", "warning"],
    },
    clearable: { control: "boolean" },
    min: { control: "date" },
    max: { control: "date" },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Outlined: Story = {
  args: {
    variant: "outlined",
    label: "Outlined",
    helperText: "Pick a date",
  },
};

export const Borderless: Story = {
  args: {
    variant: "borderless",
    label: "Borderless",
    helperText: "No border container",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Filled",
    helperText: "Subtle background",
  },
};

export const Underlined: Story = {
  args: {
    variant: "underlined",
    label: "Underlined",
    helperText: "Underline only",
  },
};

export const Sizes: Story = {
  args: {
    variant: "outlined",
  },
  render: (args) => (
    <div className="flex flex-col gap-4" style={{ width: 420 }}>
      <DatePicker {...(args as any)} size="sm" label="Small (sm)" />
      <DatePicker {...(args as any)} size="md" label="Medium (md)" />
      <DatePicker {...(args as any)} size="lg" label="Large (lg)" />
    </div>
  ),
};

export const HelperAndError: Story = {
  args: {
    variant: "outlined",
    label: "With helper text",
    helperText: "YYYY-MM-DD",
  },
  decorators: [
    (StoryComponent) => (
      <div style={{ display: "grid", gap: 12, width: 420 }}>
        <StoryComponent />
        <DatePicker
          variant="outlined"
          label="Error example"
          status="error"
          helperText="This field is required"
        />
        <DatePicker
          variant="outlined"
          label="Warning example"
          status="warning"
          helperText="Double-check this date"
        />
      </div>
    ),
  ],
};

export const WithPrefixSuffix: Story = {
  args: {
    variant: "outlined",
    label: "With prefix/suffix",
    prefix: "📅",
    suffix: "UTC",
    helperText: "Decorative addons",
  },
};

export const Clearable: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <DatePicker
        {...(args as any)}
        variant="outlined"
        label="Clearable"
        defaultValue="2024-01-15"
        clearable
      />
    </div>
  ),
  args: {},
};

export const WithMinMax: Story = {
  args: {
    variant: "outlined",
    label: "Min / Max",
    helperText: "Only Jan 2024 allowed",
    min: "2024-01-01",
    max: "2024-01-31",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("2024-02-14");
    return (
      <div style={{ width: 420 }}>
        <DatePicker
          {...(args as any)}
          label="Controlled DatePicker"
          value={value}
          onChange={(e) => setValue((e.target as HTMLInputElement).value)}
          clearable
        />
        <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
          <strong>Current value:</strong> {value || "—"}
        </div>
      </div>
    );
  },
  args: { variant: "outlined" },
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 640 }}>
      <DatePicker variant="outlined" label="Outlined" />
      <DatePicker variant="filled" label="Filled" />
      <DatePicker variant="borderless" label="Borderless" />
      <DatePicker variant="underlined" label="Underlined" />
    </div>
  ),
};
