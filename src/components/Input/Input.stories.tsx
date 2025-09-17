/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
    clearable: { control: "boolean" },
    togglePassword: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

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

export const Sizes: Story = {
  args: {
    variant: "outlined",
    label: "Size: md (default)",
    placeholder: "Default size",
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input
        {...(args as any)}
        size="sm"
        label="Small (sm)"
        placeholder="small"
      />
      <Input
        {...(args as any)}
        size="md"
        label="Medium (md)"
        placeholder="medium"
      />
      <Input
        {...(args as any)}
        size="lg"
        label="Large (lg)"
        placeholder="large"
      />
    </div>
  ),
};

export const HelperAndError: Story = {
  args: {
    variant: "outlined",
    label: "With helper text",
    helperText: "Helpful hint about this field",
    placeholder: "Try it",
  },
  decorators: [
    (StoryComponent) => (
      <div style={{ display: "grid", gap: 12, width: 420 }}>
        <StoryComponent />
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

export const WithPrefixSuffix: Story = {
  args: {
    variant: "outlined",
    label: "Currency / Unit",
    placeholder: "0.00",
    prefix: "₹",
    suffix: "kg",
  },
};

export const Clearable: Story = {
  render: (args) => {
    // Use uncontrolled defaultValue so Input's internal clear button works
    return (
      <div style={{ width: 420 }}>
        <Input
          {...(args as any)}
          variant="outlined"
          label="Clearable input"
          defaultValue="Type then clear"
          clearable
        />
      </div>
    );
  },
  args: {},
};

export const Password: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <Input
        {...(args as any)}
        variant="outlined"
        label="Password"
        type="password"
        placeholder="Enter password"
        togglePassword
        clearable
      />
    </div>
  ),
  args: {},
};

export const Counter: Story = {
  args: {
    variant: "outlined",
    label: "With counter",
    showCount: true,
    maxLimit: 20,
    placeholder: "Max 20 chars",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("controlled value");
    return (
      <div style={{ width: 420 }}>
        <Input
          {...(args as any)}
          label="Controlled input"
          value={value}
          onChange={(e) => setValue((e.target as HTMLInputElement).value)}
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
