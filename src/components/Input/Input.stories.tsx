import React, { useState } from "react";
import Input from ".";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
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
    type: {
      control: { type: "radio" },
      options: ["text", "password", "email", "number"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/** Basic variants */
export const Outlined: Story = {
  args: {
    variant: "outlined",
    label: "Outlined",
    placeholder: "Type here...",
  },
};

export const Borderless: Story = {
  args: {
    variant: "borderless",
    label: "Borderless",
    placeholder: "No border",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Filled",
    placeholder: "Background filled",
  },
};

export const Underlined: Story = {
  args: {
    variant: "underlined",
    label: "Underlined",
    placeholder: "Underlined input",
  },
};

/** Sizes */
export const Sizes: Story = {
  args: {
    variant: "outlined",
    label: "Size: md (default)",
    placeholder: "Default size",
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} size="sm" label="Small (sm)" placeholder="small" />
      <Input {...args} size="md" label="Medium (md)" placeholder="medium" />
      <Input {...args} size="lg" label="Large (lg)" placeholder="large" />
    </div>
  ),
};

/** Status / helper / error */
export const HelperAndError: Story = {
  args: {
    variant: "outlined",
    label: "With helper text",
    helperText: "Helpful hint about this field",
    placeholder: "Try it",
  },
  decorators: [
    (Story) => (
      <div style={{ display: "grid", gap: 12, width: 420 }}>
        <Story />
        <Input
          variant="outlined"
          label="Error example"
          status="error"
          helperText="This value is required"
          placeholder="Error state"
        />
        <Input
          variant="outlined"
          label="Warning example"
          status="warning"
          helperText="Be careful with this value"
          placeholder="Warning state"
        />
      </div>
    ),
  ],
};

/** Prefix and suffix examples */
export const WithPrefixSuffix: Story = {
  args: {
    variant: "outlined",
    label: "Currency / Unit",
    placeholder: "0.00",
    prefix: "₹",
    suffix: "kg",
  },
};

/** Clearable */
export const Clearable: Story = {
  args: {
    variant: "outlined",
    label: "Clearable input",
    clearable: true,
    placeholder: "Type then clear",
  },
};

/** Password toggle */
export const PasswordToggle: Story = {
  args: {
    variant: "outlined",
    label: "Password",
    type: "password",
    togglePassword: true,
    placeholder: "Enter password",
    clearable: true,
  },
};

/** Character counter */
export const Counter: Story = {
  args: {
    variant: "outlined",
    label: "With counter",
    showCount: true,
    maxLimit: 20,
    placeholder: "Max 20 chars",
  },
};

/** Controlled component demo (renders with internal state) */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("controlled value");
    return (
      <div style={{ width: 420 }}>
        <Input
          {...args}
          label="Controlled input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
        />
        <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
          <strong>Current value:</strong> {value}
        </div>
      </div>
    );
  },
  args: {
    variant: "outlined",
  },
};

/** Compact showcase: all variants in a row */
export const Showcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 640 }}>
      <Input variant="outlined" label="Outlined" placeholder="Outlined" />
      <Input variant="filled" label="Filled" placeholder="Filled" />
      <Input variant="borderless" label="Borderless" placeholder="Borderless" />
      <Input variant="underlined" label="Underlined" placeholder="Underlined" />
    </div>
  ),
};
