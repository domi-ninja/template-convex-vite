import ConvexPaging from "@/components/ConvexPaging";
import { Button } from "@/components/ui/button";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

export default function Home() {

    const { results, status, loadMore } = usePaginatedQuery(
        api.myFunctions.listNumbers,
        {},
        { initialNumItems: 5 }
    );

    const addNumber = useMutation(api.myFunctions.addNumber);
    return (
        <div>
            <h1>DB Test Widget</h1>

            <div className="py-4">
                <Button
                    variant="default"
                    onClick={() => {
                        void addNumber({ value: Math.floor(Math.random() * 100) });
                    }}
                >
                    Add Number
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                    {(results ?? []).map((number: Doc<"numbers">) => (
                        <NumberItem key={number._id} number={number} />
                    ))}
                </div>
                <ConvexPaging
                    paging={{ numItems: 10, cursor: null }}
                    onChange={() => {
                        loadMore(10);
                    }}
                ></ConvexPaging>

            </div>


        </div>
    );
}

function NumberItem({ number }: { number: Doc<"numbers"> }) {
    return (
        <span
            key={number._id}
            className={`p-4 ${number.value % 2 === 0 ? "bg-blue-200" : "bg-red-200"}`}
        >
            {number.value}
        </span>
    );
}
