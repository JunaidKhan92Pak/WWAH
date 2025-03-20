import MobileSidebar from "./Components/MobileSidebar";
import PageTrack from "./Components/PageTrack";
import { SidebarProfile } from "./Components/SidebarProfile";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (

    <div className="h-screen relative">
    <div className="">
      <MobileSidebar />
    </div>
    <div className="flex w-full lg:p-8 ">
      <div className="h-full hidden lg:flex justify-center items-center lg:w-2/5 md:w-[25%] md:flex-col">
        <div className="hidden sm:block w-[100%]">
          <SidebarProfile />
        </div>
      </div>
      <div className="  mx-auto w-[95%] md:w-[75%] lg:w-3/5 px-5 sm:px-0">
        <div className="text-center w-[100%]">
          <PageTrack />
        </div>
        {/* <main className="md:ml-96 md:w-3/5 w-full lg:pl-5 md:mx-12 mt-5 ">{children}</main> */}
        <main className="w-[100%] flex items-center  rounded-md h-full">
          {children}
        </main>
      </div>
    </div>
  </div>
  );
};

export default DashboardLayout;
