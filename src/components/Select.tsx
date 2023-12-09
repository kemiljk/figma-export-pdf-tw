import React from "react";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import classnames from "classnames";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

type OrderType = {
  label: string;
  type: string;
};

type SelectItemProps = {
  children: React.ReactNode;
  className?: string;
  value?: string;
};

const SelectInput = ({ onChange }) => {
  const orderTypes = [{ label: "Creation date", type: "creation" }, { label: "Canvas order",type: "canvas" }, { label: "Frame number",type: "number" }];

  const handleTypeChange = (value: string) => {
      onChange(value);
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <Label.Root
        className="text-xs font-medium text-figma-primary"
        htmlFor="order-types"
      >
        Order
      </Label.Root>
      <Select.Root onValueChange={handleTypeChange}>
        <Select.Trigger
          className="inline-flex h-8 w-full cursor-default appearance-none items-center justify-between rounded-md bg-figma-secondaryBg px-3 text-xs leading-none text-figma-primary  outline-none focus:outline-blue-700 dark:focus:outline-figma-blue"
          aria-label="Export types"
          id="order-types"
        >
          <Select.Value placeholder={orderTypes[0].label} defaultValue={orderTypes[0].type} />
          <Select.Icon className="text-figma-icon">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden rounded-md bg-figma shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] dark:border dark:border-figma-border dark:shadow-none">
            <Select.ScrollUpButton />
            <Select.Viewport className="p-2">
              {orderTypes.map((e: OrderType) => (
                <SelectItem key={e.type} value={e.type}>
                  {e.label}
                </SelectItem>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton />
            <Select.Arrow />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, value, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "relative flex h-6 select-none items-center rounded pl-6 pr-8 text-xs leading-none text-figma-primary data-[disabled]:pointer-events-none data-[highlighted]:bg-figma-blue data-[disabled]:text-figma-primary data-[highlighted]:text-figma-primary data-[highlighted]:outline-none",
          className
        )}
        {...props}
        value={value}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default SelectInput;
