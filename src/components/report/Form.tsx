import { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styled from "styled-components";

import { DataError } from "../../services/client";
import {
  ErrorMessage,
  Form,
  FormField,
  FormTextAreaField,
  SubmitButton,
} from "../../components/form";
import { useFiles } from "../../hooks";
import filesStorage from "../../storage/files";
import ImageInputList from "../../components/common/ImageInputList";
import service from "../../services/reports";

const schema = Yup.object().shape({
  title: Yup.string().min(3).max(100).required().label("Report title"),
  description: Yup.string()
    .min(5)
    .max(255)
    .required()
    .label("Report description"),
});

export type ReportInfo = Yup.InferType<typeof schema>;

const IMAGES_INPUT_LIMIT = 4;

export default function ReportForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { files, removeAllFiles } = useFiles(IMAGES_INPUT_LIMIT);

  useEffect(() => {
    return () => {
      removeAllFiles();
    };
  }, []);

  const getUserLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation)
        reject(new Error("Geolocation is not supported by this browser."));
      else {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }, reject);
      }
    });

  const handleSubmit = async (
    info: ReportInfo,
    { resetForm }: FormikHelpers<ReportInfo>
  ) => {
    try {
      setLoading(true);
      if (error) setError("");

      let locationData = { latitude: 0, longitude: 0 };
      try {
        const location = await getUserLocation();
        locationData = location;
      } catch (locError) {
        console.warn("Location access denied or unavailable:", locError);
        toast.info("Location unavailable; submitting without coordinates.");
      }

      const images = await filesStorage.saveFiles(files);

      const res = await service.saveReport({
        ...info,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        images,
      });
      setLoading(false);

      if (res.ok) {
        toast.success("Report submitted successfully! Thank you!");
        removeAllFiles();
        resetForm();
      } else {
        setError((res.data as DataError).error);
        filesStorage.deleteFiles(images);
      }
    } catch (error) {
      toast.error("Error saving your report, try again later");
      setError((error as { message?: string })?.message || "Something failed");
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Form
        initialValues={{ title: "", description: "" }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        <ImageInputList imagesLimit={IMAGES_INPUT_LIMIT} />
        <FormField name="title" placeholder="Report Title" />
        <ErrorMessage error={error} visible={!!error.length} />
        <FormTextAreaField
          name="description"
          placeholder="Report Description (This is complete anonymous. No one will know you sent it)"
        />
        <StyledSubmitButton
          title={loading ? "Submitting..." : "Submit Report"}
          disabled={loading}
        />
      </Form>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  max-width: 600px;
  margin: 1rem auto;
`;

const StyledSubmitButton = styled(SubmitButton)`
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px; /* X.com’s pill-shaped buttons */
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-hover-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
