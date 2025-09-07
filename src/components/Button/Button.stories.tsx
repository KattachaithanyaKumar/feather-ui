import Button from "./Button";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
