import { z } from "zod";
import { Plus, Trash2, Upload, Edit } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { FileUploader } from "../../ui/file-uploader";
import { extendedFormSchema } from "@/src/schemas";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Switch } from "@/src/components/ui/switch";
import { formatOption, formatPrice, getPlaceholder } from "@/src/lib/utils";
import { optionTypes } from "@/src/constants/product-form";
import useProductForm from "@/src/hooks/use-product-form";
import { memo } from "react";
import { UseFormReturn } from "react-hook-form";
import { MAX_FILE_SIZE } from "@/src/constants/images";

export type FormValues = z.infer<typeof extendedFormSchema>;

const ImagesInput = memo(
  ({
    form,
    removeImageField,
  }: {
    form: UseFormReturn<FormValues>;
    removeImageField: (i: number) => void;
  }) => {
    return form
      .watch("productImages")
      .map((image: string | File, index: number) => {
        if (image instanceof File) return null;

        return (
          <div key={image} className="flex gap-3">
            <FormField
              control={form.control}
              name={`productImages.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex">
                      <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {/* @ts-expect-error: no prb*/}
                      <Input
                        required
                        placeholder="https://example.com/image.jpg"
                        className="rounded-l-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeImageField(index)}
              disabled={form.watch("productImages").length <= 2}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        );
      });
  }
);

export default function ProductForm({
  initialData,
  pageTitle = "Create New Product",
}: {
  initialData?: Partial<FormValues> | null;
  pageTitle?: string;
}) {
  const {
    addImageField,
    addSelectionStep,
    editingOptionIndex,
    form,
    handleAddOption,
    handleDeleteOption,
    handleEditOption,
    handleSaveOption,
    isOptionDialogOpen,
    isSubmitting,
    onSubmit,
    productSelectionOptions,
    removeImageField,
    removeSelectionStep,
    setIsOptionDialogOpen,
    optionForm,
  } = useProductForm({ initialData: initialData });
  return (
    <>
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {pageTitle}
          </CardTitle>
          <CardDescription>
            {initialData
              ? "Edit product details and options"
              : "Add a new product to your inventory. Fill in all required fields."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="iPhone 15 Pro" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the exact product name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="iphone-15-pro" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Base Price */}
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="iphone">iPhone</SelectItem>
                          <SelectItem value="macbook">MacBook</SelectItem>
                          <SelectItem value="apple_watch">
                            Apple Watch
                          </SelectItem>
                          <SelectItem value="ipad">iPad</SelectItem>
                          <SelectItem value="airpods">AirPods</SelectItem>
                          <SelectItem value="phonecase">Phone Case</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock */}
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Featured Product Switch */}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormLabel className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <p>Featured Product</p>
                      <FormDescription>
                        Display this product on the featured section of the
                        homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormLabel>
                )}
              />
              <Separator />
              {/* Product Images */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel className="text-base">Product Images</FormLabel>
                  <FormDescription className="text-xs">
                    Upload 2-5 images (max 5MB each)
                  </FormDescription>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                    disabled={form.watch("productImages").length >= 5}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* File uploader for multiple image files */}
                  <FormField
                    control={form.control}
                    name="productImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            value={field.value.filter(
                              (item) => item instanceof File
                            )}
                            onValueChange={(files) => {
                              const urlImages = field.value.filter(
                                (item) => typeof item === "string"
                              );
                              /* @ts-expect-error: no prob */
                              field.onChange([...urlImages, ...files]);
                            }}
                            maxFiles={5}
                            maxSize={MAX_FILE_SIZE}
                            accept={{ "image/*": [] }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* URL inputs for image URLs */}
                  <ImagesInput
                    form={form}
                    removeImageField={removeImageField}
                  />
                </div>
              </div>
              <Separator />
              {/* Product Selection Steps */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel className="text-base">
                    Product Selection Steps
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSelectionStep}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>

                {form.watch("productSelectionStep").map((_, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <FormField
                      control={form.control}
                      name={`productSelectionStep.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a step" />
                              </SelectTrigger>
                              <SelectContent>
                                {productSelectionOptions.map(
                                  ({ label, value }) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSelectionStep(index)}
                      disabled={form.watch("productSelectionStep").length <= 1}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}

                <FormDescription>
                  Select steps that customers will follow when choosing product
                  options (e.g., "Color", "Storage").
                </FormDescription>
              </div>
              <Separator />
              {/* Product Options Management */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Product Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage variations of this product (colors, materials,
                      etc.)
                    </p>
                  </div>
                  <Button type="button" onClick={handleAddOption} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                {/* @ts-expect-error: no prob */}
                {form.watch("productOptions")?.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Price ($)</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="w-[100px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* @ts-expect-error: no prob */}
                        {form.watch("productOptions").map((option, index) => {
                          // @ts-expect-error: no prob
                          const { type, value } = formatOption(option);
                          return (
                            <TableRow key={option._id || index}>
                              <TableCell className="font-medium capitalize">
                                {type}
                              </TableCell>
                              <TableCell>
                                {type === "color" ? (
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full border"
                                      style={{ backgroundColor: value }}
                                    />
                                    {value}
                                  </div>
                                ) : (
                                  value
                                )}
                              </TableCell>
                              <TableCell>{formatPrice(option.price)}</TableCell>
                              <TableCell>{option.stock}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditOption(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteOption(index)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="border rounded-md p-8 text-center">
                    <p className="text-muted-foreground">
                      No options added yet
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={handleAddOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Option
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Link to={"/dashboard/product"}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Submitting..."
                    : initialData
                    ? "Update Product"
                    : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Product Option Dialog */}
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOptionIndex !== null
                ? "Edit Option"
                : "Add Product Option"}
            </DialogTitle>
            <DialogDescription>
              {editingOptionIndex !== null
                ? "Update the details for this product option"
                : "Create a new option for this product"}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={optionForm.handleSubmit(handleSaveOption)}
            className="space-y-6"
          >
            {/* Option Type Selection */}
            <div className="grid w-full gap-1.5">
              <label htmlFor="optionType" className="text-sm font-medium">
                Option Type
              </label>
              <Select
                value={optionForm.watch("optionType")}
                onValueChange={(value) =>
                  optionForm.setValue("optionType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option type" />
                </SelectTrigger>
                <SelectContent>
                  {optionTypes.map((option) => {
                    if (
                      form.watch("productSelectionStep") &&
                      form
                        .watch("productSelectionStep")
                        .includes(option.label.toLowerCase())
                    )
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                  })}
                </SelectContent>
              </Select>
              {optionForm.formState.errors.optionType && (
                <p className="text-sm text-destructive">
                  {optionForm.formState.errors.optionType.message}
                </p>
              )}
            </div>

            {/* Option Value */}
            <div className="grid w-full gap-1.5">
              <label htmlFor="optionValue" className="text-sm font-medium">
                Option Value
              </label>
              <Input
                id="optionValue"
                type={
                  optionForm.watch("optionType") === "color" ? "color" : "text"
                }
                placeholder={getPlaceholder(
                  optionForm.watch("optionType") || ""
                )}
                value={optionForm.watch("optionValue")}
                onChange={(e) =>
                  optionForm.setValue("optionValue", e.target.value)
                }
                className="col-span-3"
              />
              {optionForm.formState.errors.optionValue && (
                <p className="text-sm text-destructive">
                  {optionForm.formState.errors.optionValue.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="grid w-full gap-1.5">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($)
                </label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={optionForm.watch("price")}
                  onChange={(e) =>
                    optionForm.setValue("price", parseFloat(e.target.value))
                  }
                />
                {optionForm.formState.errors.price && (
                  <p className="text-sm text-destructive">
                    {optionForm.formState.errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="grid w-full gap-1.5">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock
                </label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={optionForm.watch("stock")}
                  onChange={(e) =>
                    optionForm.setValue("stock", parseInt(e.target.value))
                  }
                />
                {optionForm.formState.errors.stock && (
                  <p className="text-sm text-destructive">
                    {optionForm.formState.errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOptionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingOptionIndex !== null ? "Update Option" : "Add Option"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
