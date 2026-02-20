import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared";
import { createUserQuery } from "@/api/usersQueries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function CreateUserPage() {
  const { data: usersData } = useQuery(createUserQuery);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: undefined as unknown as number,
      isAdmin: false,
    },
  });

  const [resultType, setResultType] = useState<"success" | "error" | null>(null);

  const onSubmit = (data: User) => {
    console.log("Form submitted successfully:", data);
    console.log(JSON.stringify(data, null, 2));
    setResultType("success");
  };

  const onError = (formErrors: typeof errors) => {
    console.log("Form validation errors:", formErrors);
    setResultType("error");
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">Create User</h1>
        <span className="text-sm text-muted-foreground">
          {usersData?.data.length ?? 0} users fetched
        </span>
      </div>

      <form
        className="max-w-md space-y-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter full name"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            aria-invalid={!!errors.email}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            aria-invalid={!!errors.password}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min={0}
            max={150}
            placeholder="Enter age"
            aria-invalid={!!errors.age}
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
              min: { value: 0, message: "Age must be at least 0" },
              max: { value: 150, message: "Age must be at most 150" },
            })}
          />
          {errors.age && (
            <p className="text-sm text-destructive">{errors.age.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="isAdmin"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isAdmin"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
          <Label htmlFor="isAdmin">Administrator</Label>
        </div>

        <Button type="button" onClick={handleSubmit(onSubmit, onError)}>
          Submit
        </Button>
      </form>

      {resultType && (
        <p
          data-testid="form-result"
          className={`max-w-md rounded-md border p-4 text-sm font-medium ${
            resultType === "success"
              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "border-destructive bg-red-50 text-destructive dark:bg-red-950"
          }`}
        >
          {resultType === "success" ? "Success" : "Error"}
        </p>
      )}
    </div>
  );
}
