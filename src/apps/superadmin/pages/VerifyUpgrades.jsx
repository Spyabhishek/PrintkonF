import React, { useEffect, useState } from "react";
import { adminService } from "../../../shared/services/adminService";

export default function VerifyUpgrades() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await adminService.getRoleRequests(); // GET /admin/role-requests
            setRequests(res.data || []);
        })();
    }, []);

    const take = async (id, action) => {
        await adminService.handleRoleRequest(id, action); // POST /admin/role-requests/:id/{approve|reject|verify|downgrade}
        alert(`${action} done`);
    };

    return (
        <div>
            <h2 className="text-xl mb-4">Verify Role Upgrades</h2>
            <div className="space-y-2">
                {requests.map((r) => (
                    <div key={r.id} className="p-3 bg-white dark:bg-slate-800 border rounded flex justify-between">
                        <div>
                            <div className="font-medium">{r.user.name}</div>
                            <div className="text-xs">{r.message}</div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => take(r.id, "approve")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                            <button onClick={() => take(r.id, "reject")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                            <button onClick={() => take(r.id, "downgrade")} className="px-3 py-1 bg-gray-600 text-white rounded">Downgrade</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
