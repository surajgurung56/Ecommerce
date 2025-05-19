import CustomInput from "@/components/ui/CustomInput";
import ImageUploader from "@/components/ImageUploader";
import { Controller, useForm } from "react-hook-form";
import CustomTextArea from "@/components/ui/CustomTextArea";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "@/config";
import CustomSelect from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/button";
import useFetchGenres from "@/hooks/useFetchGenres";
import { useEffect, useState } from "react";

const formats = [
  { name: "Paperback", value: "paperback" },
  { name: "Hardcover", value: "hardcover" },
  { name: "Exclusive Edition", value: "exclusive" },
  { name: "Signed Copy", value: "signed" },
  { name: "Limited Edition", value: "limited" },
  { name: "First Edition", value: "first" },
  { name: "Collector’s Edition", value: "collector’s" },
  { name: "Author’s Edition", value: "author’s" },
  { name: "Deluxe Edition", value: "deluxe" },
];

const UpdateBook = () => {
  const { data: genres = [] } = useFetchGenres();
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [image, setImage] = useState();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const discountPercentage = watch("discountPercentage");
  const discountStartDate = watch("discountStartDate");
  const discountEndDate = watch("discountEndDate");

  const isAnyFieldFilled =
    discountPercentage || discountStartDate || discountEndDate;

  const getBook = async () => {
    try {
      const response = await fetch(`${baseUrl}/book/${bookId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setImage(result?.data.imageURL);
        reset({
          title: result?.data.title,
          author: result?.data.author,
          isbn: result?.data.isbn,
          stock: result?.data.stock,
          price: result?.data.price,
          language: result?.data.language,
          publishedDate: result?.data.publishedDate,
          publicationName: result?.data.publicationName,
          description: result?.data.description,
          format: result?.data.format,
          gernreId: result?.data.categoryId,

          discountPercentage: result?.data.discountPercentage ?? "",
          discountStartDate: result?.data.discountStartDate ?? "",
          discountEndDate: result?.data.discountEndDate ?? "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch book:", error);
    }
  };

  const onSubmit = async (inputData) => {
    try {
      const formData = new FormData();
      formData.append("title", inputData.title);
      formData.append("author", inputData.author);
      formData.append("isbn", inputData.isbn);
      formData.append("stock", inputData.stock);
      formData.append("price", inputData.price);
      formData.append("categoryId", inputData.gernreId);
      formData.append("format", inputData.format);
      formData.append("publicationName", inputData.publicationName);
      formData.append("publishedDate", inputData.publishedDate);
      formData.append("Language", inputData.language);
      formData.append("description", inputData.description);

      formData.append("discountPercentage", inputData.discountPercentage);
      formData.append("discountStartDate", inputData.discountStartDate);
      formData.append("discountEndDate", inputData.discountEndDate);

      if (inputData.image) {
        formData.append("image", inputData.image);
      }

      const response = await fetch(`${baseUrl}/book/${bookId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/admin/books");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Some thing went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  return (
    <>
      <div className="flex ml-5 items-center space-x-1 text-2xl font-bold text-gray-700">
        <Link to={"/admin/books"}>Books</Link>
        <span>/</span>
        <span className="text-primary">Update</span>
      </div>

      <div className="mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="space-y-3">
                <CustomInput
                  label="Title"
                  type="text"
                  placeholder="Enter book title"
                  {...register("title", { required: "Event name is required" })}
                  error={errors.title?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Author"
                    placeholder="Enter book author"
                    type="text"
                    {...register("author", {
                      required: "author is required",
                    })}
                    error={errors.author?.message}
                  />

                  <CustomInput
                    label="ISBN"
                    type="text"
                    placeholder="Enter book isbn"
                    className=""
                    {...register("isbn", {
                      required: "ISBN is required",
                    })}
                    error={errors.isbn?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Stock"
                    placeholder="Enter book stock"
                    type="number"
                    {...register("stock", {
                      required: "Stock is required",
                      min: {
                        value: 1,
                        message: "Stock must be greater than 0",
                      },
                    })}
                    error={errors.stock?.message}
                  />
                  <CustomInput
                    label="Price"
                    placeholder="Enter book price"
                    type="number"
                    {...register("price", {
                      required: "price is required",
                      min: {
                        value: 1,
                        message: "Price must be greater than 0",
                      },
                    })}
                    error={errors.price?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {genres && (
                    <CustomSelect
                      label="Gernre"
                      placeholder="Select Book Gernre"
                      options={genres?.map((genre) => ({
                        label: genre.name,
                        value: genre.id,
                      }))}
                      {...register("gernreId", {
                        required: "Gernre is required",
                      })}
                      error={errors.gernreId?.message}
                    />
                  )}

                  {formats && (
                    <CustomSelect
                      label="Format"
                      placeholder="Select Book Format"
                      options={formats?.map((format) => ({
                        label: format.name,
                        value: format.value,
                      }))}
                      {...register("format", {
                        required: "Format is required",
                      })}
                      error={errors.format?.message}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Publication Name"
                    placeholder="Enter publication name"
                    type="text"
                    {...register("publicationName", {
                      required: "Publication name is required",
                    })}
                    error={errors.publicationName?.message}
                  />

                  <CustomInput
                    label="Published Date"
                    type="date"
                    className=""
                    {...register("publishedDate", {
                      required: "Published date is required",
                    })}
                    error={errors.publishedDate?.message}
                  />
                </div>

                <CustomInput
                  label="Language"
                  placeholder="Enter book language"
                  type="text"
                  {...register("language", {
                    required: "language is required",
                  })}
                  error={errors.language?.message}
                />

                <CustomTextArea
                  label="description"
                  rows="6"
                  {...register("description", {
                    required: "Description is required",
                    maxLength: {
                      value: 15000,
                      message:
                        "Description must be less than 15,000 characters",
                    },
                  })}
                  error={errors.description?.message}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 relative border border-gray-200 space-y-3">
                <CustomInput
                  label="Discount Percentage"
                  placeholder="Enter discount percentage"
                  type="number"
                  {...register("discountPercentage", {
                    min: {
                      value: 1,
                      message: "Minimum discount is 1%",
                    },
                    max: {
                      value: 100,
                      message: "Maximum discount is 100%",
                    },
                    validate: (value) => {
                      if (isAnyFieldFilled && !value)
                        return "Discount percentage is required";
                      return true;
                    },
                  })}
                  error={errors.discountPercentage?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Discount Start Date"
                    type="date"
                    {...register("discountStartDate", {
                      validate: (value) => {
                        if (isAnyFieldFilled && !value)
                          return "Start date is required";
                        return true;
                      },
                    })}
                    error={errors.discountStartDate?.message}
                  />

                  <CustomInput
                    label="Discount End Date"
                    type="date"
                    {...register("discountEndDate", {
                      validate: (value) => {
                        if (isAnyFieldFilled && !value)
                          return "End date is required";

                        const start = new Date(discountStartDate);
                        const end = new Date(value);

                        if (discountStartDate && value && end <= start) {
                          return "End date must be greater than start date";
                        }

                        return true;
                      },
                    })}
                    error={errors.discountEndDate?.message}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg shadow-sm p-6 relative border border-gray-200">
              <Controller
                control={control}
                name="image"
                rules={{
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
                    defaultImage={`${baseUrl}${image}`}
                    label="Book Cover"
                    setImage={(file) => onChange(file)}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? "Updating book..." : "Update Book"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateBook;
