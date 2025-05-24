import { tsr } from "@/lib/react-query";

export type FindReports = {
    titleContains?: string;
    offset: number;
    limit: number;
}

export const useFindReports = ({offset, limit, titleContains}: FindReports) => {
    return tsr.findReports.useQuery({
        queryKey: ["reports", offset, limit, titleContains],
        queryData: {
            query: {
                offset: offset,
                limit: limit,
                "title~cnt": titleContains,
             }
        }
    });
}
