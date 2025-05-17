import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomInput from "../ui/CustomInput";
import { useForm } from "react-hook-form";

import CustomButton from "../ui/CustomButton";
import RegisterDialog from "./RegisterDialog";
import toast from "react-hot-toast";
import { baseUrl } from "@/config";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginDialog = ({ isLoginModalOpen, setIsLoginModalOpen }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const { setToken } = useContext(UserContext);

  const onSubmit = async (inputData) => {
    const response = await fetch(`${baseUrl}/auth/login`, {
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

      if (data.roles && data.roles.includes("admin")) {
        navigate("/admin");
      }

      setIsLoginModalOpen(false);

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <RegisterDialog
        isRegisterModalOpen={isRegisterModalOpen}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 py-4">
            <form
              className="flex flex-col space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <CustomInput
                label="Email address"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                autoComplete="username"
                error={errors.email?.message}
              />

              <CustomInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                autoComplete="current-password"
                error={errors.password?.message}
              />

              <CustomButton
                text={isSubmitting ? "Logging in..." : "Sign in"}
                loading={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              />
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <span
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsRegisterModalOpen(true);
                }}
              >
                Create an account
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginDialog;
