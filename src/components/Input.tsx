import * as React from 'react';
import * as Label from '@radix-ui/react-label';
import { Cross1Icon } from '@radix-ui/react-icons';

const Input = ({ label, text, value, onChange, icon, disabled, placeholder }) => (
  <div className='relative flex flex-wrap w-full items-center gap-2'>
    <Label.Root className='text-xs font-medium text-figma-primary' htmlFor={label}>
      {text}
    </Label.Root>
    <input className='inline-flex h-8 w-full appearance-none items-center justify-center rounded-md bg-figma-secondaryBg px-3 text-xs leading-none text-figma-primary outline-none focus:outline-blue-700 disabled:cursor-not-allowed disabled:text-figma-secondary dark:focus:outline-figma-blue' type='text' id={label} onChange={onChange} value={value} disabled={disabled} placeholder={placeholder} />
    {icon && (
      <div className='absolute bottom-0 right-0 flex h-8 w-8 transform items-center justify-center rounded-br-md rounded-tr-md bg-figma-tertiaryBg'>
        <Cross1Icon className='h-3 w-3 text-figma-secondary' />
      </div>
    )}
  </div>
);

export default Input;
