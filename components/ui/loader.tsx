import { Loader as LucideLoader } from 'lucide-react';

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <LucideLoader className="animate-spin w-8 h-8 text-gray-700" />
  </div>
);

export default Loader;
