

import Loader from "./components/ls";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl z-[9999]">
     <Loader />
    </div>
  );
}