import { ReactElement } from "react";

interface Props {
  classname?: string;
  children: ReactElement[] | ReactElement;
}

const OneQForm = ({ classname, children }: Props) => {
  return (
    <div
      className={`w-full h-screen min-h-screen flex flex-col justify-center items-center ${classname}`}
    >
      {children}
    </div>
  );
};

OneQForm.defaultProps = {
  className: "",
};

export default OneQForm;
