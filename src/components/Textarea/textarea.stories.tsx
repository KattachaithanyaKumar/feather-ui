// src/components/Textarea.stories.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Textarea from ".";
import { useForm, FormProvider } from "react-hook-form";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
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
    showCount: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/** Basic / default */
export const Default: Story = {
  args: {
    variant: "outlined",
    label: "Comment",
    placeholder: "Write something...",
    helperText: "Short helpful hint",
  },
};

/** Variants */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4" style={{ width: 640 }}>
      <Textarea
        {...(args as any)}
        variant="outlined"
        label="Outlined"
        placeholder="Outlined"
      />
      <Textarea
        {...(args as any)}
        variant="filled"
        label="Filled"
        placeholder="Filled"
      />
      <Textarea
        {...(args as any)}
        variant="borderless"
        label="Borderless"
        placeholder="Borderless"
      />
      <Textarea
        {...(args as any)}
        variant="underlined"
        label="Underlined"
        placeholder="Underlined"
      />
    </div>
  ),
  args: {},
};

/** Sizes */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4" style={{ width: 640 }}>
      <Textarea
        {...(args as any)}
        size="sm"
        label="Small"
        placeholder="Small textarea"
      />
      <Textarea
        {...(args as any)}
        size="md"
        label="Medium"
        placeholder="Medium textarea"
      />
      <Textarea
        {...(args as any)}
        size="lg"
        label="Large"
        placeholder="Large textarea"
      />
    </div>
  ),
  args: {
    variant: "outlined",
  },
};

/** Status and helper / error */
export const StatusAndHelper: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, width: 560 }}>
      <Textarea
        {...(args as any)}
        variant="outlined"
        label="Normal"
        helperText="Helper text"
        placeholder="Try me"
      />
      <Textarea
        {...(args as any)}
        variant="outlined"
        label="Error example"
        status="error"
        helperText="This field has an error"
        placeholder="Error"
      />
      <Textarea
        {...(args as any)}
        variant="outlined"
        label="Warning example"
        status="warning"
        helperText="This field has a warning"
        placeholder="Warning"
      />
    </div>
  ),
  args: {},
};

/** Clearable + counter */
export const ClearableAndCounter: Story = {
  render: (args) => (
    <div style={{ width: 560 }}>
      <Textarea
        {...(args as any)}
        variant="outlined"
        label="Clearable with counter"
        clearable
        showCount
        maxLimit={120}
        placeholder="Type and clear"
      />
    </div>
  ),
  args: {},
};

/** Controlled example */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("Controlled value\nLine 2");
    return (
      <div style={{ width: 640 }}>
        <Textarea
          {...(args as any)}
          label="Controlled textarea"
          value={value}
          onChange={(e) => setValue((e.target as HTMLTextAreaElement).value)}
          variant="outlined"
          showCount
          maxLimit={300}
        />
        <div style={{ marginTop: 10, color: "#444" }}>
          <strong>Current value:</strong>
          <pre style={{ whiteSpace: "pre-wrap", margin: 6 }}>{value}</pre>
        </div>
      </div>
    );
  },
  args: {},
};

/** RHF validation demo */
export const RHFValidation: Story = {
  render: () => {
    const methods = useForm<{ message: string }>({
      defaultValues: { message: "" },
      mode: "onTouched",
    });

    const { handleSubmit } = methods;

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((values) => {
            // eslint-disable-next-line no-console
            console.log("submit", values);
            alert("Submitted: " + JSON.stringify(values, null, 2));
          })}
          style={{ width: 640, display: "grid", gap: 12 }}
        >
          <Textarea
            name="message"
            label="Message (required, min 10 chars)"
            placeholder="Start typing..."
            rules={{
              required: "Message is required",
              minLength: { value: 10, message: "Minimum 10 characters" },
            }}
            showCount
            maxLimit={200}
            helperText="Please enter at least 10 characters"
            variant="outlined"
          />

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              className="px-3 py-1 text-white rounded bg-[var(--color-primary-900)]"
            >
              Submit
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded border"
              onClick={() => {
                methods.reset();
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </FormProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Textarea wired to react-hook-form via `name` + `rules`. The component uses FormProvider (useFormContext) when present so you don't need to pass `control` manually.",
      },
    },
  },
  args: {},
};

/** Showcase */
export const Showcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 720 }}>
      <Textarea variant="outlined" label="Outlined" placeholder="Outlined" />
      <Textarea variant="filled" label="Filled" placeholder="Filled" />
      <Textarea
        variant="borderless"
        label="Borderless"
        placeholder="Borderless"
      />
      <Textarea
        variant="underlined"
        label="Underlined"
        placeholder="Underlined"
      />
    </div>
  ),
};
