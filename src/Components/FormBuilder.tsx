import { useState, useCallback } from "react";
import OneQForm from "./OneQForm";
import CategoryFormBuilderDiv from "./CategoryFormBuilderDiv";

const FormBuilder = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [categoryQuestion, setCategoryQuestion] = useState<object>({});

  const addCategoryQuestion = useCallback((question: object) => {
    setCategoryQuestion(question);
  }, []);

  return (
    <div className="w-full h-screen min-h-screen flex flex-col justify-start items-center">
      <OneQForm classname="bg-slate-800">
        <CategoryFormBuilderDiv
          className=""
          addCategoryQuestion={addCategoryQuestion}
        />
      </OneQForm>
    </div>
  );
};

export default FormBuilder;
