import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomInput from "../ui/CustomInput";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { baseUrl } from "@/config";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import ImageUploader from "../ImageUploader";
import CustomTextArea from "../ui/CustomTextArea";

const AddBannerDilog = ({ isDilogOpen, setIsDilogOpen }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (inputData) => {
    try {
      const formData = new FormData();
      formData.append("heading", inputData.heading);
      formData.append("link", inputData.link);
      formData.append("startDate", inputData.startDate);
      formData.append("endDate", inputData.endDate);
      formData.append("Message", inputData.Message);

      if (inputData.image) {
        formData.append("image", inputData.image);
      }

      const response = await fetch(`${baseUrl}/banner`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setIsDilogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["banners"] });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Some thing went wrong");
      console.log(error);
    }
  };

  return (
    <Dialog open={isDilogOpen} onOpenChange={setIsDilogOpen}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Add banner announcement</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-4">
            <div className="w-1/2">
              <Controller
                control={control}
                name="image"
                rules={{
                  required: "Cover imageis required",
                  validate: {
                    fileSize: (file) =>
                      !file ||
                      file.size <= 10 * 1024 * 1024 ||
                      "Max file size is 10MB.",
                    fileType: (file) =>
                      !file ||
                      ["image/jpeg", "image/png", "image/webp"].includes(
                        file.type
                      ) ||
                      "Only JPG, PNG, and WEBP formats are allowed.",
                  },
                }}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <ImageUploader
                    label="Banner Image"
                    setImage={(file) => onChange(file)}
                    className={
                      "relative w-full aspect-[4/3] border-2 border-dashed items-center con border-gray-300 rounded-lg overflow-hidden"
                    }
                    error={error?.message}
                  />
                )}
              />
            </div>
            <div className="w-1/2 space-y-4">
              <CustomInput
                label="Heading"
                placeholder="Enter genre name"
                {...register("heading", { required: "Heading is required" })}
                error={errors.heading?.message}
              />

              <CustomInput
                label="Link"
                placeholder="Enter genre name"
                {...register("link", { required: "Link is required" })}
                error={errors.link?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Start Date"
                  type="date"
                  className=""
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  error={errors.startDate?.message}
                />

                <CustomInput
                  label="Due Date"
                  type="date"
                  className=""
                  {...register("endDate", {
                    required: "End date date is required",
                  })}
                  error={errors.endDate?.message}
                />
              </div>

              <CustomTextArea
                label="Message"
                placeholder="Enter genre name"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
              />

              <Button className="w-full">Add Banner Announcement</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBannerDilog;
