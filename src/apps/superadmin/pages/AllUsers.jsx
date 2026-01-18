import React, { useEffect, useState } from "react";
import { adminService } from "../../../shared/services/adminService";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await adminService.getAllUsers(); // GET /admin/users
            setUsers(res.data || []);
        })();
    }, []);

    return (
        <div>
            <h2 className="text-xl mb-4">All Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.map((u) => (
                    <div key={u.id} className="p-3 bg-white dark:bg-slate-800 border rounded">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-slate-500">{u.email}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
