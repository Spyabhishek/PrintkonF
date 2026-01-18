import React, { useEffect, useState } from "react";
import { adminService } from "../../../shared/services/adminService";
import Card from "../../../shared/components/ui/Card";

export default function OperatorsList() {
    const [operators, setOperators] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await adminService.getOperators(); // GET /admin/operators
            setOperators(res.data || []);
        })();
    }, []);

    return (
        <div>
            <h2 className="text-xl mb-4">Operators</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {operators.map((op) => (
                    <Card key={op.id} title={op.name}>
                        <div className="text-sm text-slate-500">{op.email}</div>
                        <div className="mt-2 text-xs">Assigned: {op.assignedCount || 0}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
