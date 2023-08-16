import React, { useState } from "react";
import { CheckboxGroupItem } from "~/components/ui/CheckboxGroup";

type EnumOption = {
  id: string;
  choiceText: string;
};
type RadioGroupProps = {
  options: EnumOption[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  isMultipleChoice?: boolean;
};

const RadioGroupMultipleChoice: React.FC<RadioGroupProps> = ({
  options,
  selectedOptions,
  onChange,
  isMultipleChoice = false,
}) => {
  const handleOptionChange = (value: string) => {
    if (!isMultipleChoice) {
      onChange([value]);
    } else {
      if (selectedOptions.includes(value)) {
        onChange(selectedOptions.filter((option) => option !== value));
      } else {
        onChange([...selectedOptions, value]);
      }
    }
  };

  return (
    <div>
      {options.map((option) => (
        <label key={option.id} className="flex items-center space-x-2 text-sm">
          <CheckboxGroupItem
            label=""
            type="checkbox"
            className="cursor-pointer"
            checked={selectedOptions.includes(option.id)}
            onChange={() => handleOptionChange(option.id)}
          />
          <span>{option.choiceText}</span>
        </label>
      ))}
    </div>
  );
};
export default RadioGroupMultipleChoice;
