'use client';
import { deleteAppointment } from "@/modules/delete/actions";
import { useTransition, useState } from "react";

export default function DeleteButton({
    id
}: {
    id: number
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>('');

    const handleDelete = () => {
        if (confirm(`Delete appintment ID: "${id}"?`)) {
            startTransition(async () => {
                const result = await deleteAppointment(id);
                if (result?.error) {
                    setError(result.error);
                }
            });
        }
    };

    return (
        <>
            {error && (
                <span className="text-sm text-red-700">
                    {error}
                </span>
            )}
            <button
                onClick={handleDelete}
                className="p-1 text-black font-bold rounded-lg transition-colors hover:text-white hover:bg-red-600"
                >
                {isPending ? 'Deleting...' : 'Delete'}
            </button>
        </>
    );
};