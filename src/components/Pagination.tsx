import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  noOfPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  currentPage,
  noOfPages,
  setCurrentPage,
}: PaginationProps) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 bg-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-2">
        {Array.from({ length: noOfPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              onClick={() => setCurrentPage(pageNumber)}
              className={`h-8 w-8 ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white"
              }`}
            >
              {pageNumber}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === noOfPages}
        className="h-8 w-8 bg-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
