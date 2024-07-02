import {
  FieldValues,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { z, AnyZodObject } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FormRegister = UseFormRegister<FieldValues>;

export type FormHandleSubmit = UseFormHandleSubmit<
  { [x: string]: unknown },
  undefined
>;

const useAppForm = (schema: AnyZodObject) => {
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({ resolver: zodResolver(schema) });
  const {
    formState: { errors },
  } = form;

  return { errors, ...form };
};

export default useAppForm;
