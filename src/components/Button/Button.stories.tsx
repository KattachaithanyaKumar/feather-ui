import Button from ".";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Check, Trash } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: [
        "default",
        "primary",
        "danger",
        "success",
        "warning",
        "dashed",
        "text",
      ],
    },
    // Matches your ButtonProps.size
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    // HTML button type attribute
    type: {
      control: { type: "radio" },
      options: ["button", "submit", "reset"],
    },
    // Simple booleans
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    block: { control: "boolean" },
    ghost: { control: "boolean" },
    // iconPosition
    iconPosition: {
      control: { type: "radio" },
      options: ["start", "end"],
    },
    // These are not trivial to control in Storybook so hide/disable them
    icon: { table: { disable: true }, control: false },
    className: { table: { disable: true }, control: false },
    // children - we keep it editable as text
    children: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Default", variant: "default" },
};

export const Primary: Story = {
  args: { children: "Primary", variant: "primary" },
};

export const Danger: Story = {
  args: { children: "Danger", variant: "danger" },
};

export const WithIcon: Story = {
  args: {
    children: "Save",
    variant: "success",
    // storybook can't render the icon via control; pass it directly here
    icon: <Check size={18} />,
  },
};

export const DeleteWithIcon: Story = {
  args: {
    children: "Delete",
    variant: "danger",
    icon: <Trash size={18} />,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    variant: "primary",
    loading: true,
  },
};

export const WithIconStart: Story = {
  args: {
    children: "Save",
    variant: "primary",
    icon: <Check size={18} />,
    iconPosition: "start",
  },
};

export const WithIconEnd: Story = {
  args: {
    children: "Next",
    variant: "primary",
    icon: <ArrowRight size={18} />,
    iconPosition: "end",
  },
};

export const LoadingStart: Story = {
  args: {
    children: "Saving",
    variant: "primary",
    loading: true,
    iconPosition: "start",
  },
};

export const LoadingEnd: Story = {
  args: {
    children: "Sending",
    variant: "primary",
    loading: true,
    iconPosition: "end",
  },
};
