import Button from "./Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Check, Trash } from "lucide-react"; // example icons

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
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

// ✅ New stories with icons
export const WithIcon: Story = {
  args: {
    children: "Save",
    variant: "success",
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

// ✅ Loading state
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
