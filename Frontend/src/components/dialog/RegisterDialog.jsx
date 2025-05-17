import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomInput from "../ui/CustomInput";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import CustomButton from "../ui/CustomButton";
import { baseUrl } from "@/config";
import toast from "react-hot-toast";

const RegisterDialog = ({
  isRegisterModalOpen,
  setIsRegisterModalOpen,
  setIsLoginModalOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [formErrors, setFormErrors] = React.useState({});

  const onSubmit = async (inputData) => {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      body: JSON.stringify(inputData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.isSuccess) {
      toast.success(data.message);
      setIsRegisterModalOpen(false);
      setIsLoginModalOpen(true);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Create your account to get started.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col space-y-4 my-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomInput
            label="Name"
            type="text"
            placeholder="Enter your full name"
            {...register("name", {
              required: "Name is required",
              maxLength: {
                value: 100,
                message: "Name must be at least 100 characters long",
              },
            })}
            error={errors?.name?.message || formErrors?.name}
          />
          <CustomInput
            label="Email address"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              maxLength: {
                value: 100,
                message: "Email must be at least 100 characters long",
              },
            })}
            error={errors?.email?.message || formErrors?.email}
          />

          <CustomInput
            label="Contact Number"
            type="tel"
            placeholder="Enter your contact number"
            {...register("contactNumber", {
              required: "Contact number is required",
              maxLength: {
                value: 10,
                message: "Email must be at least 100 characters long",
              },
            })}
            error={errors?.contactNumber?.message || formErrors?.email}
          />

          <CustomInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              maxLength: {
                value: 30,
                message: "Password must be at least 30 characters long",
              },
            })}
            error={errors?.password?.message || formErrors.password}
          />

          <CustomButton
            text={isSubmitting ? "Creating Account..." : "Create Account"}
            loading={isSubmitting}
            disabled={isSubmitting}
            type="submit"
          />
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              setIsRegisterModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          >
            Login
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
