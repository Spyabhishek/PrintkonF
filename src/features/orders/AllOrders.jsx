import React, { useEffect, useState } from "react";
import { adminService } from "../../shared/services/adminService";
import StatusBadge from "../../shared/components/feedback/StatusBadge";

export default function AllOrders() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await adminService.getAllOrders(); // GET /admin/orders
            setOrders(res.data || []);
        })();
    }, []);

    return (
        <div>
            <h2 className="text-xl mb-4">All Orders</h2>
            <div className="space-y-2">
                {orders.map((o) => (
                    <div key={o.id} className="p-3 bg-white dark:bg-slate-800 border rounded flex justify-between items-center">
                        <div>
                            <div className="font-medium">{o.title || `Order #${o.id}`}</div>
                            <div className="text-sm text-slate-500">{o.user?.email}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={o.status} />
                            <button className="text-indigo-600">Approve</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
