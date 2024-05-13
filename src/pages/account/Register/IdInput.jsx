import { Button, Form, InputGroup } from 'react-bootstrap';
import { Controller, useFormContext } from "react-hook-form";
import useIdDuplicationCheck from './useIdDuplicationCheck';

export default function IdInput({
  name,
  id,
  className,
  containerClass,
  label,
  placeholder,
  helpText,
  errors,
  register,
  type,
  ...props
}) {

  const { control } = useFormContext();
  const { idDuplicationCheck } = useIdDuplicationCheck();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Group className={containerClass ?? ''}>
          {label && <Form.Label>{label}</Form.Label>}
          <InputGroup>
            <Form.Control
              id={id}
              type={type}
              {...props}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              placeholder={placeholder}
              className={fieldState.error&&className}
              isInvalid={Boolean(fieldState.error?.message)}
            />
            <Button variant="primary" id="button-addon2" onClick={() => idDuplicationCheck(field.value)}>
                아이디 중복체크
            </Button>
            {helpText && (
              <Form.Text id={`${name}-help`} muted>
                {helpText}
              </Form.Text>
            )}
            {errors && errors[name] && (
              <Form.Control.Feedback type="invalid">
                {errors[name]['message']}
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>
      )}
    />
  );
}
