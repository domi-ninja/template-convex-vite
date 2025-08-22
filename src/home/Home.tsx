import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
    const numbers = useQuery(api.myFunctions.listNumbers, { count: 10 });
    const addNumber = useMutation(api.myFunctions.addNumber);

    return (
        <div>
            <h1>DB Test Widget</h1>

            <div className="flex flex-row gap-2">
                {numbers?.map((number) => (
                    <span key={number._id}>{number.value}</span>
                ))}
            </div>
            <Button
                variant="default"
                onClick={() => {
                    void addNumber({ value: Math.floor(Math.random() * 100) });
                }}
            >
                Add Number
            </Button>

        </div>
    );
}
