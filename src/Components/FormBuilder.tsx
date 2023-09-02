import IdeaBuilder from "./IdeaBuilder";
import OneQForm from "./OneQForm";

const FormBuilder = () => {
  return (
    <div className="w-full h-screen min-h-screen flex flex-col justify-start items-center">
      <OneQForm classname="bg-slate-800">
        <IdeaBuilder className="" />
      </OneQForm>
    </div>
  );
};

export default FormBuilder;
