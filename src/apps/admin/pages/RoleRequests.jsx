import React, { useEffect, useState } from "react";
import { adminService } from "../../../shared/services/adminService";

export default function RoleRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await adminService.getRoleRequests(); // GET /admin/role-requests
            setRequests(res.data || []);
        })();
    }, []);

    const act = async (id, action) => {
        await adminService.handleRoleRequest(id, action); // POST /admin/role-requests/:id/{approve|reject|verify}
        alert(`${action} done`);
    };

    return (
        <div>
            <h2 className="text-xl mb-4">Role upgrade requests</h2>
            <div className="space-y-2">
                {requests.map((r) => (
                    <div key={r.id} className="p-3 bg-white dark:bg-slate-800 border rounded flex justify-between">
                        <div>
                            <div className="font-medium">{r.user.name}</div>
                            <div className="text-sm">{r.message}</div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => act(r.id, "approve")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                            <button onClick={() => act(r.id, "reject")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                            <button onClick={() => act(r.id, "verify")} className="px-3 py-1 bg-indigo-600 text-white rounded">Verify</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
