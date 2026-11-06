import { getIn, setIn, type FormikErrors } from "formik";
import type { z } from "zod";

export function zodFormikValidate<Schema extends z.ZodType>(schema: Schema) {
  return (values: z.input<Schema>): FormikErrors<z.input<Schema>> => {
    const result = schema.safeParse(values);
    if (result.success) return {};
    let errors: FormikErrors<z.input<Schema>> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.map(String).join(".");
      if (path && getIn(errors, path) === undefined) errors = setIn(errors, path, issue.message);
    }
    return errors;
  };
}
