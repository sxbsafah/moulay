import { Outlet } from "react-router";
import Header  from "@/components/Header";



const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default MainLayout



