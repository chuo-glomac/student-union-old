import { Dispatch, SetStateAction } from "react";
import { LoadingWheel } from "@/components/loading";

type SubmitButtonProps = {
  label: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (formData: FormData) => void;
  isValid?: boolean;
};

export const SubmitButton = ({
  label,
  isLoading,
  setIsLoading,
  handleSubmit,
  isValid = true,
}: SubmitButtonProps) => {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    const form = e.currentTarget.form;
    if (form) {
      const formData = new FormData(form);
      try {
        await handleSubmit(formData);
      } finally {
        setIsLoading(false);
      }
    }
    // const form = e.currentTarget.form;
    // const formData = new FormData(form || undefined);
    // await handleSubmit(formData);
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`flex w-full justify-center items-center rounded-md  px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm ${
        isValid && !isLoading
          ? "bg-indigo-600 hover:bg-indigo-500"
          : "bg-indigo-300 cursor-not-allowed"
      }`}
    >
      {isLoading && <LoadingWheel size="h-4 w-4" className="mr-3" />}
      {label}
    </button>
  );
};
