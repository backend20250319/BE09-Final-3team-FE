import ProductManagement from "@/app/admin/components/ProductManagement";
import MemberManagement from "@/app/admin/components/MemberManagement";


export default function AdminMainContent({activeSidebar}){
    return(
        <div>
            {activeSidebar === "상품 관리" && <ProductManagement/>}
            {activeSidebar === "회원 관리" && <MemberManagement/>}
        </div>
    );
}