import type { Route } from "./+types/create";
import { Form, redirect, useActionData } from "react-router";
import { createTodo } from "../lib/db.server";

export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // Validation
  if (!title || title.trim() === "") {
    return { error: "Task name is required" };
  }

  try {
    await createTodo(db, {
      title: title.trim(),
      description: description?.trim() || undefined,
    });
    return redirect("/");
  } catch (error) {
    console.error("Failed to create todo:", error);
    return { error: "Failed to create task. Please try again." };
  }
}

export default function CreateTask() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-center text-[20px] font-bold text-black mb-8">
          Create Task
        </h1>

        {actionData?.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{actionData.error}</p>
          </div>
        )}

        <Form method="post">
          <div className="flex flex-col gap-3.5 mb-6">
            <label htmlFor="title" className="text-[14px] font-bold text-black">
              Task Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter task name"
              className="bg-[#f2f2f0] rounded-[10px] h-[35px] px-[27px] text-[14px] text-black placeholder:text-[#5e5e60] focus:outline-none focus:ring-2 focus:ring-[#2920af]"
              required
            />
          </div>

          <div className="flex flex-col gap-3.5 mb-6">
            <label htmlFor="description" className="text-[14px] font-bold text-black">
              Notes
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Add notes"
              className="bg-[#f2f2f0] rounded-[10px] h-[35px] px-[27px] text-[14px] text-black placeholder:text-[#5e5e60] focus:outline-none focus:ring-2 focus:ring-[#2920af]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#2920af] text-white rounded-[30px] w-[60px] h-[34px] text-[14px] hover:bg-[#221a8f] transition-colors"
            >
              Add
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
