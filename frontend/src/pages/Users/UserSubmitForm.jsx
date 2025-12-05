import { useEffect, useState } from "react";
import { formMap } from "../../forms/formMap";

export default function UserSubmitForm() {
  const [FormComponent, setFormComponent] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.assignedForm) {
      setFormComponent(null);
      return;
    }

    const SelectedForm = formMap[user.assignedForm];
    if (!SelectedForm) {
      console.error("Assigned form not found:", user.assignedForm);
      setFormComponent(null);
      return;
    }

    setFormComponent(() => SelectedForm);
  }, []);

  if (!FormComponent) {
    return <div>No form assigned. Contact Admin.</div>;
  }

  return <FormComponent />;
}
