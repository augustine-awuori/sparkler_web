import { useState } from "react";
import { useFormikContext } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styled from "styled-components";

import { ErrorMessage, FormInput } from ".";

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

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  width?: string;
  placeholder?: string;
  onTextChange?: (text: string) => void;
}

const FormField = ({
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTextChange = (text: string) => {
    onTextChange?.(text);
    setFieldValue(name, text);
  };

  return (
    <FieldWrapper>
      <InputContainer>
        <FormInput
          onBlur={() => setFieldTouched(name)}
          value={values[name]}
          onChangeText={handleTextChange}
          placeholder={placeholder || name}
          type={type === "password" && showPassword ? "text" : type}
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

const ToggleButton = styled.span`
  position: absolute;
  right: 0.75rem; // pr-3 equivalent
  top: 50%;
  transform: translateY(-50%);
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

export default FormField;
