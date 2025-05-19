import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/config";
import toast from "react-hot-toast";
import CustomTextArea from "../ui/CustomTextArea";
import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";

const ReviewDialog = ({ isDialogOpen, setIsDialogOpen, bookId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (inputData) => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    const payload = {
      ...inputData,

      rating,
    };

    try {
      const response = await fetch(`${baseUrl}/review/${bookId}`, {
        method: "POST",
        body: JSON.stringify(payload),
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
        setIsDialogOpen(false);
        reset();
        setRating(0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Book</DialogTitle>
          <DialogDescription>Leave a comment and rating.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={clsx(
                  "w-6 h-6 cursor-pointer",
                  (hoverRating || rating) >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                )}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
              />
            ))}
          </div>

          <CustomTextArea
            label="Comment"
            placeholder="Write your review here..."
            {...register("comment", { required: "Comment is required" })}
            error={errors.comment?.message}
          />

          <Button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
