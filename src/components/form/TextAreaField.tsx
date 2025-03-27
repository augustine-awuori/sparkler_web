import { useState, useRef, useEffect } from "react";
import { useFormikContext } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styled from "styled-components";

import { ErrorMessage } from ".";

const colors = {
  primary: "#1DA1F2",
  text: "#FFFFFF",
  textLight: "#8899A6",
  border: "#38444D",
  error: "#F4212E",
};

interface FieldValue {
  [key: string]: string;
}

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  width?: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
  type?: string;
}

const TextAreaField = ({
  name,
  width = "100%",
  onTextChange,
  placeholder,
  type = "text",
  ...inputProps
}: Props) => {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext<FieldValue>();
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleTextChange = (text: string) => {
    onTextChange?.(text);
    setFieldValue(name, text);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
    }
  }, [values[name]]);

  return (
    <FieldWrapper>
      <InputContainer>
        <StyledTextarea
          ref={textareaRef}
          onBlur={() => setFieldTouched(name)}
          value={values[name]}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder || name}
          style={{ width }}
          {...inputProps}
        />
        {type === "password" && (
          <ToggleButton onClick={handleTogglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </ToggleButton>
        )}
      </InputContainer>
      <StyledErrorMessage error={errors[name]} visible={!!touched[name]} />
    </FieldWrapper>
  );
};

const FieldWrapper = styled.section`
  margin-bottom: 0.8rem;
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.border};
  border-radius: 0.25rem;
  font-size: 1rem;
  color: ${colors.text};
  background: transparent;
  resize: none; /* Disable manual resizing */
  outline: none;
  overflow: hidden; /* Hide scrollbar */
  min-height: 2.5rem; /* Minimum height to avoid collapse */

  &:focus {
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${colors.textLight};
  }
`;

const ToggleButton = styled.span`
  position: absolute;
  right: 0.75rem;
  top: 1rem;
  color: ${colors.textLight};
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const StyledErrorMessage = styled(ErrorMessage)`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${colors.error};
  font-weight: 400;
`;

export default TextAreaField;
