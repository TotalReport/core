import { tsr } from "@/lib/react-query";

export const useFindReport = ({id}: {id: number}) => {
    return tsr.readReport.useQuery({
        queryKey: ["report", id],
        queryData: {
            params: { id }
        }
    });
}
