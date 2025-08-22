import { PaginationOptions } from "convex/server";
import { Pagination, PaginationContent, PaginationNext, PaginationPrevious } from "./ui/pagination";

export type ConvexPagingProps = {
    paging: PaginationOptions;
    onChange: (next: PaginationOptions) => void;
    disabled?: boolean;
};

export default function ConvexPaging({ paging, totalPages, onChange, disabled }: ConvexPagingProps) {

    const setPage = (nextPage: number) => {
        if (disabled) return;
        const clampedPageNr = Math.max(1, Math.min(totalPages, nextPage));
        if (clampedPageNr !== paging.page) {
            onChange({ ...paging, page: clampedPageNr });
        }
    };

    return (
        <Pagination>
            {JSON.stringify(paging)}<br />
            <PaginationContent>
                <PaginationPrevious onClick={() => setPage(paging.page - 1)} disabled={disabled || paging.page === 1}
                />

                {/* Page numbers omitted for cursor pagination */}

                <PaginationNext
                    onClick={() => setPage(paging.page + 1)} disabled={disabled || paging.page === totalPages}
                />
            </PaginationContent>
        </Pagination>
    );
}
