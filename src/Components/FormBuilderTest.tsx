import OneQForm from "./OneQForm";
import Test from "./Test";

const FormBuilderTest = () => {
  return (
    <div className="w-full h-screen min-h-screen flex flex-col justify-start items-center">
      <OneQForm classname="bg-slate-800">
        <Test className="" />
      </OneQForm>
    </div>
  );
};

export default FormBuilderTest;
