import { ReactNode } from "react";
import { Formik, FormikHelpers, FormikValues } from "formik";

interface Props<FormValues extends FormikValues> {
  children: ReactNode;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
  validationSchema: object;
  initialValues: FormValues;
  title?: string;
}

const Form = <FormValues extends FormikValues>({
  children,
  title,
  validationSchema,
  ...otherProps
}: Props<FormValues>) => (
  <form
    className="max-w-500 m-y-auto"
    style={{ maxWidth: "500px", margin: "auto" }}
  >
    {title && <h1 className="text-center font-bold text-lg">{title}</h1>}
    <Formik<FormValues> {...otherProps} validationSchema={validationSchema}>
      {() => <section>{children}</section>}
    </Formik>
  </form>
);

export default Form;
