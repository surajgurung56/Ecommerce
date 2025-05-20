import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomInput from "../ui/CustomInput";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/config";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const EditGernereDilog = ({
  isAddGenreDialogOpen,
  setIsAddGenreDialogOpen,
  id,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (inputData) => {
    try {
      const response = await fetch(`${baseUrl}/category/${id}`, {
        method: "PUT",
        body: JSON.stringify(inputData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["genres"] });
        setIsAddGenreDialogOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Some thing went wrong.");
      console.log(error);
    }
  };

  const getgenre = async () => {
    try {
      const response = await fetch(`${baseUrl}/category/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        reset({ name: data?.data?.name });
      } else {
        toast.error(data.message || "Failed to fetch category.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAddGenreDialogOpen) {
      getgenre();
    }
  }, [isAddGenreDialogOpen]);

  return (
    <Dialog open={isAddGenreDialogOpen} onOpenChange={setIsAddGenreDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Genre</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomInput
            label="Genre name"
            placeholder="Enter genre name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          <Button>Add Genre</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGernereDilog;
