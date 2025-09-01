
import SchoolCardGridSections from "@/features/search/components/sections/SchoolCardGridSections";
import SearchFilterSidebar from "@/features/search/components/sidebar/SearchFilterSidebar";

const page = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[280px_1fr] md:gap-6">
      {/* Sidebar Filters - desktop */}
      <aside className="hidden md:block">
        <div className="sticky top-20">
          <SearchFilterSidebar />
        </div>
      </aside>

      {/* Results */}
      <SchoolCardGridSections />

     
    </div>
  );
};

export default page;
