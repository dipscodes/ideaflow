import { useState, useCallback } from "react";
import OneQForm from "./OneQForm";
import CategoryFormBuilder from "./CategoryFormBuilder";

const FormBuilder = () => {
  const [categoryQuestion, setCategoryQuestion] = useState<object>({});

  const addCategoryQuestion = useCallback((question: object) => {
    setCategoryQuestion(question);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const submitForm = useCallback(() => {
    const formData = new FormData();
    formData.append("mcq", JSON.stringify(categoryQuestion));
  }, [categoryQuestion]);

  return (
    <div className="w-full h-screen min-h-screen flex flex-col justify-start items-center">
      <OneQForm classname="bg-slate-800">
        <CategoryFormBuilder
          className=""
          addCategoryQuestion={addCategoryQuestion}
        />
      </OneQForm>
    </div>
  );
};

export default FormBuilder;
