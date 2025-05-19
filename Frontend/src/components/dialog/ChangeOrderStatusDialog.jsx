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
import { useQueryClient } from "@tanstack/react-query";
import CustomSelect from "../ui/CustomSelect";

const options = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Ready For Pickup", value: "READY_FOR_PICKUP" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const ChangeOrderStatusDialog = ({ isDialogOpen, setIsDialogOpen, id }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (inputData) => {
    try {
      const response = await fetch(`${baseUrl}/admin/order/status/${id}`, {
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
        queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
        setIsDialogOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Some thing went wrong.");
      console.log(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomSelect
            label="Order Status"
            options={options}
            placeholder="Select Status"
            {...register("status", { required: "Status is required" })}
            error={errors.status?.message}
          />

          <Button>Update Status</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeOrderStatusDialog;
