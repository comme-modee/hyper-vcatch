import { yupResolver } from '@hookform/resolvers/yup';
import { Form as BSForm } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';

const Form = ({
  schema,
  onSubmit,
  children,
  defaultValues,
  ...props
}) => {
  const methods = useForm({
    ...(schema != null ? { resolver: yupResolver(schema) } : {}),
    defaultValues,
    mode: 'onChange',
  });
  
  // useForm 훅의 반환값에서 formState를 가져옴
  const { formState: { errors } } = methods;

  return (
    <FormProvider {...methods}>
      <BSForm onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {children.map((child, index) => {
          const fieldName = child.props.name;
          const errorMessage = errors[fieldName]?.message;
          return (
            <div className='mb-3' key={`${child}${index}`}>
              {child}
              {errors[fieldName] && <small className='text-danger ms-2'>{errorMessage}</small>}
            </div>
          )
        })}
      </BSForm>
    </FormProvider >
  );
};

export default Form;
