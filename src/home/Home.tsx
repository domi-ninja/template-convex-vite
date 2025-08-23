import { Button } from "@/components/ui/button";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

export default function Home() {

    const numbersPage = usePaginatedQuery(
        api.myFunctions.listNumbers,
        {},
        { initialNumItems: 10 }
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
            <div className="flex flex-wrap gap-4">
                {(numbersPage.results ?? []).map((number: Doc<"numbers">) => (
                    <NumberItem key={number._id} number={number} />
                ))}
                <Button disabled={numbersPage.status === "Exhausted"} variant="secondary" onClick={() => numbersPage.loadMore(numbersPage.results.length)}>Load More</Button>
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
