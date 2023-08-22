import Display from "./Display";

const BrowserWindow = () => {
  return (
    <div className="w-screen h-screen bg-slate-400 overflow-y-scroll">
      <Display />
    </div>
  );
};

export default BrowserWindow;
