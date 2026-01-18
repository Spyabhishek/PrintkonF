import React, { useEffect, useState } from "react";
import { adminService } from "../../shared/services/adminService";

export default function AssignedOrders() {
    const [orders, setOrders] = useState([]);
    const [operators, setOperators] = useState([]);

    useEffect(() => {
        (async () => {
            const o = await adminService.getUnassignedOrders(); // GET /admin/orders/unassigned
            const ops = await adminService.getOperators(); // GET /admin/operators
            setOrders(o.data || []);
            setOperators(ops.data || []);
        })();
    }, []);

    const assign = async (orderId, operatorId) => {
        await adminService.assignOrder(orderId, operatorId); // POST /admin/orders/:id/assign
        alert("Assigned");
    };

    return (
        <div>
            <h2 className="text-xl mb-4">Assign Orders</h2>
            <div className="space-y-2">
                {orders.map((o) => (
                    <div key={o.id} className="p-3 bg-white dark:bg-slate-800 border rounded flex items-center justify-between">
                        <div>
                            <div className="font-medium">{o.title || `Order #${o.id}`}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <select className="p-2 border rounded">
                                <option value="">Select operator</option>
                                {operators.map((op) => <option key={op.id} value={op.id}>{op.name}</option>)}
                            </select>
                            <button className="px-3 py-1 bg-indigo-600 text-white rounded">Assign</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
